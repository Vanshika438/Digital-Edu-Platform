import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import mongoose from "mongoose";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//  Update User Profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    console.log("🔹 Update profile request received:", req.body);
    console.log("🔹 User ID from token:", req.user.id);

    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Profile updated:", user);
    res.json(user);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// **Google Authentication Route**
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, password: "", picture, role: "student" });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token: jwtToken, user });
  } catch (error) {
    res.status(400).json({ message: `Google login failed: ${error.message}` });
  }
});

// **Register User**
router.post("/register", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: "Database not connected. Please try again later." });
    }

    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token: jwtToken, user });
  } catch (error) {
    res.status(500).json({ message: `Registration failed: ${error.message}` });
  }
});

// **Login User**
router.post("/login", async (req, res) => {
  try {
    console.log("🔹 Login request received:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ Login successful. Sending response...");
    res.json({ token: jwtToken, user });
  } catch (error) {
    res.status(500).json({ message: `Login failed: ${error.message}` });
  }
});

export default router;
