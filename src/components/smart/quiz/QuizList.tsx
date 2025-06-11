"use client";

import { QuizQuestion } from "./QuizQuestion";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface UserAnswer {
  questionIndex: number;
  selectedAnswer: string;
}

interface QuizListProps {
  questions: QuizQuestion[];
  userAnswers: UserAnswer[];
  showResults: boolean;
  onAnswerSelect: (questionIndex: number, selectedAnswer: string) => void;
}

export function QuizList({
  questions,
  userAnswers,
  showResults,
  onAnswerSelect,
}: QuizListProps) {
  return (
    <div className="space-y-6">
      {questions.map((question, questionIndex) => {
        const userAnswer = userAnswers.find(
          (answer) => answer.questionIndex === questionIndex,
        );

        return (
          <QuizQuestion
            key={questionIndex}
            question={question}
            questionIndex={questionIndex}
            userAnswer={userAnswer?.selectedAnswer}
            showResults={showResults}
            onAnswerSelect={onAnswerSelect}
          />
        );
      })}
    </div>
  );
}
