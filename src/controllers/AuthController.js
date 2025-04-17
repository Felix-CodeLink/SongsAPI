const jwt = require("jsonwebtoken");
const {secret, expiresIn} = require("../config/auth");
const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/UserRepository");
const logger = require("../utils/logger");

class AuthController {
    async login(req, res){
        const {username, password} = req.body;
    
        if(!username || username.length < 2){
            return res.status(400).json({
                status: "error",
                message: "Usuario invalido"
            });
        }
        if(!password || password.length < 6){
            return res.status(400).json({
                status: "error",
                message: "Senha invalida"
            });
        }

        const user = await UserRepository.findByUsername(username);
        if(!user){
            logger.warn("AuthController.login", `Tentativa de login em: "${username}"`);
            return res.status(401).json({
                status: "error",
                message: "Usuario ou senha invalidos"
            });
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if(!passwordValid){
            logger.warn("AuthController.login", `Tentativa de login em: "${username}"`);
            return res.status(401).json({
                status: "error",
                message: "Usuario ou senha invalidos"
            });
        }

        const token = jwt.sign({
            id: user.id,
            tokenVersion: user.tokenVersion},
            secret,{expiresIn});

        logger.success("AuthController.login", `Usuario, "${username}", logado com sucesso.`);
        return res.json({
            status: "success",
            message: "Usuario logado com sucesso.",
            data: {user:{
                    username: user.username,
                    email: user.email,
                },
                token}
        });

    }
}

module.exports = new AuthController;