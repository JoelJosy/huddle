import { createClient } from "@/utils/supabase/server";

export interface Note {
  id: string;
  title: string;
  excerpt: string;
  content_url: string;
  tags: string[];
  created_at: string;
  subjects: {
    name: string;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Introduction to React Hooks",
    excerpt:
      "A comprehensive guide to understanding and using React Hooks in modern React applications. Learn about useState, useEffect, and custom hooks.",
    content_url: "/notes/react-hooks",
    tags: ["React", "JavaScript", "Frontend", "Hooks"],
    created_at: "2024-01-15T10:30:00Z",
    subjects: {
      name: "Computer Science",
    },
    profiles: {
      full_name: "John Doe",
      email: "john@example.com",
    },
  },
  {
    id: "2",
    title: "Calculus Fundamentals",
    excerpt:
      "Essential calculus concepts including derivatives, integrals, and limits. Perfect for beginners starting their calculus journey.",
    content_url: "/notes/calculus-fundamentals",
    tags: ["Mathematics", "Calculus", "Derivatives"],
    created_at: "2024-01-14T14:20:00Z",
    subjects: {
      name: "Mathematics",
    },
    profiles: {
      full_name: "Sarah Smith",
      email: "sarah@example.com",
    },
  },
  {
    id: "3",
    title: "Database Design Principles",
    excerpt:
      "Learn the core principles of database design, normalization, and creating efficient database schemas for modern applications.",
    content_url: "/notes/database-design",
    tags: ["Database", "SQL", "Design", "Backend"],
    created_at: "2024-01-13T09:15:00Z",
    subjects: {
      name: "Computer Science",
    },
    profiles: {
      full_name: "Mike Johnson",
      email: "mike@example.com",
    },
  },
  {
    id: "4",
    title: "Organic Chemistry Basics",
    excerpt:
      "Understanding molecular structures, chemical bonds, and reaction mechanisms in organic chemistry.",
    content_url: "/notes/organic-chemistry",
    tags: ["Chemistry", "Organic", "Molecules", "Reactions"],
    created_at: "2024-01-12T16:45:00Z",
    subjects: {
      name: "Chemistry",
    },
    profiles: {
      full_name: "Emily Davis",
      email: "emily@example.com",
    },
  },
  {
    id: "5",
    title: "World War II Timeline",
    excerpt:
      "A detailed timeline of major events during World War II, including key battles, political decisions, and turning points.",
    content_url: "/notes/wwii-timeline",
    tags: ["History", "WWII", "Timeline", "Events"],
    created_at: "2024-01-11T11:30:00Z",
    subjects: {
      name: "History",
    },
    profiles: {
      full_name: "Robert Wilson",
      email: "robert@example.com",
    },
  },
  {
    id: "6",
    title: "Spanish Grammar Guide",
    excerpt:
      "Complete guide to Spanish grammar including verb conjugations, sentence structure, and common grammar rules.",
    content_url: "/notes/spanish-grammar",
    tags: ["Spanish", "Grammar", "Language", "Verbs"],
    created_at: "2024-01-10T13:20:00Z",
    subjects: {
      name: "Languages",
    },
    profiles: {
      full_name: "Maria Garcia",
      email: "maria@example.com",
    },
  },
];

export async function fetchPublicNotes(searchQuery?: string): Promise<Note[]> {
  // Uncomment when ready to use Supabase
  // const supabase = await createClient();
  //
  // let query = supabase
  //   .from("notes")
  //   .select(`
  //     id,
  //     title,
  //     excerpt,
  //     content_url,
  //     tags,
  //     created_at,
  //     subjects(name),
  //     profiles(full_name, email)
  //   `)
  //   .eq("visibility", "public")
  //   .order("created_at", { ascending: false });
  //
  // if (searchQuery) {
  //   query = query.or(`title.ilike.%${searchQuery}%,subjects.name.ilike.%${searchQuery}%`);
  // }
  //
  // const { data: notes, error } = await query;
  //
  // if (error) {
  //   console.error("Error fetching notes:", error);
  //   return [];
  // }
  //
  // return notes || [];

  // Mock implementation for now
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredNotes = mockNotes;

  if (searchQuery) {
    filteredNotes = mockNotes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  return filteredNotes;
}
