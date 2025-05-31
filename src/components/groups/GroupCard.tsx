import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudyGroup } from "@/lib/groups";
import { Users, Calendar, User } from "lucide-react";
import Link from "next/link";

interface GroupCardProps {
  group: StudyGroup;
  currentUserId: string;
}

export function GroupCard({ group, currentUserId }: GroupCardProps) {
  const isOwner = group.owner_id === currentUserId;

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2 text-lg">{group.name}</CardTitle>
          {group.subject_name && (
            <Badge variant="outline" className="ml-2 shrink-0">
              {group.subject_name}
            </Badge>
          )}
        </div>
        {group.description && (
          <CardDescription className="line-clamp-3">
            {group.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <div className="text-muted-foreground space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Created by {group.owner_name || "Unknown"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {group.member_count} member{group.member_count !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(group.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          <Button asChild className="flex-1" variant="default">
            <Link href={`/groups/${group.id}`}>
              {isOwner ? "Manage" : "Join Group"}
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
