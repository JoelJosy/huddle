"use server";

import { createClient } from "@/utils/supabase/server";

export async function cacheUserAvatar(
  userId: string,
  avatarUrl: string | null,
) {
  if (!userId || !avatarUrl) return null;

  try {
    const supabase = await createClient();

    // Check if we already have a cached avatar for this user
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    // If avatar_url exists and is from our bucket, don't re-upload
    if (profile?.avatar_url && profile.avatar_url.includes("profile-avatars")) {
      return profile.avatar_url;
    }

    // Download the image from the external URL (Google, etc.)
    const response = await fetch(avatarUrl);
    if (!response.ok) {
      console.error("Failed to fetch avatar image:", response.statusText);
      return null;
    }

    const imageBlob = await response.blob();

    // Get file extension from content type or URL
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const extension = contentType.split("/")[1] || "jpg";

    // Create a unique filename for this user's avatar
    const filename = `${userId}/avatar.${extension}`;

    // Upload the image blob to the profile-avatars bucket
    const { error: uploadError } = await supabase.storage
      .from("profile-avatars")
      .upload(filename, imageBlob, {
        contentType,
        upsert: true, // Overwrite if exists
      });

    if (uploadError) {
      console.error("Error uploading avatar image:", uploadError);
      return null;
    }

    // Get the public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("profile-avatars")
      .getPublicUrl(filename);

    if (!publicUrlData?.publicUrl) {
      console.error("Failed to get public URL for uploaded avatar");
      return null;
    }

    // Update the user's profile with the new Supabase storage URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrlData.publicUrl })
      .eq("id", userId);

    if (updateError) {
      console.error(
        "Error updating profile with cached avatar URL:",
        updateError,
      );
      return null;
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in cacheUserAvatar:", error);
    return null;
  }
}

export async function getUserCachedAvatar(userId: string) {
  if (!userId) return null;

  try {
    const supabase = await createClient();

    // First check if user already has a cached avatar
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    // If avatar_url exists and is from our bucket, return it
    if (profile?.avatar_url && profile.avatar_url.includes("profile-avatars")) {
      return profile.avatar_url;
    }

    // If no cached avatar, get the avatar from user metadata and cache it
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error fetching user:", userError);
      return null;
    }

    const avatarUrl = user.user_metadata?.avatar_url || null;

    if (avatarUrl) {
      // Download and cache the avatar image
      return await cacheUserAvatar(userId, avatarUrl);
    }

    return null;
  } catch (error) {
    console.error("Error in getUserCachedAvatar:", error);
    return null;
  }
}
