const MusicService = require("../services/MusicService.js");
const fs = require("fs");
const logger = require("../utils/logger.js");

module.exports = {
    async uploadMusic(req, res){
        try{
            const file = req.file;

            const uploadData = {
                userId: req.userId,
                musicName: req.body.musicName,
                path: file.path,
                artistName: req.body.artistName,
                genre: req.body.genre.toLowerCase()
            };

            const music = await MusicService.uploadMusic(uploadData,file);

            logger.success(
                "MusicControler.upload",
                `Usuario de id:${req.userId}".\n`+
                `UploadData: ${JSON.stringify(uploadData, null, 2)}\n`+
                `MusicData: ${JSON.stringify(music, null, 2)}\n`
            );
            res.status(201).json({
                status: "success",
                message: "Upload do arquivo feito com sucesso.",
                data: music
            });

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

            res.status(error.status || 400).
            json({
                status: "error",
                message: error.message || "Erro interno do servidor",
                code: error.code || "INTERNAL_ERROR"}
            );
        }
    },

    async searchMusics(req, res){
        try{
            const musicData = req.body;
            const {page} = req.params;

            const musicsArray = await MusicService.searchMusics(musicData, page);

            logger.success(
                "MusicControler.search",
                `Usuario de id: ${req.userId}.\n`+
                `Parametros:\n${JSON.stringify(musicData, null, 2)}.\n`+
                `Quantidade de musicas encontradas: ${musicsArray.length}.\n`
            );
            res.status(200).json({
                status: "success",
                message: `${musicsArray.length} musicas encontradas`,
                data: musicsArray
            });
        }catch(error){
            logger.error("MusicControler.search", error);
            res.status(error.status || 400).
            json({
                status: "error",
                message: error.message || "Erro interno do servidor",
                code: error.code || "INTERNAL_ERROR"}
            );
        }
    },

    async deleteMusic(req, res){
        try{
            const {musicId} = req.params;

            const deletedMusic = await MusicService.deleteMusic(musicId, req.userId);

            logger.success(
                "MusicControler.deleteMusic",
                `Usuario de id:${req.userId}, Musica de id:${musicId}.\n`+
                `Musica eliminada com sucesso. Nome: "${deletedMusic}"`
            );

            res.status(203).json({
                status: "success",
                message: `${deletedMusic} deletada com sucesso`
            });

        }catch(error){
            logger.error("MusicControler.deleteMusic", error);
            res.status(error.status || 400).
            json({
                status: "error",
                message: error.message || "Erro interno do servidor",
                code: error.code || "INTERNAL_ERROR"}
            );
        }
    },

    async updateMusic(req, res){
        try{
            const data = req.body;
            const {musicId} = req.params;

            const updatedMusic = await MusicService.updateMusic(data, musicId, req.userId);

            logger.success(
                "MusicController.updateMusic",
                `Usuario de id:${req.userId}, Musica de id:${musicId}.\n`+
                `Atualizado para:\n ${JSON.stringify(updatedMusic, null, 2)}\n`
            );

            res.status(200).json({
                status: "success",
                message: "Musica atualizada com sucesso.",
                data: updatedMusic
            });

        }catch(error){
            logger.error("MusicControler.updateMusic", error);
            res.status(error.status || 400).
            json({
                status: "error",
                message: error.message || "Erro interno do servidor",
                code: error.code || "INTERNAL_ERROR"}
            );
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
                `Usuario de id:${req.userId}, Musica de id:${musicId}.\n`+
                `Enviado com sucesso para usuario de id:"${req.userId}"`
            );
        }catch(error){
            logger.error("MusicController.getMusicFile", error);

            res.status(error.status || 400).
                json({
                    status: "error",
                    message: error.message || "Erro interno do servidor",
                    code: error.code || "INTERNAL_ERROR"}
                );
        }
    }
};