import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, FileText, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import NoteViewer from "@/components/notes/NoteViewer";
import { fetchNoteById, fetchNoteContent } from "@/lib/notes";
import { createClient } from "@/utils/supabase/server";

interface NotePageProps {
  params: Promise<{ noteId: string }>;
}

async function NoteContent({ noteId }: { noteId: string }) {
  // Add validation for the noteId
  if (!noteId || noteId === "undefined") {
    console.error("Invalid note ID:", noteId);
    notFound();
  }

  const note = await fetchNoteById(noteId);

  if (!note) {
    console.error("Note not found for ID:", noteId);
    notFound();
  }

  // Get current user to check ownership
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user && user.id === note.user_id;

  // Fetch the actual content from storage
  const content = await fetchNoteContent(note.content_url);

  const getUserDisplayName = () => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/notes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Notes
              </Link>
            </Button>
            {isOwner && (
              <Button asChild>
                <Link href={`/notes/edit/${noteId}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Note
                </Link>
              </Button>
            )}
          </div>
          <h1 className="mb-2 text-3xl font-bold">{note.title}</h1>
          <p className="text-muted-foreground">
            {note.excerpt || "No excerpt available"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Section - Note Details */}
          <div className="space-y-6 lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Note Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Subject</h3>
                  <Badge variant="secondary" className="w-fit">
                    {note.subjects?.name || "General"}
                  </Badge>
                </div>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Author Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Author</h3>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {getUserDisplayName()}
                      </p>
                      {note.profiles?.email && (
                        <p className="text-muted-foreground text-xs">
                          {note.profiles.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Publication Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span className="text-muted-foreground">Published on</span>
                  </div>
                  <p className="text-sm">
                    {new Date(note.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Word Count */}
                {note.word_count && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span className="text-muted-foreground">Word Count</span>
                    </div>
                    <p className="text-sm">{note.word_count} words</p>
                  </div>
                )}

                {/* Owner Actions */}
                {isOwner && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Actions</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link href={`/notes/edit/${noteId}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Note
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Note Content */}
          <NoteViewer content={content} wordCount={note.word_count} />
        </div>
      </div>
    </div>
  );
}

export default async function NotePage(props: NotePageProps) {
  const params = await props.params;
  const noteId = params.noteId;

  // Add validation here too
  if (!noteId || noteId === "undefined") {
    console.error("Invalid note ID in page component:", noteId);
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/notes">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Notes
                </Link>
              </Button>
              <div className="bg-muted mb-2 h-8 w-64 animate-pulse rounded" />
              <div className="bg-muted h-4 w-48 animate-pulse rounded" />
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-4">
                <Card className="h-64 animate-pulse">
                  <div className="bg-muted h-full rounded-lg" />
                </Card>
              </div>
              <div className="lg:col-span-8">
                <Card className="h-96 animate-pulse">
                  <div className="bg-muted h-full rounded-lg" />
                </Card>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <NoteContent noteId={noteId} />
    </Suspense>
  );
}
