const jwt = require("jsonwebtoken");
const {secret} = require('../config/auth');

module.exports = (ewq, res, next) => {
    const authHeader = res.headers.authorization;

    if(!authHeader) res.status(401).json({erro: "Token não fornecido"});

    const [, token] = authHeader.split(" ");

    try{
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.id;
        return next();
    }catch(error){
        return res.status(401).json({erro: "Token Invalido"});
    }
};