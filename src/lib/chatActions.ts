"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import getCurrentUserId from "@/lib/accountActions";

export async function fetchMessages(groupId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group_messages")
    .select(
      `
      id, content, created_at, user_id,
      profile:profiles(full_name, username)
    `,
    )
    .eq("group_id", groupId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }

  return data || [];
}

export async function sendMessage(groupId: string, content: string) {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in to send messages");
  }

  // Check if user is a member of the group
  const { data: memberData, error: memberError } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", currentUserId)
    .single();

  if (memberError || !memberData) {
    throw new Error("You must be a member of this group to send messages");
  }

  const { error } = await supabase.from("group_messages").insert({
    group_id: groupId,
    user_id: currentUserId,
    content,
  });

  if (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }

  // Update last_active timestamp for the user in this group
  await supabase
    .from("group_members")
    .update({ last_active: new Date().toISOString() })
    .eq("group_id", groupId)
    .eq("user_id", currentUserId);

  revalidatePath(`/groups/${groupId}`);

  return { success: true };
}
