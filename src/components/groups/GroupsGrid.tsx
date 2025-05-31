import { StudyGroup } from "@/lib/groups";
import { GroupCard } from "./GroupCard";

interface GroupsGridProps {
  groups: StudyGroup[];
  currentUserId: string;
}

export function GroupsGrid({ groups, currentUserId }: GroupsGridProps) {
  if (groups.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="mb-2 text-lg font-semibold">No study groups found</h3>
        <p className="text-muted-foreground mb-4">
          Be the first to create a study group and start collaborating!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
