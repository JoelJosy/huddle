import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="py-16 text-center">
      <FileText className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
      <h3 className="mb-2 text-lg font-semibold">No public notes found</h3>
      <p className="text-muted-foreground mb-6">
        Be the first to share your knowledge with the community!
      </p>
      <Button asChild>
        <Link href="/dashboard/notes/create">Create First Note</Link>
      </Button>
    </div>
  );
}
