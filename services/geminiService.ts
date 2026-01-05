
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY missing in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const systemInstruction = `
You are "MobileHub Assistant", a helpful sales assistant for a mobile accessories shop.
Inventory: ${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, category: p.category })))}

When a user uploads an outfit photo:
1. Identify the dominant colors and style (e.g., Casual, Formal, Sporty).
2. Recommend the 3 best matching mobile accessories from our inventory by ID.
3. Return response in plain text like: "I see you're wearing [colors]. I recommend [Product Name] (ID: [ID]) because it matches your [style] vibe."
`;

export const getGeminiResponse = async (userMessage: string, history: { role: string, parts: { text: string }[] }[]) => {
  try {
    const ai = getAIInstance();
    if (!ai) throw new Error("AI not configured");

    const model = 'gemini-3-flash-preview'; 
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: history as any
    });
    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Connection trouble. Try again.");
  }
};

export const matchOutfitToAccessories = async (base64Image: string) => {
  try {
    const ai = getAIInstance();
    if (!ai) return "AI service is currently unavailable.";

    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Based on this outfit, suggest 3 matching products from our inventory by ID and explain why. Inventory IDs: " + PRODUCTS.map(p => p.id).join(', ')
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text;
  } catch (error) {
    console.error("Style Matcher Error:", error);
    return "Could not analyze style at this time.";
  }
};
