import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { NotesSearchBar } from "@/components/notes/NotesSearchBar";
import Link from "next/link";
import { NotesGrid } from "@/components/notes/NotesGrid";
import getCurrentUserId from "@/lib/accountActions";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { fetchPublicNotesEdgeServer } from "@/lib/notes-server";

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

  const result = await fetchPublicNotesEdgeServer(searchQuery, currentPage);

  return (
    <>
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">
          {searchQuery
            ? `Found ${result.totalCount} notes for "${searchQuery}"`
            : `${result.totalCount} public notes available`}
        </p>
      </div>
      <NotesGrid notes={result.data} currentUserId={currentUserId} />
      <PaginationControls
        currentPage={result.currentPage}
        totalPages={result.totalPages}
        hasNextPage={result.hasNextPage}
        hasPreviousPage={result.hasPreviousPage}
        basePath="/notes"
      />
    </>
  );
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search;
  const currentPage = Number.parseInt(resolvedSearchParams.page || "1", 10);
  const userId = await getCurrentUserId();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-6">
          Community Knowledge
        </Badge>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          Public Notes
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl">
          Explore notes shared by our community. You can search for specific
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
      {/* Prefetch next page in the background */}
      {userId && (
        <link
          rel="prefetch"
          href={`/api/notes/public?page=${currentPage + 1}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
        />
      )}
    </div>
  );
}
