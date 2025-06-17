import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_SECRET_KEY });

export async function POST(request: NextRequest) {
  try {
    const { text, fileName } = await request.json();

    if (!text) {
      return NextResponse.json(
        { success: false, error: "No text provided" },
        { status: 400 },
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an expert content formatter for academic note-taking. Please format this extracted PDF text into clean, well-structured HTML content.

Guidelines:
- Use proper HTML tags (h1, h2, h3, p, ul, li, ol, strong, em, etc.)
- Break content into logical sections with appropriate headings
- Create bullet points or numbered lists where appropriate
- Preserve important information but improve readability
- Remove excessive whitespace and formatting artifacts
- Make it suitable for academic note-taking
- Use semantic HTML structure
- Don't include any CSS styling - just clean HTML markup

Original filename: ${fileName || "Unknown"}

Raw text to format:
${text}

Return only the formatted HTML content without any markdown code blocks or explanations:`,
    });

    const formattedText = response.text || text;

    return NextResponse.json({
      success: true,
      formattedText: formattedText.trim(),
    });
  } catch (error) {
    console.error("Error formatting text with Gemini:", error);
    return NextResponse.json(
      { success: false, error: "Failed to format text with AI" },
      { status: 500 },
    );
  }
}
