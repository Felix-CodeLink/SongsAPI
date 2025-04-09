const UserService = require("../services/UserService");

module.exports = {

    async signUp (req, res){
        try{
            const {username, email, password} = req.body;
            const newUser = await UserService.createUser({username, email, password});
            res.status(201).json(newUser);
        } catch(error){
            console.log(error);
            res.status(400).json({mensagem: "Erro ao criar usuario"});
        }
    }
};