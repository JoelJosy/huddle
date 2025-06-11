"use client";

import { ArrowLeft, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  QuizControls,
  QuizScore,
  QuizLoadingState,
  QuizEmptyState,
  QuizErrorState,
  QuizList,
} from "@/components/smart/quiz";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface UserAnswer {
  questionIndex: number;
  selectedAnswer: string;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.noteId as string;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = async () => {
    try {
      setError(null);
      const response = await fetch(`/smart/quiz/api/${noteId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Note not found");
        }
        throw new Error("Failed to fetch quiz");
      }

      const data = await response.json();
      setQuestions(data.summary || []);
      setUserAnswers([]);
      setShowResults(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to load quiz");
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  const handleRegenerateQuiz = async () => {
    setIsRegenerating(true);
    toast.info("Regenerating quiz...");
    await fetchQuiz();
    toast.success("Quiz regenerated!");
  };

  const handleAnswerSelect = (
    questionIndex: number,
    selectedAnswer: string,
  ) => {
    if (showResults) return; // Prevent changing answers after checking

    const newAnswers = [...userAnswers];
    const existingAnswerIndex = newAnswers.findIndex(
      (answer) => answer.questionIndex === questionIndex,
    );

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { questionIndex, selectedAnswer };
    } else {
      newAnswers.push({ questionIndex, selectedAnswer });
    }

    setUserAnswers(newAnswers);
  };

  const getScore = () => {
    const correctCount = userAnswers.filter(
      (answer) =>
        answer.selectedAnswer ===
        questions[answer.questionIndex]?.correctAnswer,
    ).length;
    return { correct: correctCount, total: questions.length };
  };

  const handleCheckAnswers = () => {
    if (userAnswers.length !== questions.length) {
      toast.error("Please answer all questions before checking results!");
      return;
    }

    setShowResults(true);
    const correctCount = getScore().correct;

    toast.success(
      `You got ${correctCount} out of ${questions.length} questions correct!`,
    );
  };

  const handleResetQuiz = () => {
    setUserAnswers([]);
    setShowResults(false);
    toast.info("Quiz reset! You can try again.");
  };

  useEffect(() => {
    if (noteId) {
      fetchQuiz();
    }
  }, [noteId]);

  if (error) {
    return (
      <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <QuizErrorState error={error} onRetry={fetchQuiz} />
        </div>
      </div>
    );
  }

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <div className="container mx-auto max-w-4xl px-4 py-8">
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
            <Brain className="text-primary h-5 w-5 animate-pulse" />
            <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
              AI Generated Quiz
            </h1>
          </div>
        </div>

        <QuizControls
          showResults={showResults}
          isLoading={isLoading}
          isRegenerating={isRegenerating}
          userAnswersCount={userAnswers.length}
          totalQuestions={questions.length}
          onCheckAnswers={handleCheckAnswers}
          onResetQuiz={handleResetQuiz}
          onRegenerateQuiz={handleRegenerateQuiz}
        />

        {showResults && questions.length > 0 && (
          <QuizScore score={getScore()} />
        )}

        {isLoading ? (
          <QuizLoadingState />
        ) : questions.length === 0 ? (
          <QuizEmptyState onRegenerate={handleRegenerateQuiz} />
        ) : (
          <QuizList
            questions={questions}
            userAnswers={userAnswers}
            showResults={showResults}
            onAnswerSelect={handleAnswerSelect}
          />
        )}

        {!isLoading && questions.length > 0 && (
          <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-4 mt-8 delay-150 duration-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Sparkles className="text-primary mt-0.5 h-5 w-5 flex-shrink-0 animate-pulse" />
                <div className="text-muted-foreground text-sm">
                  <p className="text-foreground mb-1 font-medium">
                    AI-Generated Quiz
                  </p>
                  <p>
                    This quiz was generated using AI to test your understanding
                    of the key concepts from your note.
                    {!showResults
                      ? " Select your answers and click 'Check Answers' to see how you did!"
                      : " You can regenerate the quiz to get new questions or try again with the same questions."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
