const PlaylistRepository = require("../repositories/PlaylistRepository");

module.exports = {

    async createPlaylist(playlistName, userId){
        const playlist= {
            playlistName,
            userId
        };

        const playlistNameUsed = await PlaylistRepository.findPlaylistOnUser(playlist);
        if(playlistNameUsed) throw new Error("Uma playlist com mesmo nome ja existe no usuario");
        if(playlistName.length < 2)throw new Error("Nome da playlist muito curto");

        await PlaylistRepository.createPlaylist(playlist);

        return playlist;
    },

    async updatePlaylist(playlistName, playlistId, userId){
        const playlist= {
            playlistName,
            userId
        };

        const playlistNameUsed = await PlaylistRepository.findPlaylistOnUser(playlist);
        if(playlistNameUsed) throw new Error("Uma playlist com mesmo nome ja existe no usuario");
        const playlistExist = await PlaylistRepository.findById(playlistId);
        if(!playlistExist)throw new Error("Playlist inexistente");
        if(playlistExist.userId !== userId)throw new Error("O usuario não tem permissão para esta execução");
        if(playlist.playlistName.length < 2)throw new Error("Nome da playlist muito curto");


        await PlaylistRepository.updatePlaylist(playlistName, playlistId);

        return playlistName;
    }

};