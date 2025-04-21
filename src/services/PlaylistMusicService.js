const PlaylistMusicRepository = require("../repositories/PlaylistMusicRepository");
const PlaylistService = require("./PlaylistService");
const MusicService = require("./MusicService");
const ErrorApp = require("../utils/errorApp");
const ErrorCodes = require("../constants/errorCodes");
const Validator = require("../utils/validator");

module.exports = {
    async addMusics(musicIds, playlistId, userId){
        Validator.validateRequireField(musicIds, "Musicas");
        Validator.validateArrayLength(musicIds, 1, "Musicas");

        const playlist = await PlaylistService.findPlaylist(playlistId);
        Validator.validateNonExistence(playlist, "Playlist");
        Validator.validateUserAutorization(playlist.userId, userId);

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

        return musicCheck = this.resultsTreatment(results);
    },
    async getMusics(playlistId, page, userId){

        Validator.validatePage(page, "Pagina");

        const playlistExist = await PlaylistService.findPlaylist(playlistId);
        Validator.validateNonExistence(playlistExist, "Playlist");
        Validator.validateUserAutorization(playlistExist.userId, userId);

        const limit = 10;
        const offset = (page - 1) * limit;

        const playlistMusics = await PlaylistMusicRepository.findMusicsByPlaylist(playlistId, offset, limit);
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

        return musicCheck = this.resultsTreatment(results);
    },

    async removeMusics(musicsToRemove, playlistId, userId){
        Validator.validateRequireField(musicsToRemove, "Musicas");
        Validator.validateArrayLength(musicsToRemove, 1, "Musicas")

        const playlistExist = await PlaylistService.findPlaylist(playlistId);
        Validator.validateNonExistence(playlistExist, "Playlist");
        Validator.validateUserAutorization(playlistExist.userId, userId);

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

        return musicCheck = this.resultsTreatment(results);
    },

    resultsTreatment(results){
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
    }
};