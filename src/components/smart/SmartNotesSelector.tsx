"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotesSearchBar } from "@/components/notes/NotesSearchBar";
import { Clock, FileText, User, Hash } from "lucide-react";
import type { Note } from "@/lib/notes";
import { cn } from "@/lib/utils";

interface SmartNotesSelectorProps {
  notes: Note[];
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
  searchQuery?: string;
  isLoading: boolean;
}

export function SmartNotesSelector({
  notes,
  selectedNote,
  onNoteSelect,
  searchQuery,
  isLoading,
}: SmartNotesSelectorProps) {
  // Ensure notes is always an array
  const safeNotes = Array.isArray(notes) ? notes : [];

  const getUserDisplayName = (note: Note) => {
    if (note.profiles?.full_name) return note.profiles.full_name;
    if (note.profiles?.username) return note.profiles.username;
    if (note.profiles?.email) return note.profiles.email.split("@")[0];
    return "Unknown User";
  };

  const getUserInitials = (note: Note) => {
    const name = getUserDisplayName(note);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Select a Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted h-12 animate-pulse rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-muted h-24 animate-pulse rounded-lg"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Select a Note
          <Badge variant="secondary" className="ml-auto">
            {safeNotes.length} available
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <NotesSearchBar defaultValue={searchQuery} />

        {/* Notes List */}
        <ScrollArea className="h-[500px] pr-2">
          {safeNotes.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No notes found for your search."
                  : "No public notes available."}
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-1">
              {safeNotes.map((note) => (
                <Card
                  key={note.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedNote?.id === note.id
                      ? "ring-primary bg-primary/5 ring-2"
                      : "hover:bg-muted/50",
                  )}
                  onClick={() => onNoteSelect(note)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Title and Author */}
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={note.profiles?.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {getUserInitials(note)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 line-clamp-2 text-sm font-medium">
                            {note.title}
                          </h3>
                          <div className="text-muted-foreground flex items-center gap-1 text-xs">
                            <User className="h-3 w-3" />
                            <span className="truncate">
                              {getUserDisplayName(note)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Excerpt */}
                      <p className="text-muted-foreground line-clamp-2 text-xs">
                        {note.excerpt}
                      </p>

                      {/* Metadata */}
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          {note.subjects && (
                            <div className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              <span>{note.subjects.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(note.created_at)}</span>
                          </div>
                        </div>
                        {note.word_count && (
                          <span className="bg-muted rounded px-2 py-1 text-xs">
                            {note.word_count} words
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="px-2 py-0 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="px-2 py-0 text-xs"
                            >
                              +{note.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
