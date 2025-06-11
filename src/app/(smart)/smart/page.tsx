import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import { SmartFeaturesContent } from "@/components/smart/SmartFeaturesContent";
import getCurrentUserId from "@/lib/accountActions";

interface SmartPageProps {
  searchParams: {
    search?: string;
  };
}

export default async function SmartPage({ searchParams }: SmartPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search;
  const userId = await getCurrentUserId();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-6">
          AI-Powered Features
        </Badge>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          Smart Features
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl">
          Select a note from the public collection and unlock powerful AI
          features: generate summaries, create interactive quizzes, or visualize
          content with mindmaps.
        </p>
      </div>

      {/* Main Content */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left side - Notes loading (2/3 width) */}
            <div className="space-y-4 lg:col-span-2">
              <div className="bg-muted h-12 animate-pulse rounded-lg" />
              <div className="grid gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-muted h-32 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            </div>
            {/* Right side - Features loading (1/3 width) */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-muted h-8 w-1/2 animate-pulse rounded-lg" />
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-muted h-40 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <SmartFeaturesContent
          searchQuery={searchQuery}
          currentUserId={userId}
        />
      </Suspense>
    </div>
  );
}
