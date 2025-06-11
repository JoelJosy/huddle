"use client";

import { CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizControlsProps {
  showResults: boolean;
  isLoading: boolean;
  isRegenerating: boolean;
  userAnswersCount: number;
  totalQuestions: number;
  onCheckAnswers: () => void;
  onResetQuiz: () => void;
  onRegenerateQuiz: () => void;
}

export function QuizControls({
  showResults,
  isLoading,
  isRegenerating,
  userAnswersCount,
  totalQuestions,
  onCheckAnswers,
  onResetQuiz,
  onRegenerateQuiz,
}: QuizControlsProps) {
  return (
    <div className="animate-in fade-in slide-in-from-top-4 mb-6 flex flex-wrap gap-3 duration-500">
      <Button
        onClick={onRegenerateQuiz}
        disabled={isLoading || isRegenerating}
        variant="outline"
        className="gap-2 transition-all hover:scale-105"
      >
        <RotateCcw
          className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`}
        />
        {isRegenerating ? "Regenerating..." : "Generate New Quiz"}
      </Button>

      {!showResults &&
        userAnswersCount === totalQuestions &&
        totalQuestions > 0 && (
          <Button
            onClick={onCheckAnswers}
            className="gap-2 transition-all hover:scale-105"
          >
            <CheckCircle className="h-4 w-4" />
            Check Answers
          </Button>
        )}

      {showResults && (
        <Button
          onClick={onResetQuiz}
          variant="secondary"
          className="gap-2 transition-all hover:scale-105"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
