import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import type { Note } from "@/lib/notes";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-lg font-semibold hover:underline">
            <Link href={note.content_url || "#"}>{note.title}</Link>
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

        <div className="text-muted-foreground text-xs">
          <p>Created by {note.profiles?.full_name || "Unknown"}</p>
          <p>{new Date(note.created_at).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
