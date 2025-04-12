const MusicService = require("../services/MusicService.js");
const fs = require("fs");
const logger = require("../utils/logger");

module.exports = {
    async upload(req, res){
        try{
            const file = req.file;
            if(!file) return res.status(400).json({message: "Arquivo de audio não enviado"});

            const newMusic = await MusicService.uploadMusic({
                musicName: file.originalname,
                path: file.path,
                userId: req.userId,
                artistName: req.body.artistName,
                genre: req.body.genre
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

    async search(req, res){
        try{
            const {musicName, artistName, genre} = req.body;
            const musicData = {
                musicName: musicName,
                artistName: artistName,
                genre: genre
            };

            const musicsArray = await MusicService.search(musicData);

            logger.success("MusicControler.search", `Musicas encontradas com sucesso. Parametros: ${JSON.stringify(musicData)}`);
            res.status(200).json({message: musicsArray});
        }catch(error){
            logger.error("MusicControler.search", error);
            res.status(500).json({message: error.message});
        }
    }
};