const logger = require("../utils/logger.js");
const PlaylistService = require("../services/PlaylistService")

module.exports = {

    async createPlaylist(req, res){
        try{

            const {playlistName} = req.body;

            const newPlaylist = await PlaylistService.createPlaylist(playlistName, req.userId);

            logger.success(
                "PlaylistController.createPlaylist",
                `Usuario de id:${req.userId}, Playlist name: "${playlistName}".\n`+
                `Playlist criada:\n${JSON.stringify(newPlaylist, null, 2)}.\n`
            );

            res.status(200).json({
                status: "success",
                message: `Playlist "${playlistName}" criada com sucesso.`,
                data: newPlaylist
            });

        }catch(error){
            logger.error("PlaylistController.createPlaylist", error, req.userId, req.body);

            res.status(error.status || 400).
                json({
                    status: "error",
                    message: error.message || "Erro interno do servidor",
                    code: error.code || "INTERNAL_ERROR"}
            );
        }
    },

    async updatePlaylist(req, res){
        try{

            const {playlistId} = req.params;
            const {playlistName} = req.body;

            const updatedPlaylist = await PlaylistService.updatePlaylist(playlistName, playlistId, req.userId);

            logger.success(
                "PlaylistController.updatePlaylist",
                `Usuario de id:${req.userId}, Playlist de id:${playlistId}.\n`+
                `Updated playlist:\n${JSON.stringify(updatedPlaylist, null, 2)}.\n`);

            res.status(200).json({
                status: "success",
                message: "Playlist atualizada com sucesso.",
                data: updatedPlaylist
            });

        }catch(error){
            logger.error("PlaylistController.updatePlaylist", error, req.userId, req.body);

            res.status(error.status || 400).
                json({
                    status: "error",
                    message: error.message || "Erro interno do servidor",
                    code: error.code || "INTERNAL_ERROR"}
            );
        }
    },

    async deletePlaylist(req, res){
        try{

            const {playlistId} = req.params;
            const deletedPlaylist = await PlaylistService.deletePlaylist(playlistId, req.userId);

            logger.success(
                "PlaylistController.deletePlaylist",
                `Usuario de id:${req.userId}, Playlist de id:${playlistId}.\n`+
                `Playlist, ${deletedPlaylist}, deletada.\n`
            );

            res.status(200).json({
                status: "success",
                message: `Playlist "${deletedPlaylist}", deletada com sucesso`
            });
            
        }catch(error){
            logger.error("PlaylistController.deletePlaylist", error, req.userId, req.body);

            res.status(error.status || 400).
                json({
                    status: "error",
                    message: error.message || "Erro interno do servidor",
                    code: error.code || "INTERNAL_ERROR"}
            );
        }
    },

    async getUserPlaylists(req, res){
        try{
            const {page} = req.params;
            const userPlaylists = await PlaylistService.getUserPlaylists(req.userId, page);

            logger.success(
                "PlaylistController.getUserPlaylists",
                `Usuario de id:${req.userId}.\n`+
                `Playlists encontradas: ${userPlaylists.length}.\n`+
                `Playlists:\n${userPlaylists.map( P => JSON.stringify(P, null, 2)).join("\n")}\n`
            );
            res.status(200).json({
                status: "success",
                message: `${userPlaylists.length} playlists encontradas.`,
                data: userPlaylists
            });
        }catch(error){
            logger.error("PlaylistController.getUserPlaylists", error, req.userId, req.body);

            res.status(error.status || 400).
                json({
                    status: "error",
                    message: error.message || "Erro interno do servidor",
                    code: error.code || "INTERNAL_ERROR"}
            );
        }
    }

};