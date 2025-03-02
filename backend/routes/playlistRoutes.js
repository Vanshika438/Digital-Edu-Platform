import express from "express";
import { createPlaylist, getPlaylists, deletePlaylist } from "../controllers/playlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createPlaylist);  
router.get("/", protect, getPlaylists);  
router.delete("/:playlistId", protect, deletePlaylist); 

export default router;
