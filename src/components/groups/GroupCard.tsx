"use client";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StudyGroup } from "@/lib/groups";
import { Users, Calendar, User, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, memo } from "react";
import { toast } from "sonner";
import { deleteStudyGroup } from "@/lib/groupActions";

interface GroupCardProps {
  group: StudyGroup;
  currentUserId: string;
}

export const GroupCard = memo(function GroupCard({
  group,
  currentUserId,
}: GroupCardProps) {
  const isOwner = group.owner_id === currentUserId;
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteStudyGroup(group.id);
        toast.success("Group deleted successfully!");
        setShowDeleteDialog(false);
      } catch (error) {
        console.error("Error deleting group:", error);
        toast.error("Failed to delete group. Please try again.");
      }
    });
  };

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2 text-lg">{group.name}</CardTitle>
          {isOwner && (
            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Study Group</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{group.name}"? This action
                    cannot be undone. All group data and member associations
                    will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete Group
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
            <Link href={`/groups/${group.id}`}>Enter Group</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});
