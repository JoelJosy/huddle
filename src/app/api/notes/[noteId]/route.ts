import { updateNote, deleteNote, UpdateNoteData } from "@/lib/noteActions";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface Note {
  id: string;
  title: string;
  excerpt: string;
  content_url: string;
  tags: string[];
  created_at: string;
  word_count?: number;
  user_id: string;
  subjects: {
    name: string;
  } | null;
  profiles: {
    full_name: string;
    email: string;
    username?: string;
    avatar_url?: string;
  } | null;
}

// GET /api/notes/[noteId] - Fetch a specific note
export async function GET(
  request: NextRequest,
  { params }: { params: { noteId: string } },
) {
  try {
    const { noteId } = params;

    if (!noteId || noteId === "undefined" || noteId.trim() === "") {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: note, error } = await supabase
      .from("notes")
      .select(
        `
        id,
        title,
        excerpt,
        content_url,
        tags,
        created_at,
        word_count,
        user_id,
        subjects(name)
      `,
      )
      .eq("id", noteId)
      .eq("visibility", "public")
      .single();

    if (error) {
      console.error("Error fetching note:", error);
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, email, username, avatar_url")
      .eq("id", note.user_id)
      .single();

    const transformedNote: Note = {
      ...note,
      subjects: Array.isArray(note.subjects)
        ? note.subjects[0] || null
        : note.subjects,
      profiles: profile || null,
    };

    return NextResponse.json(transformedNote, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("Unexpected error fetching note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/notes/[noteId] - Update a specific note
export async function PUT(
  request: NextRequest,
  { params }: { params: { noteId: string } },
) {
  try {
    const { noteId } = params;
    const body = await request.json();

    if (!noteId || noteId === "undefined" || noteId.trim() === "") {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

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

    const updateData: UpdateNoteData = {
      noteId,
      title,
      subject,
      tags,
      content,
      excerpt: body.excerpt,
      wordCount,
    };

    const result = await updateNote(updateData);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in update note API:", error);

    if (error.message === "User not authenticated") {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    if (error.message === "You don't have permission to edit this note") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (error.message.includes("Note not found")) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to update note" },
      { status: 500 },
    );
  }
}

// DELETE /api/notes/[noteId] - Delete a specific note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { noteId: string } },
) {
  try {
    const { noteId } = params;

    if (!noteId || noteId === "undefined" || noteId.trim() === "") {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    const result = await deleteNote(noteId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in delete note API:", error);

    if (error.message === "User not authenticated") {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    if (error.message.includes("Note not found")) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to delete note" },
      { status: 500 },
    );
  }
}
