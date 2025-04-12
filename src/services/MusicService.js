const MusicRepository = require("../repositories/MusicRepository");
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
    }

};