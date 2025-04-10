const express = require("express");
const sequelize = require("./database");
const app = express();


app.use(express.json());

const UserRoutes = require("./routes/UserRoutes.js");

app.use("/user", UserRoutes);

const PORT = 5018;

sequelize.sync()
    .then(() => console.log("Banco conectado"))
    .catch(erro => console.log("Erro: ", erro));

    app.listen(PORT, () => {
        console.log("Servidor Rodando");
    })