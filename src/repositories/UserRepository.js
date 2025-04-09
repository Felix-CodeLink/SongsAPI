const {User} = require("../models");

const UserRepository = {

    async findByUsername(username){
        return await User.findOne({where: {username}});
    },

    async findByEmail(email){
        return await User.findOne({where: {email}});
    },

    async createUser(data){
        return await User.create(data);
    }
};

module.exports = UserRepository;