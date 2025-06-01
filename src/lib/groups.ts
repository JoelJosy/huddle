import { createClient } from "@/utils/supabase/server";

export interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  created_at: string;
  subject_name: string | null;
  owner_name: string | null;
  owner_id?: string;
}

export async function fetchPublicGroups(
  searchQuery?: string,
): Promise<StudyGroup[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc("get_public_study_groups", {
      search_term: searchQuery || "",
    });

    if (error) {
      console.error("Error fetching groups:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching groups:", error);
    return [];
  }
}
