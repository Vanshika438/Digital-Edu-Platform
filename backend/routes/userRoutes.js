import express from "express";
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Get user progress
router.get("/progress", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalLessons = await Lesson.countDocuments();
    const watchedLessons = user.recentVideos.length;

    const progress = totalLessons > 0 ? (watchedLessons / totalLessons) * 100 : 0;

    res.json({ progress: Math.round(progress) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get recently watched lessons
router.get("/recent-lessons", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("recentVideos.lesson", "title videoUrl");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.recentVideos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get completed lessons
router.get("/completed-lessons", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const completedLessons = user.recentVideos.map(video => video.lesson);
    res.json(completedLessons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Update recently watched lesson
router.post("/recent-lessons/:lessonId", authenticate, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { time } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove if already exists
    user.recentVideos = user.recentVideos.filter((v) => v.lesson.toString() !== lessonId);

    // Add lesson with watch time
    user.recentVideos.unshift({ lesson: lessonId, watchedAt: new Date(), progress: time });

    // Keep only last 5 watched lessons
    if (user.recentVideos.length > 5) user.recentVideos.pop();

    await user.save();

    res.json({ message: "Recent lesson updated", recentVideos: user.recentVideos });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;