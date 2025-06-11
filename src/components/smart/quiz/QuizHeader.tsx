"use client";

import { ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizHeaderProps {
  onGoBack: () => void;
}

export function QuizHeader({ onGoBack }: QuizHeaderProps) {
  return (
    <div className="animate-in fade-in slide-in-from-top-2 mb-8 flex items-center gap-4 duration-300">
      <Button
        variant="ghost"
        size="sm"
        onClick={onGoBack}
        className="gap-2 transition-transform hover:scale-105"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <div className="flex items-center gap-2">
        <Brain className="text-primary h-5 w-5 animate-pulse" />
        <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
          AI Generated Quiz
        </h1>
      </div>
    </div>
  );
}
