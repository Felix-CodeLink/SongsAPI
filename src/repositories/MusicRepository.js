const {Music} = require("../models");

const MusicRepository = {
    async createMusic(data){
        return await Music.create(data);
    },

    async findByName(musicName){
        return await Music.findOne({where: {musicName}, attributes: ["musicName"]});
    },

    async searchMusics(data){
        return await Music.findAll({where: data, attributes: ['id', 'musicName', 'artistName', 'genre']});
    },

    async findById(id){
        return await Music.findOne({where: {id}, attributes: ["id", "userId", "musicName", "path", "artistName", "genre"]});
    },

    async deleteMusic(id){
        return await Music.destroy({where: {id}});
    },

    async updateMusic(data, id){
        return await Music.update(data, {where: {id}});
    },

    async findMusicsPathByUser(userId){
        return await Music.findAll({where: {userId}, attributes: ["id","musicName","path"]});
    }
};

module.exports = MusicRepository;