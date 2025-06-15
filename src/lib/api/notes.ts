// Client-safe API utilities for notes
// These functions use fetch to call API routes instead of server-side cached functions

import { type Note, type PaginatedResult } from "../notes";

// Helper function to build API URLs
function getApiUrl(path: string): string {
  // In client-side components, we can use relative URLs
  return path;
}

// Client-safe function to fetch public notes via API
export async function fetchPublicNotesAPI(
  searchQuery?: string,
  page = 1,
  pageSize = 4,
): Promise<PaginatedResult<Note>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchQuery) {
      params.append("search", searchQuery);
    }

    const response = await fetch(getApiUrl(`/api/notes/public?${params}`), {
      next: {
        revalidate: 300, // 5 minutes cache
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch public notes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching public notes via API:", error);
    // Return empty result on error
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

// Client-safe function to fetch a single note by ID via API
export async function fetchNoteByIdAPI(noteId: string): Promise<Note | null> {
  try {
    if (!noteId || noteId === "undefined" || noteId.trim() === "") {
      throw new Error("Invalid note ID");
    }

    const response = await fetch(getApiUrl(`/api/notes/${noteId}`), {
      next: {
        revalidate: 600, // 10 minutes cache
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching note by ID via API:", error);
    return null;
  }
}

// Client-safe function to fetch note content via API
export async function fetchNoteContentAPI(contentUrl: string): Promise<any> {
  try {
    const response = await fetch(
      getApiUrl(`/api/notes/content?url=${encodeURIComponent(contentUrl)}`),
      {
        next: {
          revalidate: 1800, // 30 minutes cache
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch note content: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching note content via API:", error);
    throw error;
  }
}
