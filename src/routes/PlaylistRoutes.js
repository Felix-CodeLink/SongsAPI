const express = require("express");
const router = express.Router();
const authMuddleware = require("../middlewares/authMiddleware");

const PlaylistController = require("../controllers/PlaylistController");

router.use(authMuddleware);

router.post("/create", PlaylistController.createPlaylist);

router.put("/update/:playlistId", PlaylistController.updatePlaylist);

module.exports = router;