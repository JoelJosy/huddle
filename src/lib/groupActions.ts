"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import getCurrentUserId from "@/lib/accountActions";

export async function createStudyGroup(formData: FormData) {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in to create a group");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const maxMembers = parseInt(formData.get("maxMembers") as string) || 20;
  const isPublic = formData.has("isPublic");

  if (!name || name.trim().length === 0) {
    throw new Error("Group name is required");
  }

  const { data, error } = await supabase
    .from("study_groups")
    .insert({
      name: name.trim(),
      description: description.trim() || null,
      owner_id: currentUserId,
      is_public: isPublic,
      max_members: maxMembers,
      member_count: 1,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating group:", error);
    throw new Error("Failed to create group");
  }

  // Revalidate the groups page
  revalidatePath("/groups");

  return { groupId: data.id };
}
