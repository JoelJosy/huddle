"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Copy, RefreshCw, FileText, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function SummarizePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.noteId as string;

  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setError(null);
      const response = await fetch(`/smart/summarize/api/${noteId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Note not found");
        }
        throw new Error("Failed to fetch summary");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to load summary");
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    toast.info("Regenerating summary...");
    await fetchSummary();
    toast.success("Summary regenerated!");
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Summary copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };
  const extractMarkdown = (text: string) => {
    const match = text.match(/```(?:markdown)?\n([\s\S]*?)```/);
    return match ? match[1].trim() : text;
  };
  useEffect(() => {
    if (noteId) {
      fetchSummary();
    }
  }, [noteId]);

  if (error) {
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
              <Sparkles className="text-primary h-5 w-5" />
              <h1 className="text-2xl font-bold">Note Summary</h1>
            </div>
          </div>

          <Card className="border-destructive/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardContent className="pt-6">
              <div className="py-8 text-center">
                <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12 animate-pulse" />
                <h3 className="mb-2 text-lg font-semibold">
                  Unable to Load Summary
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button
                  onClick={() => fetchSummary()}
                  variant="outline"
                  className="transition-transform hover:scale-105"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
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
            <Sparkles className="text-primary h-5 w-5 animate-pulse" />
            <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
              Note Summary
            </h1>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-top-4 mb-6 flex flex-wrap gap-3 duration-500">
          <Button
            onClick={handleRegenerate}
            disabled={isLoading || isRegenerating}
            variant="outline"
            className="gap-2 transition-all hover:scale-105"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`}
            />
            {isRegenerating ? "Regenerating..." : "Regenerate Summary"}
          </Button>

          <Button
            onClick={handleCopyToClipboard}
            disabled={isLoading || !summary}
            variant="secondary"
            className="gap-2 transition-all hover:scale-105"
          >
            <Copy className="h-4 w-4" />
            Copy to Clipboard
          </Button>
        </div>

        <Card className="bg-card/60 animate-in fade-in border-0 shadow-lg backdrop-blur-sm duration-700">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="text-primary h-5 w-5" />
              AI Generated Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-in fade-in space-y-4 duration-500">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <LoadingSpinner text="Generating AI summary..." />
              </div>
            ) : (
              <div className="prose prose-neutral dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground animate-in fade-in slide-in-from-bottom-4 max-w-none duration-700">
                <ReactMarkdown>{extractMarkdown(summary)}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>

        {!isLoading && summary && (
          <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-4 mt-6 delay-150 duration-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Sparkles className="text-primary mt-0.5 h-5 w-5 flex-shrink-0 animate-pulse" />
                <div className="text-muted-foreground text-sm">
                  <p className="text-foreground mb-1 font-medium">
                    AI-Generated Summary
                  </p>
                  <p>
                    This summary was generated using AI to extract the key
                    concepts and ideas from your note. You can regenerate it at
                    any time to get a fresh perspective or copy it for use
                    elsewhere.
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
