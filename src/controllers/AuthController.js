const jwt = require("jsonwebtoken");
const {secret, expiresIn} = require("../config/auth");
const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/UserRepository");
const logger = require("../utils/logger");

class AuthController {
    async login(req, res){
        const {username, password} = req.body;
        const user = await UserRepository.findByUsername(username);

        if(!user){
            logger.warn("AuthControler.login", `Usuario ou senha invalidos para: "${username}"`);
            return res.status(401).json({error: "Usuario ou senha invalidos"});
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if(!passwordValid){
            logger.warn("AuthControler.login", `Usuario ou senha invalidos para: "${username}"`);
            return res.status(401).json({error: "Usuario ou senha invalidos"});
        }

        const token = jwt.sign({
            id: user.id,
            tokenVersion: user.tokenVersion},
            secret,{expiresIn});

        logger.success("AuthControler.login", `Usuario logado com sucesso para: "${username}"`);
        return res.json({
            user:{
                username: user.username,
                email: user.email,
            },
            token,
        });

    }
}

module.exports = new AuthController;