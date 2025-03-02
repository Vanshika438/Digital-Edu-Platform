// Import schemas
import Playlist from "../models/Playlist.js";  
import Lesson from "../models/Lesson.js"; 
import User from "../models/User.js";
// Create a new playlist
export const createPlaylist = async (req, res) => {
    try {
        const { name, lessons } = req.body;

        // Fetch the correct lesson IDs from database
        const validLessons = await Lesson.find({ _id: { $in: lessons } }, "_id");

        // If some lessons are missing, return an error
        if (validLessons.length !== lessons.length) {
            return res.status(400).json({ message: "Some lessons do not exist." });
        }

        // Store only valid ObjectIds
        const newPlaylist = new Playlist({
            name,
            lessons: validLessons.map(lesson => lesson._id), 
            user: req.user._id,
        });

        await newPlaylist.save();
        res.status(201).json(newPlaylist);
    } catch (error) {
        console.error("❌ Error creating playlist:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getPlaylists = async (req, res) => {
    try {
        // Fetch playlists & automatically populate lessons
        const playlistsWithLessons = await Playlist.find({ user: req.user._id })
            .populate("lessons", "title videoUrl description"); // ✅ Auto-populate lessons

        console.log("✅ Fully Populated Playlists:", playlistsWithLessons);
        res.json(playlistsWithLessons);
    } catch (error) {
        console.error("❌ Error fetching playlists:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a playlist
export const deletePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;

        // Find the playlist first
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            console.error("Playlist not found:", playlistId);
            return res.status(404).json({ message: "Playlist not found" });
        }

        // Check if the playlist belongs to the logged-in user
        if (playlist.user.toString() !== req.user._id.toString()) {
            console.error("Unauthorized attempt to delete playlist:", req.user._id);
            return res.status(403).json({ message: "You are not authorized to delete this playlist" });
        }

        // Remove the playlist from the user's `playlists` array
        const user = await User.findById(req.user._id);
        if (!user) {
            console.error("User not found:", req.user._id);
            return res.status(404).json({ message: "User not found" });
        }

        user.playlists = user.playlists.filter(id => id.toString() !== playlistId);
        await user.save();

        // Delete the playlist from the database
        await Playlist.findByIdAndDelete(playlistId);

        console.log("Playlist deleted successfully:", playlistId);
        res.json({ message: "Playlist deleted successfully" });

    } catch (error) {
        console.error("Error deleting playlist:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

