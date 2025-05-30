import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { NotesSearchBar } from "@/components/notes/NotesSearchBar";
import { NoteCard } from "@/components/notes/NoteCard";
import { EmptyState } from "@/components/notes/EmptyState";
import { fetchUserNotes } from "@/lib/notes";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

interface NotesPageProps {
  searchParams: {
    search?: string;
  };
}
async function getCurrentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id;
}

function NotesGrid({
  notes,
}: {
  notes: Awaited<ReturnType<typeof fetchUserNotes>>;
}) {
  if (notes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}

async function NotesContent({ searchQuery }: { searchQuery?: string }) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">
          Please log in to view your notes.
        </p>
      </div>
    );
  }

  const notes = await fetchUserNotes(userId, searchQuery);

  return (
    <>
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">
          {searchQuery
            ? `Found ${notes.length} notes for "${searchQuery}"`
            : `${notes.length} public notes available`}
        </p>
      </div>
      <NotesGrid notes={notes} />
    </>
  );
}

export default async function MyNotesPage({ searchParams }: NotesPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-6">
          Personal Knowledge
        </Badge>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          My Notes
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl">
          Explore notes that you have created. You can search for specific
          topics, subjects, or tags to find relevant information quickly.
        </p>

        <div className="flex flex-col items-center gap-4">
          <NotesSearchBar defaultValue={searchQuery} />
          <Button asChild variant={"default"}>
            <Link href="/notes/create">Create Note</Link>
          </Button>
        </div>
      </div>

      {/* Notes Content */}
      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="h-64 animate-pulse">
                <div className="bg-muted h-full rounded-lg" />
              </Card>
            ))}
          </div>
        }
      >
        <NotesContent searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}
