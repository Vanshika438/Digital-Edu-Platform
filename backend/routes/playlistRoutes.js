import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPlaylist,
  getPlaylists,
  deletePlaylist, // ✅ Import this function
} from "../controllers/playlistController.js"; // ✅ Ensure the correct path

const router = express.Router();

router.post("/create", protect, createPlaylist);
router.get("/", protect, getPlaylists);
router.delete("/:playlistId", protect, deletePlaylist); // ✅ Now properly imported

export default router;
