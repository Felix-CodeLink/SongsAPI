const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadAudioMiddleware = require("../middlewares/uploadAudioMiddleware");
const router = express.Router();

const MusicControler = require("../controllers/MusicControler");

router.use(authMiddleware);

router.post("/upload", uploadAudioMiddleware.single("file"), MusicControler.upload);

module.exports = router;