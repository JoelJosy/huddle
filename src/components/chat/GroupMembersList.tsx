"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown } from "lucide-react";

interface GroupMembersListClientProps {
  members: any[];
  ownerId: string;
}

export default function GroupMembersList({
  members,
  ownerId,
}: GroupMembersListClientProps) {
  return (
    <div className="bg-card h-full rounded-lg border p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Members ({members.length})</h2>
      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="space-y-2 pr-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="hover:bg-accent flex items-center gap-3 rounded-md p-2"
            >
              <Avatar>
                <AvatarFallback>
                  {member.profile?.full_name?.[0] ||
                    member.profile?.username?.[0] ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="font-medium">
                    {member.profile?.full_name ||
                      member.profile?.username ||
                      "Unknown User"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {member.role === "owner" ? "Owner" : "Member"}
                  </p>
                </div>
                {member.user_id === ownerId && (
                  <Crown className="h-4 w-4 text-amber-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
