import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export interface Note {
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

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "4", 10);

    // Validate parameters
    if (page < 1 || pageSize < 1 || pageSize > 50) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const offset = (page - 1) * pageSize;

    // Use the optimized RPC function that includes profile data
    const { data, error } = await supabase.rpc("search_notes", {
      search_term: searchQuery,
      page_limit: pageSize,
      page_offset: offset,
    });

    if (error) {
      console.error("Error fetching notes with pagination:", error);
      return NextResponse.json(
        { error: "Failed to fetch notes" },
        { status: 500 },
      );
    }

    const notes = data || [];
    const totalCount = notes.length > 0 ? Number(notes[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    if (notes.length === 0) {
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
      profiles: {
        full_name: note.full_name,
        email: note.email,
        username: note.username,
        avatar_url: note.avatar_url,
      },
    }));

    const result: PaginatedResult<Note> = {
      data: transformedNotes,
      totalCount,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Unexpected error in public notes API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
