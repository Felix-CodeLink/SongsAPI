const MusicService = require("../services/MusicService.js");
const fs = require("fs");
const logger = require("../utils/logger.js");

module.exports = {
    async uploadMusic(req, res){
        try{
            const file = req.file;
            if(!file) return res.status(400).json({message: "Arquivo de audio não enviado"});

            const newMusic = await MusicService.uploadMusic({
                musicName: req.body.musicName,
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
            const musicData = req.body;

            const musicsArray = await MusicService.searchMusics(musicData);

            logger.success(
                "MusicControler.search",
                `${musicsArray.length} Musicas encontradas com sucesso. Parametros: ${JSON.stringify(musicData)}`);
            res.status(200).json({musicsArray});
        }catch(error){
            logger.error("MusicControler.search", error);
            res.status(500).json({message: error.message});
        }
    },

    async deleteMusic(req, res){
        try{
            const {musicId} = req.params;

            const deletedMusic = await MusicService.deleteMusic(musicId, req.userId);

            logger.success(
                "MusicControler.deleteMusic",
                `Musica de id: ${musicId} e nome "${deletedMusic}" deletada por usuario de Id:"${req.userId}"`);
            res.status(200).json({message: `Musica "${deletedMusic}" deletada com sucesso`});
        }catch(error){
            logger.error("MusicControler.deleteMusic", error);
            res.status(409).json({message: error.message});
        }
    },

    async updateMusic(req, res){
        try{
            const data = req.body;
            const {musicId} = req.params;

            const updatedMusic = await MusicService.updateMusic(data, musicId, req.userId);

            logger.success(
                "MusicController.updateMusic",
                `Musica de id:"${updatedMusic.musicId}" atualizada para. ` +
                `nome: "${updatedMusic.newName}". `+
                `artist: "${updatedMusic.artistName}". `+
                `genre: "${updatedMusic.genre}"`);

            res.status(200).json({
                message: `Musica "${updatedMusic.oldName}" atualizado com sucesso`,
                musicId: updatedMusic.musicId,
                musicName: updatedMusic.newName,
                artistName: updatedMusic.artistName,
                genre: updatedMusic.genre});

        }catch(error){
            logger.error("MusicControler.updateMusic", error);
            res.status(400).json({message: error.message});
        }
    },

    async getMusicFile(req, res){
        try{
            const {musicId} = req.params;

            const musicFile = await MusicService.getMusicFile(musicId);

            res.setHeader("Content-Type", musicFile.mimeType);
            res.setHeader("Content-Disposition", `inline; filename="${(musicFile.musicName)}"`);

            const stream = fs.createReadStream(musicFile.path);
            stream.pipe(res);

            stream.on("error", (err) => {
                console.error(err);
                res.destroy(err);
            });

            logger.success(
                "MusicController.getMusicFile",
                `Arquivo de musica de id:"${musicId}" enviado com sucesso para usuario de id:"${req.userId}"`);
        }catch(error){
            logger.error("MusicControler.getMusicFile", error);
            res.status(400).json({message: error.message});
        }
    }
};