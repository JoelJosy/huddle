"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, GitBranch, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import MindmapFlow from "@/components/smart/MindmapFlow";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.noteId as string;

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="animate-in fade-in slide-in-from-top-2 mb-8 flex items-center gap-4 duration-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 transition-transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <GitBranch className="text-primary h-5 w-5 animate-pulse" />
            <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
              Mind Map
            </h1>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <MindmapFlow noteId={noteId} />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 mt-6 delay-150 duration-700">
          <div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="text-primary mt-0.5 h-5 w-5 flex-shrink-0 animate-pulse" />
              <div className="text-muted-foreground text-sm">
                <p className="text-foreground mb-1 font-medium">
                  AI-Generated Mind Map
                </p>
                <p>
                  This mind map was generated using AI to visualize the key
                  concepts and relationships from your note. You can zoom, pan,
                  and explore the connections between different topics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
