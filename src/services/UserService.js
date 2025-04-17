const path = require("path");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const MusicService = require("./MusicService");
const ErrorApp = require("../utils/errorApp");
const ErrorCodes = require("../constants/errorCodes");
const Validator = require("../utils/validator");

module.exports = {

    async createUser({ username, email, password}){
        Validator.validateRequireField(username, "Usuario");
        Validator.validateFieldLength(username, 2, "Usuario");

        Validator.validateRequireField(password, "Senha");
        Validator.validateFieldLength(password, 6, "Senha");

        const userExistName = await UserRepository.findByUsername(username);
        Validator.validateIfExist(userExistName, "Usuario");
        
        const userExistEmail = await UserRepository.findByEmail(email);
        Validator.validateIfExist(userExistEmail, "Email");

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await UserRepository.createUser({
            username,
            email,
            password: passwordHash,
        });

        return {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        };
    },

    async deleteUserByToken(id){
        const userExist = await UserRepository.findById(id)

        Validator.validateNonExistence(userExist, "Usuario");

        await MusicService.deleteMusicsByUserId(id);
        await UserRepository.deleteUser(id);
    },

    async updateUser(data, id){
        if(data.username)Validator.validateFieldLength(data.username, 2, "Usuario");
        if(data.password) Validator.validateFieldLength(data.password, 6, "Senha");
        
        if(data.username){
            const userExistName = await UserRepository.findByUsername(data.username);
            if(userExistName.id !== id) Validator.validateIfExist(userExistName, "Usuario");
        }

        if(data.email){
            const userExistEmail = await UserRepository.findByEmail(data.email);
            if(userExistEmail.id !== id) Validator.validateIfExist(userExistEmail, "Email");
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

        const newToken = this.generateNewToken(updatedUser.id, updatedUser.tokenVersion);
        
        return {
            oldName: user.username,
            newName: updatedUser.username,
            email: updatedUser.email,
            newToken: newToken
        }
    },

    generateNewToken(userId, tokenVersion){
        jwt.sign({
            id: userId,
            tokenVersion: tokenVersion + 1
        }, process.env.JWT_SECRET, {expiresIn: "1d"});
    }
};