const jwt = require("jsonwebtoken");
const {secret} = require("../config/auth");
const UserRepository = require("../repositories/UserRepository");

const logger = require("../utils/logger");
const ErrorApp = require("../utils/errorApp");
const ErrorCodes = require("../constants/errorCodes");

module.exports = async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ErrorApp(
            "Token não fornecido, ou mal formado.",
            401
        );
    }

    const [, token] = authHeader.split(" ");

    try{
        const decoded = jwt.verify(token, secret);
        const user = await UserRepository.findById(decoded.id);
        req.userId = decoded.id;

        if (!user){
            throw new ErrorApp(
                "Usuario não encontrado",
                401
            );
        }

        if(decoded.tokenVersion !== user.tokenVersion){
            throw new ErrorApp(
                "Token expirado ou invalido.",
                401
            );
        }
        
        return next();
    }catch(error){
        logger.error(
            "authMiddleware",error
        );
        return res.status(error.status || 401).json({
            status: "error",
            message: "Não autorizado",
            code: ErrorCodes.UNAUTHORIZED_ACTION
        });
    }
};