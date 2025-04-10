const path = require("path");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

module.exports = {
    secret: process.env.JWT_SECRET,
    expiresIn: "1d",
};