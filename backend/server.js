import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/auth.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import seedLessons from "./seedLessons.js";
import chatbotRoutes from "./routes/chatbot.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));

app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Connect to MongoDB and Seed Lessons
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");

    // ✅ Seed lessons only if the database is empty
    await seedLessons();

    // ✅ Register routes
    app.use("/api/tests", testRoutes);
    app.use("/auth", authRoutes);
    app.use("/api/lessons", lessonRoutes);
    app.use("/api/chatbot", chatbotRoutes);
    app.use("/api/playlists", playlistRoutes);
    app.use("/api/announcements", announcementRoutes);
    app.use("/api/users", userRoutes); // ✅ Ensure user routes are connected

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

startServer();