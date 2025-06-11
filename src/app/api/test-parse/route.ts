import { summarizeNote } from "@/utils/gemini/summarizeNote";
import { NextResponse } from "next/server";

export async function GET() {
  const text = `
    Artificial Intelligence (AI) is the field of developing machines that can simulate human intelligence.
    It is used in robotics, automation, natural language processing, and many more areas.
  `;

  const summary = await summarizeNote(text);
  return NextResponse.json({ summary });
}
