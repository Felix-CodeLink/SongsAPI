const express = require("express");
const router = express.Router();
const authMuddleware = require("../middlewares/authMiddleware");

const PlaylistController = require("../controllers/PlaylistController");

router.use(authMuddleware);

router.post("/create", PlaylistController.createPlaylist);

router.put("/update/:playlistId", PlaylistController.updatePlaylist);

router.delete("/delete/:playlistId", PlaylistController.deletePlaylist);

router.get("/playlists/:page", PlaylistController.getUserPlaylists);

module.exports = router;