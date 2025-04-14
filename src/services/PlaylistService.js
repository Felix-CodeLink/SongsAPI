const PlaylistRepository = require("../repositories/PlaylistRepository");

module.exports = {

    async createPlaylist(playlistName, userId){
        if(playlistName.length < 2)throw new Error("Nome da playlist muito curto");
        
        const playlist= {
            playlistName,
            userId
        };

        const playlistNameUsed = await PlaylistRepository.findPlaylistOnUser(playlist);
        if(playlistNameUsed) throw new Error("Uma playlist com mesmo nome ja existe no usuario");

        await PlaylistRepository.createPlaylist(playlist);

        return playlist;
    },

    async updatePlaylist(playlistName, playlistId, userId){

        if(playlistName.length < 2 || !playlistName)throw new Error("Nome da playlist muito curto");

        const playlist= {
            playlistName,
            userId
        };

        const playlistNameUsed = await PlaylistRepository.findPlaylistOnUser(playlist);
        if(playlistNameUsed) throw new Error("Uma playlist com mesmo nome ja existe no usuario");
        const playlistExist = await PlaylistRepository.findById(playlistId);
        if(!playlistExist)throw new Error("Playlist inexistente");
        if(playlistExist.userId !== userId)throw new Error("O usuario não tem permissão para esta execução");


        await PlaylistRepository.updatePlaylist(playlistName, playlistId);

        return playlistName;
    },

    async deletePlaylist(playlistId, userId){
        const playlistExist = await PlaylistRepository.findById(playlistId);
        if(!playlistExist) throw new Error("Playlist não existe");
        if(playlistExist.userId !== userId)throw new Error("Usuario não tem permissão para executar a deleção");

        await PlaylistRepository.deletePlaylist(playlistId);
    },

    async getUserPlaylists(userId){
        const playlistsArray = await PlaylistRepository.findUserPlaylists(userId);

        if(playlistsArray.length <= 0)throw new Error("Nenhuma playlist encontrada para este usuario");

        return playlistsArray;
    }

};