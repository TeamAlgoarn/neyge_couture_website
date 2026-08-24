import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are an AI shopping assistant for "Handloom Sarees" - an eCommerce store specializing in authentic handcrafted Indian sarees.

Your expertise:
- Traditional handloom sarees (Silk, Cotton, Linen, Khadi)
- Fabric types and their characteristics
- Occasions (Wedding, Casual, Festive, Party)
- Color combinations and styling tips
- Care instructions for different fabrics
- Pricing and value guidance
- Regional weaving styles (Banarasi, Kanjivaram, Chanderi, Paithani, etc.)

Guidelines:
- Be warm, knowledgeable, and helpful
- Provide specific, actionable advice
- Ask clarifying questions when needed
- Keep responses concise (2-3 sentences unless more detail is requested)
- Use a friendly, professional tone
- If you don't know something, be honest`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ reply: "Please provide a message." });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is not set");
      return res.status(500).json({
        reply: "Server configuration error."
      });
    }

    console.log("📤 Sending request to Gemini...");

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest"
    });

    // Combine system prompt with user message
    const prompt = `${SYSTEM_PROMPT}\n\nCustomer: ${message}`;

    // Generate content
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const reply = result.response.text();

    console.log("✅ Response generated successfully");
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error:", error.message);

    // Handle specific errors
    if (error.message.includes('API key')) {
      return res.status(500).json({
        reply: "API key error. Please check your configuration."
      });
    }

    if (error.message.includes('quota')) {
      return res.status(429).json({
        reply: "Rate limit reached. Please try again in a moment."
      });
    }

    res.status(500).json({
      reply: "Sorry, I'm having trouble responding right now. Please try again."
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    model: "gemini-1.5-pro-latest",
    apiKey: process.env.GEMINI_API_KEY ? "configured" : "missing",
    sdk: "@google/generative-ai"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("═══════════════════════════════════════");
  console.log("✅ Gemini AI Chatbot Server Running");
  console.log("═══════════════════════════════════════");
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📦 Model: gemini-1.5-pro-latest`);
  console.log(`🔑 API Key: ${process.env.GEMINI_API_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log(`📚 SDK: @google/generative-ai`);
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("Test the health check:");
  console.log(`  → http://localhost:${PORT}/api/health`);
  console.log("");
});