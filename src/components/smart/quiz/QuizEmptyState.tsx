"use client";

import { Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizEmptyStateProps {
  onRegenerate: () => void;
}

export function QuizEmptyState({ onRegenerate }: QuizEmptyStateProps) {
  return (
    <Card className="bg-card/60 animate-in fade-in border-0 shadow-lg backdrop-blur-sm duration-700">
      <CardContent className="pt-6">
        <div className="py-8 text-center">
          <Brain className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">
            No Quiz Questions Generated
          </h3>
          <p className="text-muted-foreground mb-4">
            The AI couldn't generate quiz questions from this note. Try
            regenerating or check if the note has enough content.
          </p>
          <Button
            onClick={onRegenerate}
            variant="outline"
            className="transition-transform hover:scale-105"
          >
            Try Regenerating
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
