const {PlaylistMusic} = require("../models");

module.exports = {
    async addMusic(data){
        await PlaylistMusic.create(data);
    },
    async musicInPlaylist(playlistId, musicId){
        return await PlaylistMusic.findOne({where: {playlistId, musicId}});
    },
    async findMusicsByPlaylist(playlistId){
        return await PlaylistMusic.findAll({where: {playlistId}, attributes: ["musicId"]});
    },
    async removeMusic(playlistId, musicId){
        await PlaylistMusic.destroy({where: {playlistId, musicId}});
    }
};