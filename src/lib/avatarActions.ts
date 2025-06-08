"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Caches a user's avatar URL from OAuth in Supabase storage
 * Stores the URL as a text file in the profile-avatars bucket
 */
export async function cacheUserAvatar(
  userId: string,
  avatarUrl: string | null,
) {
  if (!userId || !avatarUrl) return null;

  try {
    const supabase = await createClient();

    // Create a unique filename for this user's avatar URL
    const filename = `${userId}/avatar-url.txt`;

    // Upload the avatar URL as a text file to the profile-avatars bucket
    const { error: uploadError } = await supabase.storage
      .from("profile-avatars")
      .upload(filename, avatarUrl, {
        contentType: "text/plain",
        upsert: true, // Overwrite if exists
      });

    if (uploadError) {
      console.error("Error uploading avatar URL:", uploadError);
      return null;
    }

    // Get the public URL for the stored file
    const { data: publicUrlData } = supabase.storage
      .from("profile-avatars")
      .getPublicUrl(filename);

    if (!publicUrlData?.publicUrl) {
      console.error("Failed to get public URL for cached avatar");
      return null;
    }

    // Update the user's profile with the new cached avatar URL
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

/**
 * Gets the cached avatar URL for a user
 * If no cached URL exists, attempts to cache the avatar from user metadata
 */
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
      // Cache the avatar URL
      return await cacheUserAvatar(userId, avatarUrl);
    }

    return null;
  } catch (error) {
    console.error("Error in getUserCachedAvatar:", error);
    return null;
  }
}
