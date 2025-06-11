"use client";

import { Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function QuizErrorState({ error, onRetry }: QuizErrorStateProps) {
  return (
    <Card className="border-destructive/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardContent className="pt-6">
        <div className="py-8 text-center">
          <Brain className="text-muted-foreground mx-auto mb-4 h-12 w-12 animate-pulse" />
          <h3 className="mb-2 text-lg font-semibold">Unable to Load Quiz</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            onClick={onRetry}
            variant="outline"
            className="transition-transform hover:scale-105"
          >
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
