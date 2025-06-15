import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { NotesSearchBar } from "@/components/notes/NotesSearchBar";
import { NotesGrid } from "@/components/notes/NotesGrid";
import { fetchUserNotes } from "@/lib/notes";
import Link from "next/link";
import getCurrentUserId from "@/lib/accountActions";
import { PaginationControls } from "@/components/shared/pagination-controls";

interface NotesPageProps {
  searchParams: {
    search?: string;
    page?: string;
  };
}

interface NotesContentProps {
  searchQuery?: string;
  currentUserId: string | undefined;
  currentPage: number;
}

async function NotesContent({
  searchQuery,
  currentUserId,
  currentPage,
}: NotesContentProps) {
  if (!currentUserId) {
    return (
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">
          Please log in to view your notes.
        </p>
      </div>
    );
  }

  const result = await fetchUserNotes(currentUserId, searchQuery, currentPage);

  return (
    <>
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">
          {searchQuery
            ? `Found ${result.totalCount} notes for "${searchQuery}"`
            : `Found ${result.totalCount} notes`}
        </p>
      </div>
      <NotesGrid notes={result.data} currentUserId={currentUserId} />
      <PaginationControls
        currentPage={result.currentPage}
        totalPages={result.totalPages}
        hasNextPage={result.hasNextPage}
        hasPreviousPage={result.hasPreviousPage}
        basePath="/notes/my-notes"
      />
    </>
  );
}

export default async function MyNotesPage({ searchParams }: NotesPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search;
  const currentPage = Number.parseInt(resolvedSearchParams.page || "1", 10);
  const userId = await getCurrentUserId();

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
        <NotesContent
          searchQuery={searchQuery}
          currentUserId={userId}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}
