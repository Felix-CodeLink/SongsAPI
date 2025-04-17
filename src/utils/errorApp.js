class errorApp extends Error{
    constructor(message, status = 400, code = "UNEXPECTED_ERROR"){
        super(message);
        this.status = status;
        this.code = code
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = errorApp;