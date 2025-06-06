import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import GroupChatRoom from "@/components/chat/GroupChatRoom";

interface GroupPageProps {
  params: {
    groupId: string;
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { groupId } = await params;

  if (!groupId) {
    notFound();
  }

  return (
    <div className="container mx-auto h-[calc(100vh-80px)] px-4 py-6">
      <Suspense
        fallback={
          <div className="flex h-full w-full flex-col space-y-4">
            <Skeleton className="h-16 w-full" />
            <div className="flex h-full flex-1 gap-4">
              <Skeleton className="h-full w-1/4" />
              <Skeleton className="h-full w-3/4" />
            </div>
          </div>
        }
      >
        <GroupChatRoom />
      </Suspense>
    </div>
  );
}
