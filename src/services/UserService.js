const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/UserRepository");

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
    }
};