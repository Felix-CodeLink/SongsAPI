const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");

router.post("/login", AuthController.login);

router.post("/signUp", UserController.signUp);

router.use(authMiddleware);

router.delete("/delete", UserController.deleteUser);
router.put("/update", UserController.updateUser);

module.exports = router;