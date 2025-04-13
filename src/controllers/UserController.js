const UserService = require("../services/UserService");
const logger = require("../utils/logger");

module.exports = {

    async signUp (req, res){
        try{
            const {username, email, password} = req.body;
            const newUser = await UserService.createUser({username, email, password});

            logger.success("UserControler.signUp", `Usuario "${newUser.username}" criado com sucesso`);
            res.status(201).json(newUser);
        } catch(error){
            logger.error("UserControler.signUp", error);

            res.status(400).json({ message: error.message});
        }
    },

    async deleteUser(req, res){
        try{
            await UserService.deleteUserByToken(req.userId);

            logger.success("UserControler.delete", `Usuario ${req.userId} deletado com sucesso`);
            res.status(200).json({message: "Usuario deletado com sucesso"});
        } catch(error){
            logger.error("UserControler.delete", error);

            res.status(409).json({ message: error.message});
        }
    },

    async updateUser(req, res){
        try{
            const {username, email, password} = req.body;
            const id = req.userId;
            const data = {
                username: username,
                email: email,
                password: password
            };

            const newToken = await UserService.updateUser(data, id);

            logger.success("UserControler.update", `Usuario ${req.userId} atualizado com sucesso`);
            res.status(200).json({message: "Usuario atualizado com sucesso", token: newToken});

        } catch(error){
            logger.error("UserControler.update", error);

            res.status(409).json({message: error.message});
        }
    }
};