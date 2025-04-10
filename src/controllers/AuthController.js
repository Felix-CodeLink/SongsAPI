const jwt = require("jsonwebtoken");
const {secret, expiresIn} = require("../config/auth");
const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/UserRepository");

class AuthController {
    async login(req, res){
        const {username, password} = req.body;
        const user = await UserRepository.findByUsername(username);

        if(!user) return res.status(401).json({error: "Usuario ou senha invalidos"});

        const passwordValid = await bcrypt.compare(password, user.password);
        if(!passwordValid) return res.status(401).json({error: "Usuario ou senha invalidos"});

        const token = jwt.sign({
            id: user.id,
            tokenVersion: user.tokenVersion},
            secret,{expiresIn});

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