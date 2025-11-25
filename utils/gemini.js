// utils/gemini.js - 100% Google Gemini, no fake Groq name again
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",        // Fast, cheap, perfect for SEO content
  generationConfig: {
    temperature: 0.9,
    topP: 0.95,
    maxOutputTokens: 3000,
    responseMimeType: "application/json"   // This one na the magic! Forces JSON output
  },
});

export async function generateContent(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean any leftover markdown just in case
    const cleanJson = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJson);  // Now 99.9% perfect JSON
  } catch (error) {
    console.error("Gemini Error:", error.message);
    throw error;
  }
}