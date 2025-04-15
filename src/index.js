const express = require("express");
const app = express();
const runMigrations = require('./runMigrations');
const sequelize = require('./database');

app.use(express.json());

const UserRoutes = require("./routes/UserRoutes.js");
app.use("/user", UserRoutes);

const MusicRoutes = require("./routes/MusicRoutes.js");
app.use("/music", MusicRoutes);

const PlaylistRoutes = require("./routes/PlaylistRoutes.js");
app.use("/playlist", PlaylistRoutes);

const PlaylistMusicsRoutes = require("./routes/PlaylistMusicsRoutes.js");
app.use("/playlistMusics", PlaylistMusicsRoutes);

const PORT = 5018;

(async () => {
    try{
        await sequelize.authenticate();
        console.log("Banco conectado com sucesso");

        await runMigrations();

        app.listen(PORT, () => {
            console.log("Servidor rodando. \nPorta: ", PORT);
        });
    }catch(error){
        console.error("Erro ao iniciar servidor", error);
    };
})();