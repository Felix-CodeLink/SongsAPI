const path = require("path");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const MusicService = require("./MusicService");

module.exports = {

    async createUser({ username, email, password}){
        if(username.length < 2)throw new Error("Nome de usuario muito curto");
        if(password.length < 6)throw new Error("Senha muito curta");

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

        await MusicService.deleteMusicsByUserId(id);
        await UserRepository.deleteUser(id);

        return userExist.username;
    },

    async updateUser(data, id){
        if(data.username && data.username.length < 2)throw new Error("Nome de usuario muito curto");
        if(data.password && data.password.length < 6)throw new Error("Senha muito curta");
        
        if(data.username){
            const userExistName = await UserRepository.findByUsername(data.username);
            if(userExistName && userExistName.id !== id) throw new Error("Usuario ja em uso");
        }

        if(data.email){
            const userExistEmail = await UserRepository.findByEmail(data.email);
            if(userExistEmail && userExistEmail.id !== id) throw new Error("email ja em uso");
        }

        const user = await UserRepository.findById(id);

        let passwordHash = user.password
        if(data.password) passwordHash = await bcrypt.hash(data.password, 10);

        const updateUserData = {
            username: data.username || user.username,
            email: data.email || user.email,
            password: passwordHash
        };
        await UserRepository.updateUser(updateUserData, id);

        const updatedUser = await UserRepository.findById(id);
        await UserRepository.updateToken(updatedUser.tokenVersion, updatedUser.id);

        const newToken = jwt.sign({
            id: updatedUser.id,
            tokenVersion: updatedUser.tokenVersion + 1
        }, process.env.JWT_SECRET, {expiresIn: "1d"});
        
        return {
            oldName: user.username,
            newName: updatedUser.username,
            email: updatedUser.email,
            newToken: newToken
        }
    }
};