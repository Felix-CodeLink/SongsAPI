const {Sequelize} = require("sequelize");
const dbConfig = require("./config/config")["development"];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false
});

module.exports = sequelize;