const path = require("path");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const MusicRepository = require("../repositories/MusicRepository");
const MusicService = require("./MusicService");

module.exports = {

    async createUser({ username, email, password}){
        const userExistName = await UserRepository.findByUsername(username);
        if(userExistName){
            throw new Error("Este username ja esta em uso.");
        }
        
        const userExistEmail = await UserRepository.findByEmail(email);
        if(userExistEmail){
            throw new Error("Este email ja esta em uso.");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await UserRepository.createUser({
            username,
            email,
            password: passwordHash,
        });

        return {
            username: newUser.username,
            email: newUser.email
        };
    },

    async deleteUserByToken(id){
        const userExist = await UserRepository.findById(id)

        if (!userExist)throw new Error("Usuario ja não existe");

        const musicArray = await MusicRepository.findMusicsByUser(id);

        for(const music of musicArray){
            await MusicService.deleteMusic(music.id, id);
        }

        await UserRepository.deleteUser(id);
    },

    async updateUser(data, id){
        const user = await UserRepository.findById(id);
        
        if(data.username){
            const userExistName = await UserRepository.findByUsername(data.username);
            if(userExistName && userExistName.id !== id) throw new Error("Usuario ja em uso");
        }

        if(data.email){
            const userExistEmail = await UserRepository.findByEmail(data.email);
            if(userExistEmail && userExistEmail.id !== id) throw new Error("email ja em uso");
        }

        let passwordHash = user.password
        if(data.password) passwordHash = await bcrypt.hash(data.password, 10);

        const updatedUser = {
            username: data.username || user.username,
            email: data.email || user.email,
            password: passwordHash
        };
        await UserRepository.updateUser(updatedUser, id);

        const updatedUserData = UserRepository.findById(id)
        await UserRepository.updateToken(updatedUserData.tokenVersion, id);

        const newToken = jwt.sign({
            id: updatedUserData.id,
            tokenVersion: updatedUserData.tokenVersion + 1
        }, process.env.JWT_SECRET, {expiresIn: "1d"});
        return newToken
    }
};