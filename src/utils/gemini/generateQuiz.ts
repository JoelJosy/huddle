import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_SECRET_KEY });

export async function generateQuiz(text: string): Promise<any[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an expert quiz creator. Based on the following academic notes, generate exactly 5 multiple-choice questions (MCQs). Each question must have:
        - A question string
        - 4 answer options (as strings)
        - The correct answer (exact string that matches one of the options)`,

      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.STRING },
            },
            propertyOrdering: ["question", "options", "correctAnswer"],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return parsed; // array of quiz objects
  } catch (error) {
    console.error("Error generating structured MCQ quiz:", error);
    return [];
  }
}
