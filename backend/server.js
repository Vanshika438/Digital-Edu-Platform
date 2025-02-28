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
dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");

    // Seed default lessons
    await seedLessons();

    // Register Routes
    app.use("/api", testRoutes);
    app.use("/auth", authRoutes);
    app.use("/api/lessons", lessonRoutes);
    app.use("/api/chatbot", chatbotRoutes); 
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

// Start Server
startServer();
