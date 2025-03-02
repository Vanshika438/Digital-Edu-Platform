import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: String,
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], // Reference Lessons
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Playlist", playlistSchema);
