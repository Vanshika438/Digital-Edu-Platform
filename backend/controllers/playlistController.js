import Playlist from "../models/Playlist.js"; // Import Playlist schema
import Lesson from "../models/Lesson.js"; // Import Lesson schema
import User from "../models/User.js"; // Import User schema

// Create a new playlist
export const createPlaylist = async (req, res) => {
    try {
        const { name, lessons } = req.body;

        // Validate lessons exist
        const validLessons = await Lesson.find({ _id: { $in: lessons } });
        if (validLessons.length !== lessons.length) {
            return res.status(400).json({ message: "Some lessons are invalid" });
        }

        // Create new playlist
        const newPlaylist = new Playlist({
            name,
            lessons,
            user: req.user._id, // Associate playlist with user
        });

        await newPlaylist.save();

        // Add the playlist to the user's list
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.playlists.push(newPlaylist._id);
        await user.save();

        res.status(201).json(newPlaylist);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all playlists of a user
export const getPlaylists = async (req, res) => {
    try {
        // Fetch the user
        const user = await User.findById(req.user._id).lean();
        if (!user) return res.status(404).json({ message: "User not found" });

        // Fetch all playlists of the user
        const playlists = await Playlist.find({ user: req.user._id }).populate("lessons", "title videoUrl");

        res.json(playlists);
    } catch (error) {
        console.error("Error fetching playlists:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a playlist
export const deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });

        // Check if the user is the owner of the playlist
        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this playlist" });
        }

        await playlist.remove();

        // Remove the playlist reference from the user's playlists
        const user = await User.findById(req.user._id);
        user.playlists = user.playlists.filter(p => p.toString() !== req.params.playlistId);
        await user.save();

        res.json({ message: "Playlist deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
