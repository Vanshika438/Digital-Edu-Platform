import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["student", "teacher"], default: "student" },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  lastViewedLesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
});

const User = mongoose.model("User", userSchema);

export default User;
