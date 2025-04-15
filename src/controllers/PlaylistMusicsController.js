const logger = require("../utils/logger.js");
const PlaylistMusicsService = require("../services/PlaylistMusicsService");

module.exports = {
    async addMusics(req, res){
        try{
            const {playlistId} = req.params;
            const musicIds = req.body.musicIds;

            const response = await PlaylistMusicsService.addMusics(musicIds, playlistId, req.userId);

            logger.success(
                "PlaylistMusics.addMusics",
                `Musicas adicionadas com sucesso na playlist id:${playlistId}. `+
                `Falhas de upload ${response.length}`
            );
            res.status(200).json({
                message: "Musicas adicionadas com sucesso",
                errors: response
            });

        }catch(error){
            logger.error("PlaylistMusics.addMusics", error);
            res.status(400).json({message: error.message});
        }
    }
};