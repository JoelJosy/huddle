"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  QuizHeader,
  QuizControls,
  QuizScore,
  QuizLoadingState,
  QuizEmptyState,
  QuizErrorState,
  QuizList,
  QuizFooter,
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
          <QuizHeader onGoBack={() => router.back()} />
          <QuizErrorState error={error} onRetry={fetchQuiz} />
        </div>
      </div>
    );
  }

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <QuizHeader onGoBack={() => router.back()} />

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
          <QuizFooter showResults={showResults} />
        )}
      </div>
    </div>
  );
}
