const jwt = require("jsonwebtoken");
const {secret} = require("../config/auth");
const user = require("../models/user");
const UserRepository = require("../repositories/UserRepository");

module.exports = async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if(!authHeader) return res.status(401).json({error: "Token não fornecido"});

    const [, token] = authHeader.split(" ");

    try{
        const decoded = jwt.verify(token, secret);
        const user = await UserRepository.findById(decoded.id);
        req.userId = decoded.id;
        if (!user){
            return res.status(401).json({message: "Usuario não encontrado"})
        }
        if(decoded.tokenVersion !== user.tokenVersion){
            return res.status(401).json({message: "Token expirado ou invalido"})
        }
        return next();
    }catch(error){
        console.log(error);
        return res.status(401).json({error: "Token Invalido"});
    }
};