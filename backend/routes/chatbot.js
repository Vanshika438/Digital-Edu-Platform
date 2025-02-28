import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Initialize Gemini AI with API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chatbot API route
router.post("/", async (req, res) => {
  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-002" });

    const response = await model.generateContent(userMessage);
    const botReply = response.response.text();

    res.json({ botReply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to get response from Gemini API." });
  }
});
router.get("/messages", async (req, res) => {
    try {
      const userId = req.user.id; // Get logged-in user's ID (Make sure auth middleware is used)
      const messages = await Chat.findOne({ userId }); // Fetch messages only for the logged-in user
      res.json(messages ? messages.messages : []);
    } catch (error) {
      res.status(500).json({ message: "Error fetching chat messages" });
    }
  });
export default router;
