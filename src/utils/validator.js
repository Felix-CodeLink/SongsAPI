const ErrorCodes = require("../constants/errorCodes");
const ErrorApp = require("../utils/errorApp");
const GENRES = require("../constants/genres");
const emailValidator = require("validator");

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
    },

    validateEmail(email){
        if(!emailValidator.isEmail(email)){
            throw new ErrorApp(
                "Email invalido.",
                400,
                ErrorCodes.INVALID_DATA
            );
        }
    },

    validatePage(page){
        if(!page || page < 1){
            throw new ErrorApp(
                "Página selecionada não existe.",
                404,
                ErrorCodes.NOT_FOUND
            );
        }
    },

    validateArrayNotEmpty(array, field = "Campo"){
        if(!array || array.length < 1){
            throw new ErrorApp(
                `Nenhuma ${field} encontrada;`,
                404,
                ErrorCodes.NOT_FOUND
            );
        }
    }
}

