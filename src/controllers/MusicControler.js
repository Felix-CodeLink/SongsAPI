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
    }
};