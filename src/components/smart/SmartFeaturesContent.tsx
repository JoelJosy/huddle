"use client";

import { useState, useEffect } from "react";
import { fetchPublicNotes, type Note, fetchPublicNotesEdge } from "@/lib/notes";
import { SmartNotesSelector } from "@/components/smart/SmartNotesSelector";
import { SmartFeatureCards } from "@/components/smart/SmartFeatureCards";

interface SmartFeaturesContentProps {
  searchQuery?: string;
  currentUserId: string | undefined;
}

export function SmartFeaturesContent({
  searchQuery,
  currentUserId,
}: SmartFeaturesContentProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const result = await fetchPublicNotesEdge(searchQuery, 1, 5);
        const fetchedNotes = result.data;
        setNotes(fetchedNotes);
        // Clear selected note if it's not in the new results
        if (
          selectedNote &&
          !fetchedNotes.find((note: Note) => note.id === selectedNote.id)
        ) {
          setSelectedNote(null);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [searchQuery, selectedNote]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left side - Notes Selection (2/3 width) */}
      <div className="space-y-4 lg:col-span-2">
        <SmartNotesSelector
          notes={notes}
          selectedNote={selectedNote}
          onNoteSelect={setSelectedNote}
          searchQuery={searchQuery}
          isLoading={isLoading}
        />
      </div>

      {/* Right side - Smart Feature Cards (1/3 width) */}
      <div className="space-y-6 lg:col-span-1">
        <SmartFeatureCards selectedNote={selectedNote} />
      </div>
    </div>
  );
}
