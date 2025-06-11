"use client";

import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";

export function QuizLoadingState() {
  return (
    <Card className="bg-card/60 animate-in fade-in border-0 shadow-lg backdrop-blur-sm duration-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="text-primary h-5 w-5" />
          Generating Quiz Questions...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-in fade-in space-y-6 duration-500">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
          <LoadingSpinner text="Creating questions from your notes..." />
        </div>
      </CardContent>
    </Card>
  );
}
