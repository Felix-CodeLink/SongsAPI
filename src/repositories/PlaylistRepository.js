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

    async findUserPlaylists(userId, offset = 0, limit = null){
        const option = {where: {userId}};
        if(offset !== null) option.offset = offset;
        if(limit !== null) option.limit = limit;
        return await Playlist.findAll({...option, attributes: ["id", "playlistName"]});
    }
};