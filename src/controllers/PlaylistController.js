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
    },

    async updatePlaylist(req, res){
        try{

            const {playlistId} = req.params;
            const {playlistName} = req.body;

            const updatedPlaylist = await PlaylistService.updatePlaylist(playlistName, playlistId, req.userId);

            logger.success(
                "PlaylistController.updatePlaylist",
                `Playlist "${playlistId}" atualizada para "${updatedPlaylist}" por usuario "${req.userId}"`);
            res.status(200).json({message: updatedPlaylist});
        }catch(error){
            logger.error("PlaylistController.updatePlaylist", error);
            res.status(400).json({message: error.message});
        }
    },

    async deletePlaylist(req, res){
        try{

            const {playlistId} = req.params;
            await PlaylistService.deletePlaylist(playlistId, req.userId);

            logger.success(
                "PlaylistController.deletePlaylist",
                `Playlist "${playlistId}" deletada com sucesso por "${req.userId}"`);
            res.status(200).json({message: "Playlist deletada com sucesso"});
        }catch(error){
            logger.error("PlaylistController.deletePlaylist", error);
            res.status(400).json({message: error.message});
        }
    },

    async getUserPlaylists(req, res){
        try{
            const userPlaylists = await PlaylistService.getUserPlaylists(req.userId);

            logger.success(
                "PlaylistController.getUserPlaylists",
                `Playlists do usuario "${req.userId}" entregues. Quantidade: ${userPlaylists.length}`);
            res.status(200).json({message: userPlaylists});
        }catch(error){
            logger.error("PlaylistController.getUserPlaylists", error);
            res.status(400).json({message: error.message});
        }
    }

};