const {PlaylistMusic} = require("../models");

module.exports = {
    async addMusic(data){
        await PlaylistMusic.create(data);
    },
    async findMusicInPlaylist(playlistId, musicId){
        return await PlaylistMusic.findOne({where: {playlistId, musicId}});
    },
    async findMusicsByPlaylist(playlistId, offset = 0, limit = null){

        const option = {where: {playlistId}};
        if(offset !== null) option.offset = offset;
        if(limit !== null) option.limit = limit;

        return await PlaylistMusic.findAll({...option, attributes: ["musicId"]});
    },
    async deleteMusic(playlistId, musicId){
        await PlaylistMusic.destroy({where: {playlistId, musicId}});
    }
};