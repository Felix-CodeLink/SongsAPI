const {PlaylistMusic} = require("../models");

module.exports = {
    async addMusic(data){
        await PlaylistMusic.create(data);
    },
    async musicInPlaylist(playlistId, musicId){
        return await PlaylistMusic.findOne({where: {playlistId, musicId}});
    }
};