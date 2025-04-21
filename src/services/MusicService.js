const MusicRepository = require("../repositories/MusicRepository");
const {Op} = require("sequelize");
const GENRES = require("../constants/genres");
const fs = require("fs").promises;
const mime = require("mime-types");
const ErrorApp = require("../utils/errorApp");
const ErrorCodes = require("../constants/errorCodes");
const Validator = require("../utils/validator");

module.exports = {

    async uploadMusic(data, file){
      Validator.validateRequireField(file, "Arquivo");

      Validator.validateRequireField(data.musicName, "Musica");
      Validator.validateFieldLength(data.musicName, 2, "Musica");

      Validator.validateRequireField(data.artistName, "Artista");
      Validator.validateFieldLength(data.artistName, 2, "Artista");

      Validator.validateRequireField(data.genre, "Genero");
      Validator.validateGenre(data.genre);

      const existFileName = await MusicRepository.findByName(data.musicName);
      Validator.validateIfExist(existFileName, "Musica")

      const newMusic = await MusicRepository.createMusic(data);

      return music = {
        musicId: newMusic.id,
        MusicName: newMusic.musicName,
        artist: newMusic.artistName,
        genre: newMusic.genre
      };
    },

    async searchMusics(data, page){
      Validator.validatePage(page, "Página");
      if(data.genre) Validator.validateGenre(data.genre);

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

      const limit = 10;
      const offset = (page - 1) * limit;
      const musicsArray = await MusicRepository.searchMusics(where, offset, limit);
      Validator.validateArrayNotEmpty(musicsArray, "Musica");
      
      return musicsArray;
    },

    async deleteMusic(musicId, userId){
      const musicData = await MusicRepository.findById(musicId);
      Validator.validateNonExistence(musicData, "Musica");
      Validator.validateUserAutorization(musicData.userId, userId);

      await fs.unlink(musicData.path);
      
      await MusicRepository.deleteMusic(musicId);

      return musicData.musicName;
    },

    async updateMusic(data, musicId, userId){

      if(data.musicName) Validator.validateFieldLength(data.musicName, 2, "Musica");
      if(data.artistName)  Validator.validateFieldLength(data.artistName, 2, "Artista");
      if(data.genre) Validator.validateGenre(data.genre);

      const music = await MusicRepository.findById(musicId);
      Validator.validateNonExistence(music, "Musica");
      Validator.validateUserAutorization(music.userId, userId);

      const musicNameExist = await MusicRepository.findByName(data.musicName);
      if(music.musicName !== data.musicName) Validator.validateIfExist(musicNameExist, "Musica");

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
      Validator.validateNonExistence(musicData, "Musica");

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

    async getUserMusics(page, userId){

      Validator.validatePage(page, "Pagina");
      
      const limit = 10;
      const offset = (page - 1) * limit;

      const musicArray = await MusicRepository.findMusicsByUser(userId, offset, limit);
      Validator.validateArrayNotEmpty(musicArray, "Musica");

      return musicArray;
    },

    async findMusic(musicId){
      return MusicRepository.findById(musicId);
    }

};