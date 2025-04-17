const PlaylistRepository = require("../repositories/PlaylistRepository");
const ErrorApp = require("../utils/errorApp");
const ErrorCodes = require("../constants/errorCodes");

module.exports = {

    async createPlaylist(playlistName, userId){
        if(!playlistName || playlistName.length < 2){
            throw new ErrorApp(
                "Nome de playlist muito curto.",
                400,
                ErrorCodes.INVALID_NAME
              );
        }
        
        const playlistData= {
            playlistName,
            userId
        };

        const playlistNameUsed = await PlaylistRepository.findPlaylistOnUser(playlistData);
        if(playlistNameUsed){
            throw new ErrorApp(
                "Uma playlist de mesmo nome ja existe no usuario.",
                400,
                ErrorCodes.INVALID_NAME
              );
        }

        const newPlaylist = await PlaylistRepository.createPlaylist(playlistData);

        return {
            id: newPlaylist.id,
            playlistName: newPlaylist.playlistName
        };
    },

    async updatePlaylist(playlistName, playlistId, userId){

        if(playlistName.length < 2 || !playlistName){
            throw new ErrorApp(
                "Nome de playlist muito curto.",
                400,
                ErrorCodes.INVALID_NAME
              );
        }

        const playlistData= {
            playlistName,
            userId
        };

        const playlistExist = await PlaylistRepository.findById(playlistId);
        if(!playlistExist){
            throw new ErrorApp(
                "Playlist não encontrada.",
                404,
                ErrorCodes.PLAYLIST_NOT_FOUND
              );
        }
        if(playlistExist.userId !== userId){
            throw new ErrorApp(
                "Usuario não autorizado.",
                403,
                ErrorCodes.UNAUTHORIZED_ACTION
              );
        }
        const playlistNameUsed = await PlaylistRepository.findPlaylistOnUser(playlistData);
        if(playlistNameUsed) {
            throw new ErrorApp(
                "Uma playlist de mesmo nome ja existe no usuario.",
                400,
                ErrorCodes.INVALID_NAME
              );
        }

        await PlaylistRepository.updatePlaylist(playlistName, playlistId);
        const updatedPlaylist = await PlaylistRepository.findById(playlistId);

        return {
            id: updatedPlaylist.id,
            playlistName: updatedPlaylist.playlistName
        };
    },

    async deletePlaylist(playlistId, userId){
        const playlistExist = await PlaylistRepository.findById(playlistId);
        if(!playlistExist){
            throw new ErrorApp(
                "Playlist não existe.",
                404,
                ErrorCodes.PLAYLIST_NOT_FOUND
              );
        }
        if(playlistExist.userId !== userId){
            throw new ErrorApp(
                "Usuario sem autorização.",
                403,
                ErrorCodes.UNAUTHORIZED_ACTION
              );
        }

        await PlaylistRepository.deletePlaylist(playlistId);
        
        return playlistExist.playlistName;
    },

    async getUserPlaylists(userId){
        const playlistsArray = await PlaylistRepository.findUserPlaylists(userId);

        if(playlistsArray.length <= 0){
            throw new ErrorApp(
                "Nenhuma playlist encontrada.",
                404,
                ErrorCodes.EMPTY_PLAYLIST
              );
        }

        return playlistsArray;
    },

    async findPlaylist(playlistId){
        return PlaylistRepository.findById(playlistId);
    }

};