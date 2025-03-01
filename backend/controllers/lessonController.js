import User from "../models/User.js";
import Lesson from "../models/Lesson.js";

// Update last viewed lesson
export const updateLastViewedLesson = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const lesson = await Lesson.findById(req.params.lessonId);
      if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  
      user.lastViewedLesson = lesson._id; // Store ObjectId, not string
      await user.save();
  
      res.json({ message: "Last viewed lesson updated", lastViewedLesson: user.lastViewedLesson });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
// Get last viewed lesson
export const getLastViewedLesson = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("lastViewedLesson");
    if (!user || !user.lastViewedLesson) {
      return res.status(404).json({ message: "No last viewed lesson found" });
    }
    res.json(user.lastViewedLesson);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
