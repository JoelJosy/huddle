import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_SECRET_KEY });

export async function generateMindmap(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `I want you to extract a structured mind map from the following text.

      It must be a JSON array of nodes where each node has:
      - id: unique string identifier
      - label: string (text shown in the mindmap)
      - parentId: null if root, or id of parent node
      - type: one of "topic", "subtopic", "detail" depending on its depth, if there are more than 3 levels, use "detail" for deeper nodes.
          
      Please ensure the hierarchy is consistent and suitable for rendering in a mind map UI.
      Here's the content to process:
      ${text}`,

      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              label: { type: Type.STRING },
              parentId: { type: Type.STRING },
              type: {
                type: Type.STRING,
                enum: ["topic", "subtopic", "detail"],
              },
            },
            required: ["id", "label", "type"],
            propertyOrdering: ["id", "label", "parentId", "type"],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return parsed;
  } catch (err) {
    console.error("Mindmap generation failed:", err);
    return [];
  }
}
