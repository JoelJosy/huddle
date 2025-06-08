"use client";

import { useState } from "react";
import { Users, Info, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { StudyGroup } from "@/lib/groups";
import {
  leaveStudyGroup,
  deleteStudyGroup,
  joinStudyGroup,
} from "@/lib/groupActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import GroupMembersList from "./GroupMembersList";

interface GroupHeaderProps {
  group: StudyGroup;
  isOwner: boolean;
  isMember: boolean;
  members: any[];
}

export default function GroupHeader({
  group,
  isOwner,
  isMember,
  members,
}: GroupHeaderProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinGroup = async () => {
    try {
      setIsLoading(true);
      await joinStudyGroup(group.id);
      toast.success("Successfully joined the group!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to join the group");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setIsLoading(true);
      await leaveStudyGroup(group.id);
      toast.success("Successfully left the group");
      router.push("/groups");
    } catch (error) {
      toast.error("Failed to leave the group");
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowLeaveDialog(false);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      setIsLoading(true);
      await deleteStudyGroup(group.id);
      toast.success("Group deleted successfully");
      router.push("/groups");
    } catch (error) {
      toast.error("Failed to delete group");
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="bg-card mb-4 flex items-center justify-between rounded-lg border p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Users className="text-primary h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground text-sm">{group.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* New Members */}
        {!isMember && (
          <Button onClick={handleJoinGroup} disabled={isLoading}>
            Join Group
          </Button>
        )}

        {/* Sheet for Mobile devices */}
        <Sheet>
          <SheetTrigger className="md:hidden" asChild>
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
              <span className="sr-only">Group Info</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="px-5 py-8">
            <SheetHeader>
              <SheetTitle>About this group</SheetTitle>
              <SheetDescription>
                {group.description || "No description provided."}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 py-6">
              <div className="md:hidden">
                <GroupMembersList
                  members={members}
                  ownerId={group.owner_id || ""}
                />
              </div>
            </div>
            <SheetFooter>
              {isOwner ? (
                <Button
                  variant={"destructive"}
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete group
                </Button>
              ) : (
                <Button onClick={() => setShowLeaveDialog(true)}>
                  Leave group
                </Button>
              )}
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Dropdown for Large devices */}
        {isMember && (
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner ? (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete Group
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setShowLeaveDialog(true)}>
                    Leave Group
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Delete Group Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this group? This action cannot be
              undone and all messages and member associations will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Group"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Group Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this group? You can always join
              again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveGroup} disabled={isLoading}>
              {isLoading ? "Leaving..." : "Leave Group"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
