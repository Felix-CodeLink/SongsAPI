const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const PlaylistMusicsController = require("../controllers/PlaylistMusicsController");

router.use(authMiddleware);

router.post("/addMusic/:playlistId", PlaylistMusicsController.addMusics);

module.exports = router;