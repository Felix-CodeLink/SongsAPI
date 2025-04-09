const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const UserControler = require("../controllers/UserControler");

router.post("/login", AuthController.login);

router.post("/signUp", UserControler.signUp);

router.use(authMiddleware);

module.exports = router;