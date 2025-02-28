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

// ✅ Get all lessons (Include user completion status)
router.get("/", authenticate, async (req, res) => {
  try {
    let lessons = await Lesson.find().populate("uploadedBy", "name email");

    if (req.user) {
      lessons = lessons.map(lesson => ({
        ...lesson.toObject(),
        isCompleted: lesson.completedBy.includes(req.user.id),
      }));
    }

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get completed lessons for a user
router.get("/:userId/completed-lessons", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const completedLessons = await Lesson.find({ completedBy: user._id }).select("_id");
    res.json(completedLessons.map(lesson => lesson._id)); // Return only lesson IDs
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Mark a lesson as completed
router.post("/:lessonId/complete", authenticate, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    if (lesson.completedBy.includes(userId)) {
      return res.status(400).json({ message: "Already completed" });
    }

    lesson.completedBy.push(userId);
    await lesson.save();

    res.json({ message: "Lesson marked as completed!", lessonId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Unmark a lesson as completed
router.post("/:lessonId/uncomplete", authenticate, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    if (!lesson.completedBy.includes(userId)) {
      return res.status(400).json({ message: "Lesson is not completed yet" });
    }

    lesson.completedBy = lesson.completedBy.filter(id => id.toString() !== userId);
    await lesson.save();

    res.json({ message: "Lesson unmarked as completed!", lessonId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
