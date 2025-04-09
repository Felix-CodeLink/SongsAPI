const express = require("express");
const sequelize = require("./database");
const app = express();
const PORT = 5018;

app.use(express.json());

sequelize.sync()
    .then(() => console.log("Banco conectado"))
    .catch(erro => console.log("Erro: ", erro));

    app.listen(PORT, () => {
        console.log("Servidor Rodando");
    })