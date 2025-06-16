import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";

export async function fetchPublicNotesEdgeServer(
  search?: string,
  page = 1,
  pageSize = 4,
) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;

  const res = await fetch(
    `https://ocvyaicrbpqrhmkgrlay.supabase.co/functions/v1/public-notes?search=${encodeURIComponent(
      search || "",
    )}&page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // Add Next.js caching
      next: {
        revalidate: 300, // 5 minutes
        tags: ["public-notes", `public-notes-page-${page}`],
      },
    },
  );

  if (!res.ok) {
    console.error(
      "[fetchPublicNotesEdgeServer] Edge Function error",
      await res.text(),
    );
    throw new Error("Failed to fetch public notes (server)");
  }

  return res.json();
}

export async function fetchNoteByIdEdgeServer(noteId: string) {
  const supabase = await createClient();

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
      next: {
        revalidate: 600, // 10 minutes - notes don't change often
        tags: ["note", `note-${noteId}`],
      },
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[fetchNoteByIdEdgeServer] Edge Function error", errorText);

    if (res.status === 404) {
      throw new Error("Note not found");
    }
    throw new Error("Failed to fetch note");
  }

  return res.json();
}

export async function fetchNoteContentEdgeServer(contentUrl: string) {
  const supabase = await createClient();

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
      next: {
        revalidate: 3600, // 1 hour - note content rarely changes
        tags: ["note-content", `note-content-${contentUrl}`],
      },
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      "[fetchNoteContentEdgeServer] Edge Function error",
      errorText,
    );
    throw new Error("Failed to fetch note content");
  }

  return res.json();
}

// invalidate all note-related caches
export async function invalidateNoteCaches(
  noteId?: string,
  contentUrl?: string,
) {
  revalidateTag("public-notes");
  revalidateTag("note");

  if (noteId) {
    revalidateTag(`note-${noteId}`);
  }

  if (contentUrl) {
    revalidateTag(`note-content-${contentUrl}`);
    revalidateTag("note-content");
  }
}
