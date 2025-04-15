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
        await Playlist.update({playlistName}, {where: {id}});
    },

    async deletePlaylist(id){
        return await Playlist.destroy({where: {id}});
    },

    async findUserPlaylists(userId){
        return await Playlist.findAll({where: {userId}, attributes: ["id", "playlistName"]});
    }
};