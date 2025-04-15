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
            const user = await UserService.deleteUserByToken(req.userId);

            logger.success(
                "UserControler.delete",
                `Usuario "${user}" de id ${req.userId} foi deletado com sucesso`);
            res.status(200).json({message: `Usuario "${user}" deletado com sucesso`});

        } catch(error){
            logger.error("UserControler.delete", error);
            res.status(409).json({ message: error.message});
        }
    },

    async updateUser(req, res){
        try{
            const data = req.body;

            const updatedUser = await UserService.updateUser(data, req.userId);

            logger.success(
                "UserControler.update",
                `Usuario de id:${req.userId} atualizado de "${updatedUser.oldName} "` +
                `para "${updatedUser.newName}" de email atual "${updatedUser.email}"com sucesso`);

            res.status(200).json({
                message: `Usuario "${updatedUser.oldName}" atualizado com sucesso`,
                username: updatedUser.newName,
                email: updatedUser.email,
                token: updatedUser.newToken});

        } catch(error){
            logger.error("UserControler.update", error);
            res.status(409).json({message: error.message});
        }
    }
};