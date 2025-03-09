import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["student", "teacher"], default: "student" },
  recentVideos: [
    {
      lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
      watchedAt: { type: Date, default: Date.now },
      progress: { type: Number, default: 0 }, // Stores last watched time in seconds
    },
  ],
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
});

const User = mongoose.model("User", userSchema);

export default User;
