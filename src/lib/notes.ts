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
