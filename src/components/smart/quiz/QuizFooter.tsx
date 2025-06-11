"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuizFooterProps {
  showResults: boolean;
}

export function QuizFooter({ showResults }: QuizFooterProps) {
  return (
    <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-4 mt-8 delay-150 duration-700">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Sparkles className="text-primary mt-0.5 h-5 w-5 flex-shrink-0 animate-pulse" />
          <div className="text-muted-foreground text-sm">
            <p className="text-foreground mb-1 font-medium">
              AI-Generated Quiz
            </p>
            <p>
              This quiz was generated using AI to test your understanding of the
              key concepts from your note.
              {!showResults
                ? " Select your answers and click 'Check Answers' to see how you did!"
                : " You can regenerate the quiz to get new questions or try again with the same questions."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
