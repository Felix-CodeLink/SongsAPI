const {Sequelize} = require("sequelize");
const dbConfig = require("./config/config")["development"];

const sequelize = new Sequelize(dbConfig.da, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false
});

module.exports = sequelize;