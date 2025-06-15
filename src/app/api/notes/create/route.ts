import { createNote, CreateNoteData } from "@/lib/noteActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { title, subject, tags, content, wordCount } = body;

    if (
      !title ||
      !subject ||
      !Array.isArray(tags) ||
      !content ||
      typeof wordCount !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 },
      );
    }

    const noteData: CreateNoteData = {
      title,
      subject,
      tags,
      content,
      excerpt: body.excerpt,
      wordCount,
    };

    const result = await createNote(noteData);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error in create note API:", error);

    if (error.message === "User not authenticated") {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create note" },
      { status: 500 },
    );
  }
}
