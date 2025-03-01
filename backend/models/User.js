import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["student", "teacher"], default: "student" }, // New role field
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], // Track completed lessons
  lastViewedLesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }, // Store last viewed lesson
  playlists: [
    {
      name: String,
      lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
