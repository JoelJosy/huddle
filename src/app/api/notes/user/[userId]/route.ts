import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface Note {
  id: string;
  title: string;
  excerpt: string;
  content_url: string;
  tags: string[];
  created_at: string;
  word_count?: number;
  user_id: string;
  subjects: {
    name: string;
  } | null;
  profiles: {
    full_name: string;
    email: string;
    username?: string;
    avatar_url?: string;
  } | null;
}

interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "4", 10);

    // Validate parameters
    if (!userId || userId === "undefined" || userId.trim() === "") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (page < 1 || pageSize < 1 || pageSize > 50) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get the current user for authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Check if the authenticated user is requesting their own notes
    // or if the notes are public (for other users)
    const isOwnNotes = user.id === userId;

    const offset = (page - 1) * pageSize;

    const { data: notes, error } = await supabase.rpc("search_user_term", {
      p_user_id: userId,
      search_term: searchQuery,
      page_limit: pageSize,
      page_offset: offset,
    });

    if (error) {
      console.error("Error fetching user notes:", error);
      return NextResponse.json(
        { error: "Failed to fetch notes" },
        { status: 500 },
      );
    }

    const totalCount =
      notes && notes.length > 0 ? Number(notes[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    if (!notes || notes.length === 0) {
      const emptyResult: PaginatedResult<Note> = {
        data: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      return NextResponse.json(emptyResult);
    }

    const { data: profile, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, username, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    if (profilesError && (profilesError as any).status !== 406) {
      console.error("Error fetching profile:", profilesError);
    }

    const transformedNotes: Note[] = notes.map((note: any) => ({
      id: note.id,
      title: note.title,
      excerpt: note.excerpt,
      content_url: note.content_url,
      tags: note.tags,
      created_at: note.created_at,
      word_count: note.word_count,
      user_id: note.user_id,
      subjects: note.subject_name ? { name: note.subject_name } : null,
      profiles: profile || null,
    }));

    const result: PaginatedResult<Note> = {
      data: transformedNotes,
      totalCount,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    // Set different cache headers based on whether it's own notes or public notes
    const cacheControl = isOwnNotes
      ? "private, max-age=60" // Shorter cache for user's own notes
      : "public, s-maxage=300, stale-while-revalidate=600"; // Longer cache for public notes

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": cacheControl,
      },
    });
  } catch (error) {
    console.error("Unexpected error in user notes API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
