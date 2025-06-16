import { createClient } from "@/utils/supabase/client";

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

export async function fetchPublicNotesEdgeClient(
  search?: string,
  page = 1,
  pageSize = 4,
) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(
    `https://ocvyaicrbpqrhmkgrlay.supabase.co/functions/v1/public-notes?search=${encodeURIComponent(search || "")}&page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      // Add Next.js caching
      next: {
        revalidate: 300, // 5 minutes
        tags: ["public-notes", `public-notes-page-${page}`],
      },
    },
  );

  if (!res.ok) {
    console.error("[fetchPublicNotes] Edge Function error", await res.text());
    throw new Error("Failed to fetch public notes");
  }

  return res.json();
}

export async function fetchUserNotes(
  userId: string,
  searchQuery?: string,
  page = 1,
  pageSize = 4,
): Promise<PaginatedResult<Note>> {
  const supabase = createClient();
  const offset = (page - 1) * pageSize;

  // Call the updated RPC function with pagination
  const { data: notes, error } = await supabase.rpc("search_user_term", {
    p_user_id: userId,
    search_term: searchQuery || "",
    page_limit: pageSize,
    page_offset: offset,
  });

  if (error) {
    console.error("Error fetching user notes:", error);
    return {
      data: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const totalCount =
    notes && notes.length > 0 ? Number(notes[0].total_count) : 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (!notes || notes.length === 0) {
    return {
      data: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  // Fetch profile once for the user (since all notes belong to same user)
  const { data: profile, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, email, username, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (profilesError && (profilesError as any).status !== 406) {
    console.error("Error fetching profile:", profilesError);
  }

  // Transform the data to match our interface
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

  return {
    data: transformedNotes,
    totalCount,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export async function fetchNoteById(noteId: string): Promise<Note | null> {
  const supabase = createClient();

  if (!noteId || noteId === "undefined" || noteId.trim() === "") {
    console.error("Invalid note ID provided:", noteId);
    return null;
  }

  try {
    const { data, error } = await supabase.rpc("get_note_with_profile", {
      note_id: noteId,
    });

    if (error) {
      console.error("Error fetching note:", error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log("No note found with ID:", noteId);
      return null;
    }

    const noteData = data[0];

    const transformedNote: Note = {
      id: noteData.id,
      title: noteData.title,
      excerpt: noteData.excerpt,
      content_url: noteData.content_url,
      tags: noteData.tags,
      created_at: noteData.created_at,
      word_count: noteData.word_count,
      user_id: noteData.user_id,
      subjects: noteData.subject_name ? { name: noteData.subject_name } : null,
      profiles: noteData.profile_id
        ? {
            full_name: noteData.full_name,
            email: noteData.email,
            username: noteData.username,
            avatar_url: noteData.avatar_url,
          }
        : null,
    };

    return transformedNote;
  } catch (error) {
    console.error("Unexpected error fetching note:", error);
    return null;
  }
}

export async function fetchNoteContent(contentUrl: string): Promise<any> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.storage
      .from("note-contents")
      .download(contentUrl);

    if (error) {
      console.error("Error fetching note content:", error);
      return null;
    }

    const content = await data.text();
    return JSON.parse(content);
  } catch (error) {
    console.error("Error parsing note content:", error);
    return null;
  }
}

export async function fetchNoteByIdEdgeClient(noteId: string) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;

  const res = await fetch(
    `https://ocvyaicrbpqrhmkgrlay.supabase.co/functions/v1/fetch-note-by-id?id=${encodeURIComponent(noteId)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // Client-side caching
      cache: "force-cache",
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[fetchNoteByIdEdgeClient] Edge Function error", errorText);

    if (res.status === 404) {
      throw new Error("Note not found");
    }
    throw new Error("Failed to fetch note");
  }

  return res.json();
}

export async function fetchNoteContentEdgeClient(contentUrl: string) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;

  const res = await fetch(
    `https://ocvyaicrbpqrhmkgrlay.supabase.co/functions/v1/fetch-note-content?url=${encodeURIComponent(contentUrl)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // Client-side caching - note content rarely changes
      cache: "force-cache",
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      "[fetchNoteContentEdgeClient] Edge Function error",
      errorText,
    );
    throw new Error("Failed to fetch note content");
  }

  return res.json();
}
