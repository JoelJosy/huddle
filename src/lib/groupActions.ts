"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import getCurrentUserId from "@/lib/accountActions";
import type { StudyGroup } from "@/lib/groups";

export async function createStudyGroup(formData: FormData) {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in to create a group");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const maxMembers =
    Number.parseInt(formData.get("maxMembers") as string) || 20;
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

  // Add the creator as a member with owner role
  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: data.id,
    user_id: currentUserId,
    role: "owner",
  });

  if (memberError) {
    console.error("Error adding owner as member:", memberError);
    // We don't throw here as the group was created successfully
  }

  // Revalidate the groups page
  revalidatePath("/groups");

  return { groupId: data.id };
}

export async function deleteStudyGroup(groupId: string) {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in to delete a group");
  }

  try {
    // First verify the user owns the group
    const { data: group, error: fetchError } = await supabase
      .from("study_groups")
      .select("owner_id")
      .eq("id", groupId)
      .single();

    if (fetchError) {
      throw new Error("Group not found");
    }

    if (group.owner_id !== currentUserId) {
      throw new Error("You can only delete groups you own");
    }

    // Delete the group
    const { error: deleteError } = await supabase
      .from("study_groups")
      .delete()
      .eq("id", groupId);

    if (deleteError) {
      console.error("Error deleting group:", deleteError);
      throw new Error("Failed to delete group");
    }

    // Revalidate the groups page
    revalidatePath("/groups");

    return { success: true };
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
}

export async function fetchGroupDetails(
  groupId: string,
): Promise<StudyGroup | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("study_groups")
    .select(
      `
      id,
      name,
      description,
      owner_id,
      is_public,
      max_members,
      member_count,
      created_at,
      profiles:owner_id(full_name, username)
    `,
    )
    .eq("id", groupId)
    .single();

  if (error) {
    console.error("Error fetching group details:", error);
    return null;
  }

  return {
    ...data,
    owner_name:
      data.profiles?.[0]?.full_name || data.profiles?.[0]?.username || null,
  };
}

export async function fetchGroupMembers(groupId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group_members")
    .select(
      `
      id,
      user_id,
      role,
      joined_at,
      last_active,
      profile:profiles(full_name, username)
    `,
    )
    .eq("group_id", groupId)
    .order("role", { ascending: false }) // Owner first
    .order("joined_at", { ascending: true });

  if (error) {
    console.error("Error fetching group members:", error);
    return [];
  }

  return data || [];
}

export async function joinGroup(groupId: string) {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in to join a group");
  }

  // Check if the user is already a member
  const { data: existingMember, error: checkError } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", currentUserId)
    .maybeSingle();

  if (existingMember) {
    return { success: true, message: "Already a member" };
  }

  // Check if the group exists and has space
  const { data: group, error: groupError } = await supabase
    .from("study_groups")
    .select("member_count, max_members")
    .eq("id", groupId)
    .single();

  if (groupError) {
    throw new Error("Group not found");
  }

  if (group.member_count >= group.max_members) {
    throw new Error("This group is full");
  }

  // Add the user as a member
  const { error: joinError } = await supabase.from("group_members").insert({
    group_id: groupId,
    user_id: currentUserId,
    role: "member",
  });

  if (joinError) {
    console.error("Error joining group:", joinError);
    throw new Error("Failed to join group");
  }

  // Increment the member count
  const { error: updateError } = await supabase
    .from("study_groups")
    .update({ member_count: group.member_count + 1 })
    .eq("id", groupId);

  if (updateError) {
    console.error("Error updating member count:", updateError);
    // We don't throw here as the user was added successfully
  }

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/groups");

  return { success: true };
}

export async function leaveGroup(groupId: string) {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in to leave a group");
  }

  // Check if the user is the owner
  const { data: group, error: groupError } = await supabase
    .from("study_groups")
    .select("owner_id, member_count")
    .eq("id", groupId)
    .single();

  if (groupError) {
    throw new Error("Group not found");
  }

  if (group.owner_id === currentUserId) {
    throw new Error(
      "As the owner, you cannot leave the group. You can delete it instead.",
    );
  }

  // Remove the user from the group
  const { error: leaveError } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", currentUserId);

  if (leaveError) {
    console.error("Error leaving group:", leaveError);
    throw new Error("Failed to leave group");
  }

  // Decrement the member count
  const { error: updateError } = await supabase
    .from("study_groups")
    .update({ member_count: Math.max(1, group.member_count - 1) })
    .eq("id", groupId);

  if (updateError) {
    console.error("Error updating member count:", updateError);
    // We don't throw here as the user was removed successfully
  }

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/groups");

  return { success: true };
}
