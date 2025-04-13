const MusicService = require("../services/MusicService.js");
const fs = require("fs");
const logger = require("../utils/logger.js");

module.exports = {
    async uploadMusic(req, res){
        try{
            const file = req.file;
            if(!file) return res.status(400).json({message: "Arquivo de audio não enviado"});

            const newMusic = await MusicService.uploadMusic({
                musicName: file.originalname,
                path: file.path,
                userId: req.userId,
                artistName: req.body.artistName,
                genre: req.body.genre.toLowerCase()
            });

            logger.success("MusicControler.update", `Musica ${file.originalname} salva`);
            res.status(201).json({message: "Arquivo salvo com sucesso", newMusic});

        }catch(error) {
            logger.error("MusicControler.upload ", error);

            if(req.file){
                fs.unlink(req.file.path, err => {
                    if (err) {
                        logger.warn("MusicControler.upload ", err.message);
                    } else{
                        logger.success("MusicControler.upload ", "Arquivo deletado com sucesso");
                    }
                });
            }

            res.status(500).json({message: error.message});
        }
    },

    async searchMusics(req, res){
        try{
            const {musicName, artistName, genre} = req.body;
            const musicData = {
                musicName: musicName,
                artistName: artistName,
                genre: genre
            };

            const musicsArray = await MusicService.searchMusics(musicData);

            logger.success("MusicControler.search", `Musicas encontradas com sucesso. Parametros: ${JSON.stringify(musicData)}`);
            res.status(200).json({message: musicsArray});
        }catch(error){
            logger.error("MusicControler.search", error);
            res.status(500).json({message: error.message});
        }
    },

    async deleteMusic(req, res){
        try{
            const {musicId} = req.params;

            await MusicService.deleteMusic(musicId, req.userId);

            logger.success("MusicControler.deleteMusic", `Musica de id: ${musicId} deletada por "${req.userId}`);
            res.status(200).json({message: "Musica deletada com sucesso"});
        }catch(error){
            logger.error("MusicControler.deleteMusic", error);
            res.status(409).json({message: error.message});
        }
    },

    async updateMusic(req, res){
        try{
            const data = req.body;
            const {musicId} = req.params;

            await MusicService.updateMusic(data, musicId, req.userId);

            logger.success("MusicController.updateMusic", "Musica atualizada com sucesso");
            res.status(200).json({message: "Musica atualizada com sucesso"});
        }catch(error){
            logger.error("MusicControler.updateMusic", error);
            res.status(400).json({message: error.message});
        }
    }
};