"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuizScoreProps {
  score: {
    correct: number;
    total: number;
  };
}

export function QuizScore({ score }: QuizScoreProps) {
  const percentage = Math.round((score.correct / score.total) * 100);

  const getScoreMessage = () => {
    if (score.correct === score.total) return "Perfect Score! 🎉";
    if (score.correct >= score.total * 0.8) return "Great Job! 👏";
    if (score.correct >= score.total * 0.6) return "Good Effort! 👍";
    return "Keep Learning! 📚";
  };

  return (
    <Card className="bg-primary/10 border-primary/20 animate-in fade-in slide-in-from-top-4 mb-6 duration-500">
      <CardContent className="pt-6">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-primary text-3xl font-bold">
              {score.correct}/{score.total}
            </div>
            <div className="text-muted-foreground text-sm">
              Score: {percentage}%
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            <span className="text-lg font-semibold">{getScoreMessage()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
