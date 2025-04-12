const MusicService = require("../services/MusicService.js");
const fs = require("fs");

module.exports = {
    async upload(req, res){
        try{
            const file = req.file;
            if(!file) return res.status(400).json({message: "Arquivo de audio não enviado"});

            const newMusic = await MusicService.uploadMusic({
                musicName: file.originalname,
                path: file.path,
                userId: req.userId,
                artistName: req.body.artistName,
                genre: req.body.genre
            });

            res.status(201).json({message: "Arquivo salvo com sucesso", music: newMusic});

        }catch(error) {
            console.error("🔴 Erro no upload de audio: -> ", error.message);
            console.error(error.stack);


            if(req.file){
                fs.unlink(req.file.path, err => {
                    if (err) {
                        console.warn("🟡 Falha ao remover arquivo:", err.message);
                    } else{
                        console.log("🟢 Arquivo removido com sucesso");
                    }
                });
            }

            res.status(500).json({message: error.message});
        }
    }
};