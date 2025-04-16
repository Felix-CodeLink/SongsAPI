const PlaylistMusicRepository = require("../repositories/PlaylistMusicRepository");
const PlaylistService = require("./PlaylistService");
const MusicService = require("./MusicService");
const { removeMusics } = require("../controllers/PlaylistMusicController");

module.exports = {
    async addMusics(musicIds, playlistId, userId){
        if(!musicIds.length || !Array.isArray(musicIds))throw new Error("Nenhuma musica para adicionar");

        const playlist = await PlaylistService.findPlaylist(playlistId);
        if(!playlist)throw new Error("Playlist Inexistente");
        if(playlist.userId !== userId)throw new Error("Usuario não tem permissão para esta execução");

        const musicsErrorArray = [];

        for(const musicId of musicIds){
            const musicExist = await MusicService.findMusic(musicId);
            const musicInPlaylist = await PlaylistMusicRepository.musicInPlaylist(playlistId, musicId);
            if(musicExist && !musicInPlaylist){
                const data = {
                    playlistId,
                    musicId
                }
                await PlaylistMusicRepository.addMusic(data);
            } else{
                musicsErrorArray.push(musicId);
            }
        }

        if(musicsErrorArray.length === musicIds.length)throw new Error("Todas as musicas foram rejeitadas");
        return musicsErrorArray;
    },
    async getMusics(playlistId, userId){
        const playlistExist = await PlaylistService.findPlaylist(playlistId);
        if(!playlistExist)throw new Error("Playlist Inexistente");
        if(playlistExist.userId !== userId)throw new Error("Usuario não tem permissão para esta execução");

        const response = [];

        const playlistMusics = await PlaylistMusicRepository.findMusicsByPlaylist(playlistId);
        if(!playlistMusics.length)throw new Error("Playlist Vazia");

        for(const music of playlistMusics){
            const musicExist = await MusicService.findMusic(music.musicId);

            if(musicExist){

                response.push({
                    musicId: music.musicId,
                    musicName: musicExist.musicName,
                    artistName: musicExist.artistName,
                    genre: musicExist.genre
                });

            }
        }
        return response;
    },

    async removeMusics(musicsToRemove, playlistId, userId){
        if(!Array.isArray(musicsToRemove) || !musicsToRemove)throw new Error("Nenhuma musica para remover");

        const playlistExist = await PlaylistService.findPlaylist(playlistId);
        if(!playlistExist)throw new Error("Playlist Inexistente");
        if(playlistExist.userId !== userId)throw new Error("Usuario não tem permissão para esta execução");

        const deletedMusics = [];

        for(const musicId of musicsToRemove){
            const musicOnPlaylist = await PlaylistMusicRepository.musicInPlaylist(playlistId, musicId);
            if(musicOnPlaylist){
                await PlaylistMusicRepository.removeMusic(playlistId, musicId);
                deletedMusics.push(musicId);
            }
        }
        
        return deletedMusics;
    }
};