const {User} = require("../models");

const UserRepository = {

    async findByUsername(username){
        return await User.findOne({where: {username}});
    },

    async findByEmail(email){
        return await User.findOne({where: {email}});
    },

    async findById(id){
        return await User.findOne({where: {id}});
    },

    async createUser(data){
        return await User.create(data);
    },

    async deleteUser(id){
        return await User.destroy({where: {id}});
    },

    async updateToken(tokenVersion, id){
        await User.update({tokenVersion: tokenVersion + 1}, {where: {id: id}});
    },

    async updateUser(data, id){
        return await User.update(data, {where: {id}});
    }
};

module.exports = UserRepository;