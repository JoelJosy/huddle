"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
  questionIndex: number;
  userAnswer?: string;
  showResults: boolean;
  onAnswerSelect: (questionIndex: number, selectedAnswer: string) => void;
}

export function QuizQuestion({
  question,
  questionIndex,
  userAnswer,
  showResults,
  onAnswerSelect,
}: QuizQuestionProps) {
  const isCorrect = showResults && userAnswer === question.correctAnswer;
  const isIncorrect = showResults && userAnswer !== question.correctAnswer;

  return (
    <Card
      className={cn(
        "bg-card/60 animate-in fade-in border-0 shadow-lg backdrop-blur-sm duration-700",
        showResults &&
          isCorrect &&
          "border-green-500/50 bg-green-50/50 dark:bg-green-950/20",
        showResults &&
          isIncorrect &&
          "border-red-500/50 bg-red-50/50 dark:bg-red-950/20",
      )}
      style={{ animationDelay: `${questionIndex * 100}ms` }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <Badge variant="outline" className="mt-1 flex-shrink-0">
            {questionIndex + 1}
          </Badge>
          <CardTitle className="text-lg leading-relaxed">
            {question.question}
          </CardTitle>
          {showResults && (
            <div className="flex-shrink-0">
              {isCorrect ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {question.options.map((option, optionIndex) => {
            const isSelected = userAnswer === option;
            const isCorrectOption = option === question.correctAnswer;

            let buttonVariant: "default" | "outline" | "secondary" = "outline";
            let buttonClassName =
              "h-auto min-h-[2.5rem] justify-start p-4 text-left transition-all hover:scale-[1.02]";

            if (showResults) {
              if (isCorrectOption) {
                buttonVariant = "default";
                buttonClassName +=
                  " bg-green-600 border-green-600 text-white hover:bg-green-700";
              } else if (isSelected && !isCorrectOption) {
                buttonVariant = "outline";
                buttonClassName +=
                  " border-red-500 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300";
              } else {
                buttonClassName += " opacity-60";
              }
            } else if (isSelected) {
              buttonVariant = "default";
              buttonClassName += " ring-2 ring-primary ring-offset-2";
            }

            return (
              <Button
                key={optionIndex}
                variant={buttonVariant}
                className={buttonClassName}
                onClick={() => onAnswerSelect(questionIndex, option)}
                disabled={showResults}
              >
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-current">
                    <div
                      className={cn(
                        "h-3 w-3 rounded-full transition-all",
                        isSelected ? "bg-current" : "bg-transparent",
                      )}
                    />
                  </div>
                  <span className="flex-1 text-sm">{option}</span>
                  {showResults && isCorrectOption && (
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  {showResults && isSelected && !isCorrectOption && (
                    <XCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
