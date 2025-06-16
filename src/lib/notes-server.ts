import { createClient } from "@/utils/supabase/server";

export async function fetchPublicNotesEdgeServer(search?: string, page = 1) {
  const supabase = await createClient(); // no await, no arguments

  const {
    data: { session },
  } = await supabase.auth.getSession(); // now this works

  const accessToken = session?.access_token;

  const res = await fetch(
    `https://ocvyaicrbpqrhmkgrlay.supabase.co/functions/v1/public-notes?search=${encodeURIComponent(
      search || "",
    )}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
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
