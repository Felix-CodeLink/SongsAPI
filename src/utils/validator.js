const ErrorCodes = require("../constants/errorCodes");
const ErrorApp = require("../utils/errorApp");
const GENRES = require("../constants/genres");

module.exports = {
    validateRequireField(field, fieldName = "Campo") {
        if(field === undefined || field === null){
            throw new ErrorApp(
                `"${fieldName}" necessário não enviado.`,
                400,
                ErrorCodes.INVALID_DATA
            );
        }
    },
   
    validateFieldLength(field, minLength, fieldName = "Campo") {
        if(typeof field !== "string" && !Array.isArray(field)){
            throw new ErrorApp(
                `"${fieldName}" precisa ser um texto ou lista.`,
                400,
                ErrorCodes.INVALID_DATA
            );
        }

        if(field.length < minLength){
            throw new ErrorApp(
                `Nome de "${fieldName}" muito curto, precisa de no minimo ${minLength} caracteres.`,
                400,
                ErrorCodes.INVALID_DATA
            );
        }
    },

    validateIfExist(field, fieldName = "Campo"){
        if(field){
            throw new ErrorApp(
                `Nome de ${fieldName} ja existe.`,
                400,
                ErrorCodes.INVALID_DATA
            );
        }
    },

    validateNonExistence(field, fieldName = "Campo"){
        if(!field){
            throw new ErrorApp(
                `${fieldName} não encontrada.`,
                404,
                ErrorCodes.NOT_FOUND
            );
        }
    },

    validateUserAutorization(dbUserId, reqUserId){
        if(dbUserId !== reqUserId){
            throw new ErrorApp(
                "Usuario não autorizado.",
                403,
                ErrorCodes.UNAUTHORIZED_ACTION
            );
        }
    },

    validateArrayLength(array, minLength, fieldName = "Campo") {
        if(!Array.isArray(array)){
            throw new ErrorApp(
                `"${fieldName}" precisa ser uma lista.`,
                400,
                ErrorCodes.INVALID_DATA
            );
        }

        if(array.length < minLength){
            throw new ErrorApp(
                `"${fieldName}", precisa de no minimo ${minLength} itens.`,
                400,
                ErrorCodes.INVALID_DATA
            );
        }
    },

    validateGenre(genre){
        if(!GENRES.includes(genre.toLowerCase())){
            throw new ErrorApp(
                "Genero de musica invalido.",
                400,
                ErrorCodes.INVALID_GENRE
            );
        }
    }
}

