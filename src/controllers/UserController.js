const UserService = require("../services/UserService");
const logger = require("../utils/logger");

module.exports = {

    async signUp (req, res){
        try{
            const {username, email, password} = req.body;
            const newUser = await UserService.createUser({username, email, password});

            logger.success(
                "UserControler.signUp",
                `Usuario, "${username}", cadastrado com sucesso.\n`+
                `Data:\n${JSON.stringify(newUser, null, 2)}`
            );
            res.status(201).json({
                status: "success",
                message:`Usuario, "${username}", cadastrado com sucesso.`,
                data: {username: newUser.username, email: newUser.email}
            });

        } catch(error){
            const body = {username: req.body.username, email: req.body.email};
            logger.error("UserControler.signUp", error, null, body);
            res.status(error.status || 400).json({
                status: "error",
                message: error.message || "Erro interno do servidor.",
                code: error.code || "INTERNAL_ERROR"
            });
        }
    },

    async deleteUser(req, res){
        try{
            await UserService.deleteUserByToken(req.userId);

            logger.success(
                "UserControler.delete",
                `Usuario de id:${req.userId} foi deletado`);

            res.status(203).json({
                status: "success",
                message: `Usuario deletado com sucesso.`
            });

        } catch(error){
            logger.error("UserControler.delete", error, req.userId);
            res.status(error.status || 400).json({
                status: "error",
                message: error.message || "Erro interno do servidor.",
                code: error.code || "INTERNAL_ERROR"
            });
        }
    },

    async updateUser(req, res){
        try{
            const data = req.body;

            const updatedUser = await UserService.updateUser(data, req.userId);

            logger.success(
                "UserControler.update",
                `Usuario de id:${req.userId} foi atualizado.\n`+
                `Update Data:\n${JSON.stringify(updatedUser, ["oldName", "newName", "email"], 2)}\n`
            );

            res.status(200).json({
                status: "success",
                message: "Usuario atualizado com sucesso.",
                data: updatedUser
            });

        } catch(error){
            const body = {username: req.body.username, email: req.body.email};
            logger.error("UserControler.update", error, req.userId, body);

            res.status(error.status || 400).json({
                status: "error",
                message: error.message || "Erro interno do servidor.",
                code: error.code || "INTERNAL_ERROR"
            });
        }
    }
};