const logger = require("../utils/logger.js");
const PlaylistService = require("../services/PlaylistService")

module.exports = {

    async createPlaylist(req, res){
        try{

            const {playlistName} = req.body;

            const playlist = await PlaylistService.createPlaylist(playlistName, req.userId);

            logger.success(
                "PlaylistController.createPlaylist",
                `Playlist "${playlistName}", criada com sucesso pelo usuario "${req.userId}"`);
            res.status(200).json({message: playlist.playlistName});
        }catch(error){
            logger.error("PlaylistController.createPlaylist", error);
            res.status(400).json({message: error.message});
        }
    }

};