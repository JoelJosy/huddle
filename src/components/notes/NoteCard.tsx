"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Note } from "@/lib/notes";
import { deleteNote } from "@/lib/noteActions";
import { useState, useTransition, memo } from "react";
import { toast } from "sonner";

interface NoteCardProps {
  note: Note;
  currentUserId?: string;
}

export const NoteCard = memo(function NoteCard({
  note,
  currentUserId,
}: NoteCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteNote(note.id);
        toast.success("Note deleted successfully!");
        setShowDeleteDialog(false);
      } catch (error) {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note. Please try again.");
      }
    });
  };

  const isOwner = currentUserId === note.user_id;

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

        {/* Author Info with Avatar */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={note.profiles?.avatar_url}
              alt={getUserDisplayName()}
            />
            <AvatarFallback>
              {getUserDisplayName()[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{getUserDisplayName()}</p>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>{new Date(note.created_at).toLocaleDateString()}</span>
              {note.word_count && (
                <>
                  <span>•</span>
                  <span>{note.word_count} words</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Conditionally render edit/delete buttons */}
        {isOwner && (
          <div className="flex justify-end gap-2 border-t pt-2">
            <Link href={`/notes/edit/${note.id}`}>
              <Button variant="ghost" size="icon" disabled={isPending}>
                <Edit className="h-4 w-4" />
              </Button>
            </Link>

            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  className="hover:text-destructive"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete {note.title}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The note and its content will
                    be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete Note
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
