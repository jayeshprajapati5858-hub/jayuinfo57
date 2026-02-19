
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets a text response from Gemini given a prompt and conversation history.
 * Fixed: Added parameters to match the call in AIAssistant.tsx
 */
export const getGeminiResponse = async (prompt: string, history: any[] = []) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
    });
    // Use .text property directly as per guidelines
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to the AI right now. Please try again later.";
  }
};

/**
 * Matches an outfit image to mobile accessories using Gemini Vision.
 * Fixed: Added parameter to match the call in StyleMatcher.tsx
 */
export const matchOutfitToAccessories = async (base64Image: string) => {
  try {
    const prompt = "You are a fashion expert for MobileHub. Analyze the style and colors of this outfit and suggest matching mobile accessories (cases, chargers, cables) from our store. Mention product names and use IDs if you can (ID: 1 for chargers, ID: 2 for screen guards, ID: 3 for cases, ID: 4 for cables).";
    
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    
    const textPart = { text: prompt };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [imagePart, textPart] }],
    });
    
    // Use .text property directly
    return response.text;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Could not analyze the outfit at this time. Please ensure the image is clear.";
  }
};
