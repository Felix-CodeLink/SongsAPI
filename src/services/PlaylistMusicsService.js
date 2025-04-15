const PlaylistMusicsRepository = require("../repositories/PlaylistMusicsRepository");
const PlaylistService = require("../services/PlaylistService");
const MusicService = require("../services/MusicService");

module.exports = {
    async addMusics(musicIds, playlistId, userId){
        if(musicIds.length <= 0 || !Array.isArray(musicIds))throw new Error("Nenhuma musica para adicionar");

        const playlist = await PlaylistService.findPlaylist(playlistId);
        if(!playlist)throw new Error("Playlist Inexistente");
        if(playlist.userId !== userId)throw new Error("Usuario não tem permissão para esta execução");

        let musicsErrorArray = [];

        for(const musicId of musicIds){
            const musicExist = await MusicService.findMusic(musicId);
            const musicInPlaylist = await PlaylistMusicsRepository.musicInPlaylist(playlistId, musicId);
            if(musicExist && !musicInPlaylist){
                const data = {
                    playlistId,
                    musicId
                }
                await PlaylistMusicsRepository.addMusic(data);
            } else{
                musicsErrorArray.push(musicId);
            }
        }

        if(musicsErrorArray.length === musicIds.length)throw new Error("Todas as musicas foram rejeitadas");
        return musicsErrorArray;
    }
};