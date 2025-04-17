const PlaylistMusicRepository = require("../repositories/PlaylistMusicRepository");
const PlaylistService = require("./PlaylistService");
const MusicService = require("./MusicService");
const ErrorApp = require("../utils/errorApp");
const ErrorCodes = require("../constants/errorCodes");

module.exports = {
    async addMusics(musicIds, playlistId, userId){
        if(musicIds.length === 0 || !Array.isArray(musicIds)){
            throw new ErrorApp(
                "Lista de musicas invalida",
                400,
                ErrorCodes.INVALID_DATA
            );
        }

        const playlist = await PlaylistService.findPlaylist(playlistId);
        if(!playlist){
            throw new ErrorApp(
                "Playlist não encontrada",
                404,
                ErrorCodes.PLAYLIST_NOT_FOUND
            );
        }
        if(playlist.userId !== userId){
            throw new ErrorApp(
                "Usuario não autorizado",
                403,
                ErrorCodes.UNAUTHORIZED_ACTION
            );
        }

        const results = await Promise.allSettled(
            musicIds.map(async (musicId) =>{
                const musicExist = await MusicService.findMusic(musicId);
                const musicInPlaylist = await PlaylistMusicRepository.findMusicInPlaylist(playlistId, musicId);

                if(musicExist && !musicInPlaylist){
                    
                    const data = {playlistId,musicId};
                    await PlaylistMusicRepository.addMusic(data);

                    return {
                        status: "success",
                        musicId: musicExist.id,
                        musicName: musicExist.musicName};
                } else{
                    return {
                        status: "fail",
                        musicId: musicId,
                        error: musicExist? "Ja esta na Playlist":"Musica não existe"};
                }
            }));

            const musicCheck = {success: [], fail: []}

            for(const result of results){
                if(result.status === "fulfilled"){
                    if(result.value.status === "success"){
                        musicCheck.success.push(result.value);
                    } else{
                        musicCheck.fail.push(result.value);
                    }
                } else{
                    console.error("Erro interno:", result.reason);
                    musicCheck.fail.push({musicId: null, error: result.reason.message});
                }
            }

        return musicCheck;
    },
    async getMusics(playlistId, userId){

        const playlistExist = await PlaylistService.findPlaylist(playlistId);
        if(!playlistExist){
            throw new ErrorApp(
                "Playlist não encontrada",
                404,
                ErrorCodes.PLAYLIST_NOT_FOUND
            );
        }
        if(playlistExist.userId !== userId){
            throw new ErrorApp(
                "Usuario não autorizado",
                403,
                ErrorCodes.UNAUTHORIZED_ACTION
            );
        }

        const playlistMusics = await PlaylistMusicRepository.findMusicsByPlaylist(playlistId);
        if(playlistMusics.length === 0){
            throw new ErrorApp(
                "Playlist Vazia",
                400,
                ErrorCodes.EMPTY_PLAYLIST
            );
        }

        const results = await Promise.allSettled(
            playlistMusics.map( async (music) => {
                const musicExist = await MusicService.findMusic(music.musicId);
                if(musicExist){
                    return {
                        status: "success",
                        musicId: musicExist.id,
                        musicName: musicExist.musicName,
                        artistName: musicExist.artistName,
                        genre: musicExist.genre
                    }
                } else{
                    return {
                        status: "fail",
                        musicId: music.musicId,
                    }
                }
            })
        );

        const musicCheck = {
            success: [],
            fail: []
        };

        for(const result of results){
            if(result.status === "fulfilled"){
                if(result.value.status === "success"){
                    musicCheck.success.push(result.value);
                } else{
                    musicCheck.fail.push(result.value);
                }
            } else{
                console.error("Erro interno:", result.reason);
                musicCheck.fail.push({musicId: null, error: result.reason.message});
            }
        }

        return musicCheck;
    },

    async removeMusics(musicsToRemove, playlistId, userId){
        if(!Array.isArray(musicsToRemove) || !musicsToRemove){
            throw new ErrorApp(
                "Lista de musicas invalida",
                400,
                ErrorCodes.INVALID_DATA
            );
        }

        const playlistExist = await PlaylistService.findPlaylist(playlistId);
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

        const results = await Promise.allSettled(
            musicsToRemove.map(async (music) => {
                
                const musicExist = await MusicService.findMusic(music);
                const musicInPlaylist = await PlaylistMusicRepository.findMusicInPlaylist(playlistId, music);
                if(musicExist && musicInPlaylist){
                    await PlaylistMusicRepository.deleteMusic(playlistId, music)
                    return {
                        status: "success",
                        musicId: musicExist.id,
                        musicName: musicExist.musicName
                    };
                } else{
                    return {
                        status: "fail",
                        musicId: music,
                        error: musicExist? "Não esta na Playlist":"Musica não existe"
                    };
                }
            })
        );

        const musicCheck = {
            success: [],
            fail: []
        }

        for(const result of results){
            if(result.status === "fulfilled"){
                if(result.value.status === "success"){
                    musicCheck.success.push(result.value);
                }else{
                    musicCheck.fail.push(result.value);
                }
            } else{
                console.error("Erro interno:", result.reason);
                musicCheck.fail.push({musicId: null, error: result.reason.message});
            }
        }
        
        return musicCheck;
    }
};