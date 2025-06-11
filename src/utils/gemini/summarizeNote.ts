import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_SECRET_KEY });

export async function summarizeNote(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an expert summarizer. Summarize the following academic notes in bullet points retaiining the key concepts, make it look pretty:
                ${text}`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error summarizing note:", error);
    return "Error summarizing note.";
  }
}
