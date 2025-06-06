"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface GroupData {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  is_public: boolean;
  max_members: number;
  member_count: number;
  created_at: string;
  profiles?: {
    full_name?: string;
    username?: string;
  };
  owner_name: string | null;
}

const GroupChatRoom = () => {
  const [group, setGroup] = useState<GroupData | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const supabase = createClient();
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
        .eq("id", "c8e86e2f-7a9f-4bba-9651-4c349c36e92d")
        .single();
      console.log(data);
      if (!error) {
        const profile = Array.isArray(data.profiles)
          ? data.profiles[0]
          : data.profiles;
        setGroup({
          ...data,
          profiles: profile,
          owner_name: profile?.full_name || profile?.username || null,
        });
      } else {
        console.error("Error:", error);
      }
    };

    fetchDetails();
  }, []);

  return <div>{group ? `Group: ${group.name}` : "Loading..."}</div>;
};

export default GroupChatRoom;
