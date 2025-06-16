import { NextResponse } from "next/server";
import {
  fetchNoteByIdEdgeServer,
  fetchNoteContentEdgeServer,
} from "@/lib/notes-server";
import { parseToText } from "@/utils/tiptap/parseToText";
import { generateQuiz } from "@/utils/gemini/generateQuiz";

export async function GET(
  req: Request,
  context: { params: { noteId: string } },
) {
  const { noteId } = await context.params;

  const note = await fetchNoteByIdEdgeServer(noteId);
  if (!note)
    return NextResponse.json({ error: "Note not found" }, { status: 404 });

  const json = await fetchNoteContentEdgeServer(note.content_url);
  if (!json)
    return NextResponse.json({ error: "Content not found" }, { status: 404 });

  const plainText = parseToText(json);
  const summary = await generateQuiz(plainText);

  return NextResponse.json({ summary });
}
