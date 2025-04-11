const express = require("express");
const sequelize = require("./database");
const {Sequelize} = require("sequelize");
const {Umzug, SequelizeStorage} = require("umzug");
const app = express();

app.use(express.json());

const UserRoutes = require("./routes/UserRoutes.js");
app.use("/user", UserRoutes);

const PORT = 5018;

async function runMigrations() {
    const umzug = new Umzug({
        migrations:{
            glob: "./src/migrations/*.js",
            resolve: ({name, path, context}) => {
                const migration = require(path);
                return {
                    name,
                    up: async () => migration.up(context, Sequelize),
                    down: async () => migration.down(context, Sequelize),
                };
            },
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
    });

    await umzug.up();
    console.log("Migrations executadas com sucesso");
};

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