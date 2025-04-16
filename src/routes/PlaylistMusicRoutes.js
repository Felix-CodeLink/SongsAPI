const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const PlaylistMusicController = require("../controllers/PlaylistMusicController");

router.use(authMiddleware);

router.post("/addMusic/:playlistId", PlaylistMusicController.addMusics);
router.get("/getMusics/:playlistId", PlaylistMusicController.getMusics);
router.delete("/removeMusic/:playlistId", PlaylistMusicController.removeMusics);

module.exports = router;