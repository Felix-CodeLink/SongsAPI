const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadAudioMiddleware = require("../middlewares/uploadAudioMiddleware");
const router = express.Router();

const MusicController = require("../controllers/MusicController");

router.use(authMiddleware);

router.post("/upload", uploadAudioMiddleware.single("file"), MusicController.uploadMusic);

router.get("/search", MusicController.searchMusics)

router.delete("/delete/:musicId", MusicController.deleteMusic);

router.put("/update/:musicId", MusicController.updateMusic);

module.exports = router;