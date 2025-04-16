const logger = require("../utils/logger.js");
const PlaylistMusicService = require("../services/PlaylistMusicService.js");

module.exports = {
    async addMusics(req, res){
        try{
            const {playlistId} = req.params;
            const musicIds = req.body.musicIds;

            const response = await PlaylistMusicService.addMusics(musicIds, playlistId, req.userId);

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
    },

    async getMusics(req, res){
        try{

            const {playlistId} = req.params;
            const musicsArray = await PlaylistMusicService.getMusics(playlistId, req.userId);

            logger.success(
                "PlaylistMusics.getMusics",
                `Usuario de id:${req.userId} deu get na playlist de id:${playlistId}. `+
                `E retornou as musicas de Id:${musicsArray}`
            );
            res.status(200).json({Musics: musicsArray});

        }catch(error){
            logger.error("PlaylistMusics.getMusics", error);
            res.status(400).json({message: error.message});
        }
    },

    async removeMusics(req, res){
        try{
            const musicsToRemove = req.body.musicIds;
            const {playlistId} = req.params;

            const response = await PlaylistMusicService.removeMusics(musicsToRemove, playlistId, req.userId);

            logger.success(
                "PlaylistMusics.removeMusics",
                `Usuario de id:${req.userId} deu removeu da playlist de id:${playlistId}. `+
                `E removeu mas musicas de id: ${response}`
            );
            res.status(200).json({Musics: response});

        }catch(error){
            logger.error("PlaylistMusics.removeMusics", error);
            res.status(400).json({message: error.message});
        }
    }
};