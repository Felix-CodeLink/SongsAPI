const logger = require("../utils/logger.js");
const PlaylistMusicService = require("../services/PlaylistMusicService.js");

module.exports = {
    async addMusics(req, res){
        try{
            const {playlistId} = req.params;
            const musicIds = req.body.musicIds;

            const musicCheck = await PlaylistMusicService.addMusics(musicIds, playlistId, req.userId);

            logger.success(
                "PlaylistMusics.addMusics",
                `Usuario de id: ${req.userId}, Playlist de id: ${playlistId}.\n`+
                `Musicas totais: ${musicIds.length}.\n`+
                `Sucessos: \n${musicCheck.success.map( M => JSON.stringify(M, null, 2)).join("\n\n")}\n`+
                `Falhas: \n${musicCheck.fail.map( M => JSON.stringify(M, null, 2)).join("\n\n")}.`
            );
            res.status(207).json({
                status: "success",
                message: `${musicCheck.success.length} musicas adicionadas com sucesso.`,
                data: musicCheck
            });

        }catch(error){
            logger.error("PlaylistMusics.addMusics", error);

            res.status(error.status || 400).
                json({
                    status: "error",
                    message: error.message || "Erro interno do servidor",
                    code: error.code || "INTERNAL_ERROR"}
                );
        }
    },

    async getMusics(req, res){
        try{

            const {playlistId} = req.params;
            const {page} = req.params;
            const musicCheck = await PlaylistMusicService.getMusics(playlistId, page, req.userId);

            logger.success(
                "PlaylistMusics.getMusics",
                `Usuario de id:${req.userId}, Playlist de id:${playlistId}.\n`+
                `Musicas Totais: ${musicCheck.success.length}.\n`+
                `Sucessos:\n${musicCheck.success.map(M => JSON.stringify(M, null, 2)).join("\n\n")}\n`+
                `Falhas:\n${musicCheck.fail.map(M => JSON.stringify(M, null, 2)).join("\n\n")}`
            );
            res.status(200).json({
                status: "success",
                message: `${musicCheck.success.length} musicas retornadas com sucesso.`,
                data: musicCheck
            });

        }catch(error){
            logger.error("PlaylistMusics.getMusics", error);
            res.status(error.status || 400).
                json({
                    status: "error",
                    message: error.message || "Erro interno do servidor",
                    code: error.code || "INTERNAL_ERROR"}
                );
        }
    },

    async removeMusics(req, res){
        try{
            const musicsToRemove = req.body.musicIds;
            const {playlistId} = req.params;

            const musicCheck = await PlaylistMusicService.removeMusics(musicsToRemove, playlistId, req.userId);

            logger.success(
                "PlaylistMusics.removeMusics",
                `Usuario de id:${req.userId}, Playlist de id:${playlistId}.\n`+
                `Musicas totais: ${musicsToRemove.length}.\n`+
                `Sucessos:\n${musicCheck.success.map(M => JSON.stringify(M, null, 2)).join("\n\n")}.\n`+
                `Falhas:\n${musicCheck.fail.map(M => JSON.stringify(M, null, 2)).join("\n\n")}.`
            );
            res.status(200).json({
                status: "success",
                message: `${musicCheck.success.length} musicas removidas com sucesso`,
                data: musicCheck
            });

        }catch(error){
            logger.error("PlaylistMusics.removeMusics", error);
            res.status(error.status || 400).
            json({
                status: "error",
                message: error.message || "Erro interno do servidor",
                code: error.code || "INTERNAL_ERROR"}
            );
        }
    }
};