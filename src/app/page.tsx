import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Zap, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="relative">
          <div className="container mx-auto px-4 py-24 sm:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-6 text-sm">
                ✨ AI-Powered Learning Platform
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                Learn Smarter,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Study Together
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-300">
                Create and share study notes, collaborate in study groups, and
                generate AI-powered flashcards. Everything you need to excel in
                your learning journey.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                {user ? (
                  <Button size="lg" asChild className="text-lg">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild className="text-lg">
                      <Link href="/signup">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="text-lg"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mb-16 text-lg text-gray-600 dark:text-gray-300">
              Powerful tools designed to enhance your learning experience and
              help you achieve your academic goals.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Notes Feature */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all hover:shadow-xl dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Smart Notes</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Create rich, formatted notes with our intuitive editor. Share
                  your knowledge with the community and discover insights from
                  others.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Rich text editor with formatting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Tag and categorize your notes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Share with the community
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Study Groups Feature */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50 transition-all hover:shadow-xl dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Study Groups</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Join or create study groups to collaborate with peers.
                  Real-time chat, shared resources, and group discussions.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Real-time group chat
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Create public or private groups
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Collaborative learning
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Flashcards Feature */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-violet-50 transition-all hover:shadow-xl dark:from-purple-950/20 dark:to-violet-950/20">
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">AI Flashcards</h3>
                <Badge variant="secondary" className="mb-3">
                  Coming Soon
                </Badge>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Generate intelligent flashcards from your notes using AI.
                  Perfect for quick reviews and effective memorization.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    AI-powered card generation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Spaced repetition system
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Progress tracking
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <div className="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                10K+
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Notes Shared
              </div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-green-600 dark:text-green-400">
                500+
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Study Groups
              </div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
                5K+
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Active Learners
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your learning?
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Join thousands of students who are already using Huddle to excel
              in their studies.
            </p>
            {!user && (
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild className="text-lg">
                  <Link href="/signup">
                    Start Learning Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg">
                  <Link href="/notes">Explore Public Notes</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
