const MusicRepository = require("../repositories/MusicRepository");
const {Op} = require("sequelize");
const GENRES = require("../constants/genres");
const fs = require("fs").promises;
const mime = require("mime-types");
const ErrorApp = require("../utils/errorApp");
const ErrorCodes = require("../constants/errorCodes");

module.exports = {

    async uploadMusic(data, file){

      if(!file){
        throw new ErrorApp(
          "Arquivo de audio não enviado",
          400,
          ErrorCodes.INVALID_DATA
        );
      }
      if(data.musicName.length < 2){
        throw new ErrorApp(
          "Nome da musica muito curto.",
          400,
          ErrorCodes.INVALID_NAME
        );
      }
      if(data.artistName.length < 2){
        throw new ErrorApp(
          "Nome do artista muito curto.",
          400,
          ErrorCodes.INVALID_NAME
        );
      }
      if(!GENRES.includes(data.genre.toLowerCase())){
        throw new ErrorApp(
          "Genero de musica invalido.",
          400,
          ErrorCodes.INVALID_GENRE
        );
      }

      const existFileName = await MusicRepository.findByName(data.musicName);
      if(existFileName){
        throw new ErrorApp(
          "Nome de musica em uso.",
          400,
          ErrorCodes.INVALID_NAME
        );
      }

      const newMusic = await MusicRepository.createMusic(data);

      return music = {
        musicId: newMusic.id,
        MusicName: newMusic.musicName,
        artist: newMusic.artistName,
        genre: newMusic.genre
      };
    },

    async searchMusics(data){

      if(data.genre && !GENRES.includes(data.genre.toLowerCase())){
        throw new ErrorApp(
          "Genero de musica invalido.",
          400,
          ErrorCodes.INVALID_GENRE
        );
      }

      let where = {};

      if(data.musicName && typeof data.musicName === "string"){
        where.musicName = {[Op.iLike]: `%${data.musicName}%`};
      }
      if(data.artistName && typeof data.artistName === "string"){
        where.artistName = [Op.iLike] `%${data.artistName}%`;
      }
      if(data.genre){
          where.genre = `${data.genre.toLowerCase()}`;
      }

      const musicsArray = await MusicRepository.searchMusics(where);
      if(musicsArray.length === 0){
        throw new ErrorApp(
          "Nenhuma musica encontrada",
          404,
          ErrorCodes.MUSIC_NOT_FOUND
        );
      }
      
      return musicsArray;
    },

    async deleteMusic(musicId, userId){
      const musicData = await MusicRepository.findById(musicId);
      if(!musicData){
        throw new ErrorApp(
          "Musica não existe.",
          404,
          ErrorCodes.MUSIC_NOT_FOUND
        );
      }
      if(musicData.userId !== userId){
        throw new ErrorApp(
          "Usuario não autorizado",
          403,
          ErrorCodes.UNAUTHORIZED_ACTION
        );
      }

      await fs.unlink(musicData.path);
      
      await MusicRepository.deleteMusic(musicId);

      return musicData.musicName;
    },

    async updateMusic(data, musicId, userId){

      if(data.musicName && data.musicName.length < 2){
        throw new ErrorApp(
          "Nome de musica muito curto.",
          400,
          ErrorCodes.INVALID_NAME
        );
      }
      if(data.artistName && data.artistName.length < 2){
        throw new ErrorApp(
          "Nome do artista muito curto.",
          400,
          ErrorCodes.INVALID_NAME
        );
      }
      if(data.genre && !GENRES.includes(data.genre.toLowerCase())){
        throw new ErrorApp(
          "Genero de musica invalido.",
          400,
          ErrorCodes.INVALID_GENRE
        );
      }

      const music = await MusicRepository.findById(musicId);
      if(!music){
        throw new ErrorApp(
          "Musica não existe.",
          404,
          ErrorCodes.MUSIC_NOT_FOUND
        );
      }
      if(music.userId !== userId){
        throw new ErrorApp(
          "Usuario não autorizado.",
          403,
          ErrorCodes.UNAUTHORIZED_ACTION
        );
      }

      const musicNameExist = await MusicRepository.findByName(data.musicName);
      if(musicNameExist && music.musicName !== data.musicName){
        throw new ErrorApp(
          "Nome da musica ja em uso.",
          400,
          ErrorCodes.INVALID_NAME
        );
      }

      const updateMusicData = {
            musicName: data.musicName || music.musicName,
            artistName: data.artistName || music.artistName,
            genre: data.genre.toLowerCase() || music.genre
      };

      await MusicRepository.updateMusic(updateMusicData, musicId);
      const updatedMusic = await MusicRepository.findById(musicId);

      return {
        musicId: musicId,
        newName: updatedMusic.musicName,
        artistName: updatedMusic.artistName,
        genre: updatedMusic.genre
      };
    
    },

    async getMusicFile(musicId){
      const musicData = await MusicRepository.findById(musicId);
      if(!musicData){
        throw new ErrorApp(
          "Musica não existe.",
          404,
          ErrorCodes.MUSIC_NOT_FOUND
        );
      }

      const mimeType = mime.lookup(musicData.path);
      if (!mimeType || !mimeType.startsWith("audio/")) {
        throw new ErrorApp(
          "Extensão de arquivo invalida.",
          500,
          ErrorCodes.INTERNAL_ERROR
        );
      }

      return {
        path: musicData.path,
        musicName: musicData.musicName,
        mimeType
      };
    },

    async deleteMusicsByUserId(userId){
      const musicArray = await MusicRepository.findMusicsPathByUser(userId);

        await Promise.allSettled(
          musicArray.map(async (music) => {
            await fs.unlink(music.path);
          })
        );
    },

    async findMusic(musicId){
      return MusicRepository.findById(musicId);
    }

};