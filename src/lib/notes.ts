import { createClient } from "@/utils/supabase/server";

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

  // First, get notes with subjects only
  let query = supabase
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

  if (searchQuery) {
    query = query.or(
      `title.ilike.%${searchQuery}%,subjects.name.ilike.%${searchQuery}%`,
    );
  }

  const { data: notes, error } = await query;

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  if (!notes || notes.length === 0) {
    return [];
  }

  // Get unique user IDs from notes
  const userIds = [...new Set(notes.map((note) => note.user_id))];

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
  const transformedNotes: Note[] = notes.map((note) => ({
    ...note,
    subjects: Array.isArray(note.subjects)
      ? note.subjects[0] || null
      : note.subjects,
    profiles: profilesMap.get(note.user_id) || null,
  }));

  return transformedNotes;
}

// Add this function to your existing notes.ts file

export async function fetchNoteById(noteId: string): Promise<Note | null> {
  const supabase = await createClient();

  // Validate the noteId
  if (!noteId || noteId === "undefined" || noteId.trim() === "") {
    console.error("Invalid note ID provided:", noteId);
    return null;
  }

  console.log("Fetching note with ID:", noteId); // Debug log

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
