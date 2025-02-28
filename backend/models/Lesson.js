import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  notesUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // ✅ Track completed students
});

export default mongoose.model("Lesson", LessonSchema);
