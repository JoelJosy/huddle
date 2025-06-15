import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { GroupsSearchBar } from "@/components/groups/GroupsSearchBar";
import { fetchPublicGroups } from "@/lib/groups";
import { GroupsGrid } from "@/components/groups/GroupsGrid";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import getCurrentUserId from "@/lib/accountActions";
import { PaginationControls } from "@/components/shared/pagination-controls";

interface GroupsPageProps {
  searchParams: {
    search?: string;
    page?: string;
  };
}

interface GroupsContentProps {
  searchQuery?: string;
  currentUserId: string | undefined;
  currentPage: number;
}

async function GroupsContent({
  searchQuery,
  currentUserId,
  currentPage,
}: GroupsContentProps) {
  if (!currentUserId) {
    return (
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">
          Please log in to view study groups.
        </p>
      </div>
    );
  }

  const result = await fetchPublicGroups(searchQuery, currentPage);

  return (
    <>
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">
          {searchQuery
            ? `Found ${result.totalCount} groups for "${searchQuery}"`
            : `${result.totalCount} public study groups available`}
        </p>
      </div>
      <GroupsGrid groups={result.data} currentUserId={currentUserId} />
      <PaginationControls
        currentPage={result.currentPage}
        totalPages={result.totalPages}
        hasNextPage={result.hasNextPage}
        hasPreviousPage={result.hasPreviousPage}
        basePath="/groups"
      />
    </>
  );
}

export default async function GroupsPage({ searchParams }: GroupsPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search;
  const currentPage = Number.parseInt(resolvedSearchParams.page || "1", 10);
  const userId = await getCurrentUserId();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-6">
          Study Together
        </Badge>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          Study Groups
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl">
          Join study groups to collaborate with peers, share knowledge, and
          learn together. Find groups by subject or create your own study
          community.
        </p>

        <div className="flex flex-col items-center gap-4">
          <GroupsSearchBar defaultValue={searchQuery} />
          <CreateGroupDialog />
        </div>
      </div>

      {/* Groups Content */}
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
        <GroupsContent
          searchQuery={searchQuery}
          currentUserId={userId}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}
