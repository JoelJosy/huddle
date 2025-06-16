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

// Add this function to invalidate cache when notes change
export async function invalidatePublicNotesCache() {
  revalidateTag("public-notes");
}
