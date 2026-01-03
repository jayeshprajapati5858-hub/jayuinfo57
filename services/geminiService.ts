
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
// Safety check: If no API key is present (common in static hosting uploads if not configured), 
// we avoid crashing the app immediately, but requests will fail.
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

// Construct a system instruction that knows about our inventory
const systemInstruction = `
You are "MobileHub Assistant", a helpful and knowledgeable sales assistant for a mobile accessories shop.
Your goal is to help customers find the right products from our inventory.

Here is our current product inventory in JSON format:
${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category, description: p.description })))}

Rules:
1. Always be polite, professional, and concise.
2. If a user asks for a recommendation, suggest products from the inventory list above.
3. If the user asks about a product we don't have, politely suggest a similar category or say we don't stock it.
4. Mention prices in the local currency (implied from the data).
5. Keep answers short (under 100 words) unless detailed technical info is asked.
`;

export const getGeminiResponse = async (userMessage: string, history: { role: string, parts: { text: string }[] }[]) => {
  if (!ai) {
    console.warn("Gemini API Key is missing.");
    return "I am currently offline. Please contact the store owner to configure my API key.";
  }

  try {
    const model = 'gemini-3-flash-preview'; 
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: history
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("I'm having trouble connecting to the server right now. Please try again later.");
  }
};
