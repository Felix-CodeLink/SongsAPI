const {Playlist} = require("../models");

module.exports = {

    async findPlaylistOnUser(data){
        return await Playlist.findOne({where: data});
    },

    async createPlaylist(data){
        return await Playlist.create(data);
    },

    async findById(id){
        return await Playlist.findOne({where: {id}});
    },

    async updatePlaylist(playlistName, id){
        return await Playlist.update({playlistName}, {where: {id}});
    }
};