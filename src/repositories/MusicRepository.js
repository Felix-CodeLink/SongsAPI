const {Music} = require("../models");

const MusicRepository = {
    async createMusic(data){
        return await Music.create(data);
    },

    async findByName(musicName){
        return await Music.findOne({where: {musicName}});
    },

    async searchMusics(data){
        return await Music.findAll({where: data, attributes: ['id', 'musicName', 'artistName', 'genre']});
    },

    async findById(id){
        return await Music.findOne({where: {id}, attributes: ["userId", "path"]});
    },

    async deleteMusic(id){
        return await Music.destroy({where: {id}});
    }
};

module.exports = MusicRepository;