const MusicRepository = require("../repositories/MusicRepository");
const {Op} = require("sequelize");
const GENRES = require("../constants/genres");
const fs = require("fs").promises;

module.exports = {

    async uploadMusic(data){

        const existFileName = await MusicRepository.findByName(data.musicName);
        if(existFileName){
            throw new Error("Este nome de música já existe");
          }

        if (!data.artistName || !data.genre) {
            throw new Error("Campos obrigatórios ausentes.");
          }
      
          if (!GENRES.includes(data.genre.toLowerCase())) {
            throw new Error("Gênero musical inválido.");
          }
      
          if (data.artistName.length < 2) {
            throw new Error("Nome do artista muito curto.");
          }

        await MusicRepository.createMusic(data);

        return {MusicName: data.musicName,
                artist: data.artistName,
                genre: data.genre
              }
    },

    async search(data){

      let where = {};

      if(data.genre !== null && !GENRES.includes(data.genre.toLowerCase())){
        throw new Error("Campo de genero invalido");
      }

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
        throw new Error("Nenhuma musica encontrada");
      }

      return musicsArray;
    },

    async deleteMusic(musicId, userId){
      const musicExist = await MusicRepository.findById(musicId);
      if(!musicExist) throw new Error("Musica inexistente");

      if(musicExist.userId !== userId) throw new Error("Usuario não tem permissão para executar a exclusao");

      fs.unlink(musicExist.path, err => {
                if (err) throw new Error("Erro ao deletar musica");
            });
      
      await MusicRepository.deleteMusic(musicId);
    }

};