const UserService = require("../services/UserService");

module.exports = {

    async signUp (req, res){
        try{
            const {username, email, password} = req.body;
            const newUser = await UserService.createUser({username, email, password});
            res.status(201).json(newUser);
        } catch(error){
            console.log(error);
            res.status(400).json({ message: error.message});
        }
    },

    async delete(req, res){
        try{
            await UserService.deleteUserByToken(req.userId);
            res.status(200).json({ message: "Usuario deletado com sucesso"});
        } catch(error){
            console.log(error)
            res.status(401).json({ message: error.message});
        }
    },

    async update(req, res){
        try{
            const {username, email, password} = req.body;
            const id = req.userId;
            const data = {
                username: username,
                email: email,
                password: password
            };

            const newToken = await UserService.updateUser(data, id);
            res.status(200).json({message: "Usuario atualizado com sucesso", token: newToken});
        } catch(error){
            console.log(error);
            res.status(409).json({message: error.message});
        }
    }
};