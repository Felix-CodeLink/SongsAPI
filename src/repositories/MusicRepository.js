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
    }
};

module.exports = MusicRepository;