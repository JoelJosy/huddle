import { Suspense } from "react";
import { fetchGroupDetails, fetchGroupMembers } from "@/lib/groupActions";
import { notFound } from "next/navigation";
import GroupHeader from "@/components/chat/GroupHeader";
import GroupChatArea from "@/components/chat/GroupChatArea";
import { Skeleton } from "@/components/ui/skeleton";
import getCurrentUserId from "@/lib/accountActions";
import GroupMembersList from "./GroupMembersList";

interface GroupChatRoomProps {
  groupId: string;
}

export default async function GroupChatRoom({ groupId }: GroupChatRoomProps) {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">
          Please log in to view this group
        </p>
      </div>
    );
  }

  const groupDetails = await fetchGroupDetails(groupId);

  if (!groupDetails) {
    notFound();
  }

  const members = await fetchGroupMembers(groupId);
  const isOwner = groupDetails.owner_id === currentUserId;
  const isMember = members.some((member) => member.user_id === currentUserId);

  return (
    <div className="flex h-full flex-col">
      <GroupHeader
        group={groupDetails}
        isOwner={isOwner}
        isMember={isMember}
        members={members}
      />

      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="hidden w-64 flex-shrink-0 md:block">
          <GroupMembersList
            members={members}
            ownerId={groupDetails.owner_id || ""}
          />
        </div>

        <div className="flex-1 overflow-hidden rounded-lg border">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <GroupChatArea
              groupId={groupId}
              currentUserId={currentUserId}
              isMember={isMember}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
