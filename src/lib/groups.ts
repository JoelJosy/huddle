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

// Mock data for development
const mockGroups: StudyGroup[] = [
  {
    id: "1",
    name: "Advanced React Patterns",
    description:
      "Deep dive into advanced React concepts including hooks, context, and performance optimization. Perfect for developers looking to level up their React skills.",
    member_count: 12,
    created_at: "2024-12-01T10:00:00Z",
    subject_name: "Computer Science",
    owner_name: "Sarah Johnson",
    owner_id: "user-1",
  },
  {
    id: "2",
    name: "Calculus Study Group",
    description:
      "Weekly calculus problem-solving sessions. We cover limits, derivatives, and integrals with plenty of practice problems.",
    member_count: 8,
    created_at: "2024-11-28T14:30:00Z",
    subject_name: "Mathematics",
    owner_name: "Mike Chen",
    owner_id: "user-2",
  },
  {
    id: "3",
    name: "Data Structures & Algorithms",
    description:
      "Prepare for technical interviews and improve your problem-solving skills. We practice coding challenges and discuss optimal solutions.",
    member_count: 15,
    created_at: "2024-11-25T09:15:00Z",
    subject_name: "Computer Science",
    owner_name: "Alex Rodriguez",
    owner_id: "user-3",
  },
  {
    id: "4",
    name: "Physics Lab Partners",
    description:
      "Looking for lab partners for Physics 101. We meet twice a week to work on experiments and review concepts.",
    member_count: 6,
    created_at: "2024-11-22T16:45:00Z",
    subject_name: "Physics",
    owner_name: "Emma Davis",
    owner_id: "user-4",
  },
  {
    id: "5",
    name: "Spanish Conversation Circle",
    description:
      "Practice Spanish conversation in a friendly, supportive environment. All levels welcome! We focus on practical vocabulary and grammar.",
    member_count: 10,
    created_at: "2024-11-20T11:00:00Z",
    subject_name: "Languages",
    owner_name: "Carlos Martinez",
    owner_id: "user-5",
  },
  {
    id: "6",
    name: "Machine Learning Fundamentals",
    description:
      "Learn the basics of machine learning, from linear regression to neural networks. Hands-on projects using Python and TensorFlow.",
    member_count: 18,
    created_at: "2024-11-18T13:20:00Z",
    subject_name: "Computer Science",
    owner_name: "Dr. Lisa Wang",
    owner_id: "user-6",
  },
  {
    id: "7",
    name: "Organic Chemistry Study Sessions",
    description:
      "Tackle organic chemistry together! We review mechanisms, practice synthesis problems, and prepare for exams.",
    member_count: 7,
    created_at: "2024-11-15T15:30:00Z",
    subject_name: "Chemistry",
    owner_name: "Jordan Kim",
    owner_id: "user-7",
  },
  {
    id: "8",
    name: "History Book Club",
    description:
      "Monthly discussions on historical texts and events. This month we're reading about the Industrial Revolution.",
    member_count: 9,
    created_at: "2024-11-12T12:00:00Z",
    subject_name: "History",
    owner_name: "Prof. Robert Smith",
    owner_id: "user-8",
  },
];

export async function fetchPublicGroups(
  searchQuery?: string,
): Promise<StudyGroup[]> {
  // Return mock data for now
  let groups = [...mockGroups];

  // Filter by search query if provided
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    groups = groups.filter(
      (group: StudyGroup) =>
        group.name?.toLowerCase().includes(query) ||
        group.description?.toLowerCase().includes(query) ||
        group.subject_name?.toLowerCase().includes(query) ||
        group.owner_name?.toLowerCase().includes(query),
    );
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return groups;

  /* 
  // Uncomment this section when you want to use real data from Supabase
  const supabase = await createClient();

  try {
    // First, try using the RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_public_study_groups');
    
    if (!rpcError && rpcData) {
      let groups = rpcData || [];

      // Filter by search query if provided
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        groups = groups.filter((group: StudyGroup) =>
          group.name?.toLowerCase().includes(query) ||
          group.description?.toLowerCase().includes(query) ||
          group.subject_name?.toLowerCase().includes(query) ||
          group.owner_name?.toLowerCase().includes(query)
        );
      }

      return groups;
    }

    // Fallback to regular query if RPC fails
    console.log('RPC function not found, using fallback query');
    
    let query = supabase
      .from('study_groups')
      .select(`
        id,
        name,
        description,
        member_count,
        created_at,
        owner_id,
        subjects (
          name
        ),
        profiles (
          full_name
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching groups:', error);
      return [];
    }

    // Transform the data to match our interface
    const groups: StudyGroup[] = (data || []).map((group: any) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      member_count: group.member_count,
      created_at: group.created_at,
      subject_name: group.subjects?.name || null,
      owner_name: group.profiles?.full_name || null,
      owner_id: group.owner_id,
    }));

    // Filter by search query if provided
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return groups.filter((group: StudyGroup) =>
        group.name?.toLowerCase().includes(query) ||
        group.description?.toLowerCase().includes(query) ||
        group.subject_name?.toLowerCase().includes(query) ||
        group.owner_name?.toLowerCase().includes(query)
      );
    }

    return groups;
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
  */
}
