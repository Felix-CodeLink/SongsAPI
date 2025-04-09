const jwt = require('jsonwebtoken');
const {secret, expiresIn} = require("../config/auth");
const User = require('../models/user');
const UserRepository = require("../repositories/UserRepository");
const bcrypt = require("bcrypt");

class AuthController {
    async login(req, res){
        const {username, password} = req.body;
        const user = await UserRepository.findByUsername(username);

        if(!user) return res.status(401).json({erro: "Usuario ou senha invalidos"});

        if(!(bcrypt.compare(password, user.password))) return res.status(401).json({erro: "Usuario ou senha invalidos"});

        const token = jwt.sign({ id: user.id }, secret, {
            expiresIn,
        });

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