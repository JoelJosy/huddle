import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Note } from "@/lib/notes";

interface NoteCardProps {
  note: Note;
  currentUserId?: string; // Add currentUserId prop
}

export function NoteCard({ note, currentUserId }: NoteCardProps) {
  const getUserDisplayName = () => {
    // Priority: full_name > username > email prefix
    if (note.profiles?.full_name) {
      return note.profiles.full_name;
    }
    if (note.profiles?.username) {
      return note.profiles.username;
    }
    if (note.profiles?.email) {
      return note.profiles.email.split("@")[0];
    }
    return "Unknown User";
  };

  const isOwner = currentUserId === note.user_id;

  const handleDelete = async () => {
    // Implement delete functionality here
    // Example:
    // await deleteNote(note.id);
    // Refresh the notes list after deletion
    console.log(`Deleting note ${note.id}`);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-lg font-semibold hover:underline">
            <Link href={`/notes/${note.id}`}>{note.title}</Link>
          </h3>
          <Badge variant="secondary" className="shrink-0">
            {note.subjects?.name || "General"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {note.excerpt || "No excerpt available"}
        </p>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="text-muted-foreground space-y-1 text-xs">
          <p>Created by {getUserDisplayName()}</p>
          <p>{new Date(note.created_at).toLocaleDateString()}</p>
          {note.word_count && <p>{note.word_count} words</p>}
        </div>

        {/* Conditionally render edit/delete buttons */}
        {isOwner && (
          <div className="flex justify-end gap-2">
            <Link href={`/notes/edit/${note.id}`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
