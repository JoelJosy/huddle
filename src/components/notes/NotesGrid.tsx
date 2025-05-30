"use client";

import { NoteCard } from "@/components/notes/NoteCard";
import { EmptyState } from "@/components/notes/EmptyState";
import { Note } from "@/lib/notes";

interface NotesGridProps {
  notes: Note[];
  currentUserId?: string;
}

export function NotesGrid({ notes, currentUserId }: NotesGridProps) {
  if (notes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
