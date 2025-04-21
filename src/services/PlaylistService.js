const PlaylistRepository = require("../repositories/PlaylistRepository");
const ErrorApp = require("../utils/errorApp");
const ErrorCodes = require("../constants/errorCodes");
const Validator = require("../utils/validator");

module.exports = {

    async createPlaylist(playlistName, userId){
        Validator.validateRequireField(playlistName, "Playlist");
        Validator.validateFieldLength(playlistName, 2, "Playlist");
        
        const playlistData= {
            playlistName,
            userId
        };

        const playlistNameUsed = await PlaylistRepository.findPlaylistOnUser(playlistData);
        Validator.validateIfExist(playlistNameUsed, "Playlist");

        const newPlaylist = await PlaylistRepository.createPlaylist(playlistData);

        return {
            id: newPlaylist.id,
            playlistName: newPlaylist.playlistName
        };
    },

    async updatePlaylist(playlistName, playlistId, userId){

        Validator.validateRequireField(playlistName, "Playlist");
        Validator.validateFieldLength(playlistName, 2, "Playlist");

        const playlistData= {
            playlistName,
            userId
        };

        const playlistExist = await PlaylistRepository.findById(playlistId);
        Validator.validateNonExistence(playlistExist, "Playlist");
        Validator.validateUserAutorization(playlistExist.userId, userId);

        const playlistNameUsed = await PlaylistRepository.findPlaylistOnUser(playlistData);
        Validator.validateIfExist(playlistNameUsed, "Playlist");

        await PlaylistRepository.updatePlaylist(playlistName, playlistId);
        const updatedPlaylist = await PlaylistRepository.findById(playlistId);

        return {
            id: updatedPlaylist.id,
            playlistName: updatedPlaylist.playlistName
        };
    },

    async deletePlaylist(playlistId, userId){
        const playlistExist = await PlaylistRepository.findById(playlistId);
        Validator.validateNonExistence(playlistExist, "Playlist");
        Validator.validateUserAutorization(playlistExist.userId, userId);

        await PlaylistRepository.deletePlaylist(playlistId);
        
        return playlistExist.playlistName;
    },

    async getUserPlaylists(userId, page){
        Validator.validateFieldLength(page, 1, "Pagina");
        const offset = 10 * (page - 1);
        const limit = offset + 10;
        const playlistsArray = await PlaylistRepository.findUserPlaylists(userId, offset, limit);

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