"use client";

import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  BookOpen,
  FileText,
  Sparkles,
  ArrowRight,
  Lock,
} from "lucide-react";
import Link from "next/link";
import type { Note } from "@/lib/notes";
import { cn } from "@/lib/utils";

interface SmartFeatureCardsProps {
  selectedNote: Note | null;
}

export const SmartFeatureCards = memo(function SmartFeatureCards({
  selectedNote,
}: SmartFeatureCardsProps) {
  const features = [
    {
      id: "summarize",
      title: "Summarize Note",
      description:
        "Generate an intelligent summary highlighting key points and main concepts from the note.",
      icon: FileText,
      route: selectedNote ? `/smart/summarize/${selectedNote.id}` : null,
    },
    {
      id: "quiz",
      title: "Generate Quiz",
      description:
        "Create interactive quiz questions based on the note content to test understanding.",
      icon: BookOpen,
      route: selectedNote ? `/smart/quiz/${selectedNote.id}` : null,
    },
    {
      id: "mindmap",
      title: "Draw Mindmap",
      description:
        "Visualize the note content as an interactive mindmap showing relationships between concepts.",
      icon: Brain,
      route: selectedNote ? `/smart/mindmap/${selectedNote.id}` : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isDisabled = !selectedNote;

          return (
            <Card
              key={feature.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-300",
                isDisabled
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:scale-[1.02] hover:shadow-lg",
              )}
            >
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <Icon className="text-primary mr-2 h-8 w-8" />
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {feature.title}
                      {isDisabled && (
                        <Lock className="text-muted-foreground h-4 w-4" />
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative">
                {selectedNote ? (
                  <Button asChild className="group w-full">
                    <Link href={feature.route!}>
                      {feature.title}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    {selectedNote ? "Select a Note" : "Select a Note First"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Note Info */}
      {selectedNote && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                <FileText className="text-primary h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-primary text-sm font-medium">
                  Selected Note
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {selectedNote.title}
                </p>
              </div>
              {selectedNote.word_count && (
                <Badge variant="secondary" className="text-xs">
                  {selectedNote.word_count} words
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});
