import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { userMessage } = req.body;
    if (!userMessage) return res.status(400).json({ error: "Message is required." });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const response = await model.generateContent(userMessage);
    
    res.json({ botReply: response.response.text() });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    res.status(500).json({ error: "Failed to get response from Gemini API." });
  }
});

export default router;
