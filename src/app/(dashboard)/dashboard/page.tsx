import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Zap,
  Plus,
  Search,
  Eye,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import getCurrentUserId from "@/lib/accountActions";

async function DashboardStats() {
  const supabase = await createClient();
  const userId = await getCurrentUserId();

  if (!userId) return null;

  // Fetch user's stats
  const [notesResult, groupsResult] = await Promise.all([
    supabase
      .from("notes")
      .select("id")
      .eq("user_id", userId)
      .eq("visibility", "public"),
    supabase.from("group_members").select("group_id").eq("user_id", userId),
  ]);

  const notesCount = notesResult.data?.length || 0;
  const groupsCount = groupsResult.data?.length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Notes</CardTitle>
          <BookOpen className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{notesCount}</div>
          <p className="text-muted-foreground text-xs">Published notes</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Groups</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{groupsCount}</div>
          <p className="text-muted-foreground text-xs">Groups joined</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName =
    user?.user_metadata?.name || user?.user_metadata?.full_name || "there";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {userName}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to learn something new today? Choose what you'd like to
            explore.
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Main Action Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Notes Section */}
          <Card className="group relative flex min-h-[320px] flex-col overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 dark:from-blue-950/20 dark:to-indigo-950/20" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Notes</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    Knowledge Base
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative flex flex-1 flex-col justify-between p-6 pt-0">
              <CardDescription className="mb-6 text-base">
                Create, share, and discover study notes from the community.
                Build your personal knowledge library.
              </CardDescription>
              <div className="flex flex-col gap-3">
                <Button asChild className="h-11 w-full">
                  <Link href="/notes/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Note
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild className="h-9">
                    <Link href="/notes">
                      <Search className="mr-2 h-4 w-4" />
                      Browse
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="h-9">
                    <Link href="/notes/my-notes">
                      <Eye className="mr-2 h-4 w-4" />
                      My Notes
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Groups Section */}
          <Card className="group relative flex min-h-[320px] flex-col overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50 dark:from-green-950/20 dark:to-emerald-950/20" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Study Groups</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    Collaborate
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative flex flex-1 flex-col justify-between p-6 pt-0">
              <CardDescription className="mb-6 text-base">
                Join study groups to collaborate with peers, share insights, and
                learn together in real-time.
              </CardDescription>
              <div className="flex flex-col gap-3">
                <Button asChild className="h-11 w-full">
                  <Link href="/groups">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Groups
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-9 w-full"
                >
                  <Link href="/groups">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Group
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Smart Features Section */}
          <Card className="group relative flex min-h-[400px] flex-col overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-50 dark:from-purple-950/20 dark:to-violet-950/20" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Smart Features</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    AI-Powered
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative flex flex-1 flex-col justify-between p-6 pt-0">
              <div className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  Transform your notes with AI superpowers! Generate intelligent
                  summaries, create interactive quizzes, and visualize concepts
                  with beautiful mindmaps.
                </CardDescription>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className="h-11 w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Link href="/smart">
                    <Zap className="mr-2 h-4 w-4" />
                    Explore Smart Features
                  </Link>
                </Button>
                <p className="text-muted-foreground text-center text-xs">
                  Select any public note and unlock AI magic ✨
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
          <CardContent className="p-8">
            <div className="space-y-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    ?
                  </span>
                </div>
                <h2 className="text-2xl font-bold">
                  Need Help Getting Started?
                </h2>
              </div>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Check out our comprehensive FAQ section for answers to common
                questions about notes, study groups, and AI features. We've got
                you covered!
              </p>
              <Button asChild variant="outline" size="lg" className="mt-6">
                <Link href="/faq">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Visit FAQ
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
