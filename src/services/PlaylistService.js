const PlaylistRepository = require("../repositories/PlaylistRepository");

module.exports = {

    async createPlaylist(playlistName, userId){
        if(playlistName.length < 2)throw new Error("Nome da playlist muito curto");
        
        const playlistData= {
            playlistName,
            userId
        };

        const playlistNameUsed = await PlaylistRepository.findPlaylistOnUser(playlistData);
        if(playlistNameUsed) throw new Error("Uma playlist com mesmo nome ja existe no usuario");

        const newPlaylist = await PlaylistRepository.createPlaylist(playlistData);

        return {
            id: newPlaylist.id,
            playlistName: newPlaylist.playlistName
        };
    },

    async updatePlaylist(playlistName, playlistId, userId){

        if(playlistName.length < 2 || !playlistName)throw new Error("Nome da playlist muito curto");

        const playlistData= {
            playlistName,
            userId
        };

        const playlistExist = await PlaylistRepository.findById(playlistId);
        if(!playlistExist)throw new Error("Playlist inexistente");
        if(playlistExist.userId !== userId)throw new Error("O usuario não tem permissão para esta execução");
        const playlistNameUsed = await PlaylistRepository.findPlaylistOnUser(playlistData);
        if(playlistNameUsed) throw new Error("Uma playlist com mesmo nome ja existe no usuario");

        await PlaylistRepository.updatePlaylist(playlistName, playlistId);
        const updatedPlaylist = await PlaylistRepository.findById(playlistId);

        return {
            id: updatedPlaylist.id,
            playlistName: updatedPlaylist.playlistName
        };
    },

    async deletePlaylist(playlistId, userId){
        const playlistExist = await PlaylistRepository.findById(playlistId);
        if(!playlistExist) throw new Error("Playlist não existe");
        if(playlistExist.userId !== userId)throw new Error("Usuario não tem permissão para executar a deleção");

        await PlaylistRepository.deletePlaylist(playlistId);
        
        return playlistExist.playlistName;
    },

    async getUserPlaylists(userId){
        const playlistsArray = await PlaylistRepository.findUserPlaylists(userId);

        if(playlistsArray.length <= 0)throw new Error("Nenhuma playlist encontrada para este usuario");

        return playlistsArray;
    },

    async findPlaylist(playlistId){
        return PlaylistRepository.findById(playlistId);
    }

};