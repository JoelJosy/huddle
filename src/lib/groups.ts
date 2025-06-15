import { createClient } from "@/utils/supabase/server";

export interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  created_at: string;
  owner_name: string | null;
  owner_id?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export async function fetchPublicGroups(
  searchQuery?: string,
  page = 1,
  pageSize = 4,
): Promise<PaginatedResult<StudyGroup>> {
  const supabase = await createClient();
  const offset = (page - 1) * pageSize;

  try {
    const { data, error } = await supabase.rpc("get_public_study_groups", {
      search_term: searchQuery || "",
      page_limit: pageSize,
      page_offset: offset,
    });

    if (error) {
      console.error("Error fetching groups:", error);
      return {
        data: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const groups = data || [];
    const totalCount = groups.length > 0 ? Number(groups[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Clean the data - owner_name is now included in the RPC response
    const cleanGroups: StudyGroup[] = groups.map((group: any) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      member_count: group.member_count,
      created_at: group.created_at,
      owner_name: group.owner_name,
      owner_id: group.owner_id,
    }));

    return {
      data: cleanGroups,
      totalCount,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error("Error fetching groups:", error);
    return {
      data: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
}
