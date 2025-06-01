import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { GroupsSearchBar } from "@/components/groups/GroupsSearchBar";
import { fetchPublicGroups } from "@/lib/groups";
import Link from "next/link";
import { GroupsGrid } from "@/components/groups/GroupsGrid";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import getCurrentUserId from "@/lib/accountActions";

interface GroupsPageProps {
  searchParams: {
    search?: string;
  };
}

interface GroupsContentProps {
  searchQuery?: string;
  currentUserId: string | undefined;
}

async function GroupsContent({
  searchQuery,
  currentUserId,
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

  const groups = await fetchPublicGroups(searchQuery);

  return (
    <>
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">
          {searchQuery
            ? `Found ${groups.length} groups for "${searchQuery}"`
            : `${groups.length} public study groups available`}
        </p>
      </div>
      <GroupsGrid groups={groups} currentUserId={currentUserId} />
    </>
  );
}

export default async function GroupsPage({ searchParams }: GroupsPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search;
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
        <GroupsContent searchQuery={searchQuery} currentUserId={userId} />
      </Suspense>
    </div>
  );
}
