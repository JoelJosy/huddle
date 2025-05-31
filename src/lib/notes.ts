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
  } | null;
}

export async function fetchPublicNotes(searchQuery?: string): Promise<Note[]> {
  const supabase = await createClient();

  let notes;
  let error;

  if (searchQuery) {
    // Use the RPC function for search
    const { data, error: rpcError } = await supabase.rpc("search_notes", {
      search_term: searchQuery,
    });

    if (rpcError) {
      console.error("Error fetching notes with search:", rpcError);
      return [];
    }

    // Transform RPC results to match expected structure
    notes =
      data?.map((note: any) => ({
        ...note,
        subjects: note.subject_name ? { name: note.subject_name } : null,
      })) || [];
  } else {
    // Use the original query for non-search requests
    const { data, error: queryError } = await supabase
      .from("notes")
      .select(
        `
        id,
        title,
        excerpt,
        content_url,
        tags,
        created_at,
        word_count,
        user_id,
        subjects(name)
      `,
      )
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    notes = data;
    error = queryError;

    if (error) {
      console.error("Error fetching notes:", error);
      return [];
    }
  }

  if (!notes || notes.length === 0) {
    return [];
  }

  // Get unique user IDs from notes
  const userIds = [...new Set(notes.map((note: any) => note.user_id))];

  // Fetch profiles separately
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, email, username")
    .in("id", userIds);

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
  }

  // Create a map for quick profile lookup
  const profilesMap = new Map(profiles?.map((p) => [p.id, p]) || []);

  // Transform the data to match our interface
  const transformedNotes: Note[] = notes.map((note: any) => ({
    ...note,
    subjects: Array.isArray(note.subjects)
      ? note.subjects[0] || null
      : note.subjects,
    profiles: profilesMap.get(note.user_id) || null,
  }));

  return transformedNotes;
}

export async function fetchUserNotes(
  userId: string,
  searchQuery?: string,
): Promise<Note[]> {
  const supabase = await createClient();

  // Call the RPC function
  const { data: notes, error } = await supabase.rpc("search_user_term", {
    p_user_id: userId,
    search_term: searchQuery || "",
  });

  if (error) {
    console.error("Error fetching user notes:", error);
    return [];
  }

  if (!notes || notes.length === 0) {
    return [];
  }

  // Fetch profiles for the user
  const { data: profile, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, email, username")
    .eq("id", userId)
    .maybeSingle();

  if (profilesError && (profilesError as any).status !== 406) {
    console.error("Error fetching profile:", profilesError);
  }

  // Create a map for quick profile lookup
  const profilesMap = new Map(profile ? [[profile.id, profile]] : []);

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
    profiles: profilesMap.get(note.user_id) || null,
  }));

  return transformedNotes;
}

export async function fetchNoteById(noteId: string): Promise<Note | null> {
  const supabase = await createClient();

  // Validate the noteId
  if (!noteId || noteId === "undefined" || noteId.trim() === "") {
    console.error("Invalid note ID provided:", noteId);
    return null;
  }

  try {
    // Get the note with its subject
    const { data: note, error } = await supabase
      .from("notes")
      .select(
        `
        id,
        title,
        excerpt,
        content_url,
        tags,
        created_at,
        word_count,
        user_id,
        subjects(name)
      `,
      )
      .eq("id", noteId)
      .eq("visibility", "public") // Only public notes
      .single();

    if (error) {
      console.error("Error fetching note:", error);
      return null;
    }

    if (!note) {
      console.log("No note found with ID:", noteId);
      return null;
    }

    // Fetch the profile for this note's author
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, email, username")
      .eq("id", note.user_id)
      .single();

    // Transform the data to match our interface
    const transformedNote: Note = {
      ...note,
      subjects: Array.isArray(note.subjects)
        ? note.subjects[0] || null
        : note.subjects,
      profiles: profile || null,
    };

    return transformedNote;
  } catch (error) {
    console.error("Unexpected error fetching note:", error);
    return null;
  }
}

export async function fetchNoteContent(contentUrl: string): Promise<any> {
  const supabase = await createClient();

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
