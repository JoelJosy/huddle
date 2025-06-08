"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GroupMembersListClientProps {
  members: any[];
  ownerId: string;
}

export default function GroupMembersList({
  members,
  ownerId,
}: GroupMembersListClientProps) {
  // Function to format the last active time
  const formatLastActive = (lastActive: string | null) => {
    if (!lastActive) return "Never active";

    try {
      return formatDistanceToNow(new Date(lastActive), { addSuffix: true });
    } catch (error) {
      return "Unknown";
    }
  };

  // Function to determine status indicator color
  const getStatusColor = (lastActive: string | null) => {
    if (!lastActive) return "bg-gray-400"; // Never active

    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffMinutes =
      (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);

    if (diffMinutes < 5) return "bg-green-500"; // Online/active now
    if (diffMinutes < 60) return "bg-yellow-500"; // Recently active
    return "bg-gray-400"; // Away/offline
  };

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
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={member.profile?.avatar_url || "/placeholder.svg"}
                    alt={
                      member.profile?.full_name ||
                      member.profile?.username ||
                      "User"
                    }
                  />
                  <AvatarFallback>
                    {member.profile?.full_name?.[0] ||
                      member.profile?.username?.[0] ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(member.last_active)}`}
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="font-medium">
                    {member.profile?.full_name ||
                      member.profile?.username ||
                      "Unknown User"}
                  </p>
                  <div className="text-muted-foreground flex items-center text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="max-w-[120px] truncate">
                            {member.last_active
                              ? formatLastActive(member.last_active)
                              : "Never active"}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {member.last_active
                              ? `Last active: ${new Date(member.last_active).toLocaleString()}`
                              : "Never active in this group"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
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
