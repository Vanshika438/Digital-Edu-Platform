import express from "express";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";
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

// ✅ Get all lessons (Include user progress)
router.get("/", authenticate, async (req, res) => {
  try {
    let lessons = await Lesson.find().populate("uploadedBy", "name email");

    if (req.user) {
      const user = await User.findById(req.user.id);
      lessons = lessons.map(lesson => ({
        ...lesson.toObject(),
        isWatched: user?.recentVideos?.some(video => video.lesson.toString() === lesson._id.toString()),
      }));
    }

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Track Lesson Watch Progress
router.post("/:lessonId/watch", authenticate, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Store recently watched lessons (limit to last 10)
    user.recentVideos = user.recentVideos.filter(video => video.lesson.toString() !== lessonId);
    user.recentVideos.unshift({ lesson: lessonId, watchedAt: new Date() });

    if (user.recentVideos.length > 10) {
      user.recentVideos.pop();
    }

    await user.save();

    res.json({ message: "Lesson watch progress updated!", lessonId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get User Progress
router.get("/progress", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const watchedLessons = user.recentVideos.map(video => video.lesson.toString());
    const totalLessons = await Lesson.countDocuments();
    const progress = totalLessons ? (watchedLessons.length / totalLessons) * 100 : 0;

    res.json({ watchedLessons: watchedLessons.length, totalLessons, progress: Math.round(progress) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get Recently Watched Videos
router.get("/recent-videos", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("recentVideos.lesson");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.recentVideos || []);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
