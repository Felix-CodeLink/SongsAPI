const {Playlist} = require("../models");

module.exports = {

    async findPlaylistOnUser(data){
        return await Playlist.findOne({where: data});
    },

    async createPlaylist(data){
        return await Playlist.create(data);
    }
};