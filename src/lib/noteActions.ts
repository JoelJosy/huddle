"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface CreateNoteData {
  title: string;
  subject: string;
  tags: string[];
  content: any;
  excerpt?: string;
  wordCount: number; // Add word count to interface
}

export async function createNote(data: CreateNoteData) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  try {
    // Generate a unique filename for the content
    const contentFileName = `${user.id}/${Date.now()}-${crypto.randomUUID()}.json`;

    // Upload content to Supabase storage
    const { error: storageError } = await supabase.storage
      .from("note-contents")
      .upload(contentFileName, JSON.stringify(data.content), {
        contentType: "application/json",
      });

    if (storageError) {
      throw new Error(`Failed to upload content: ${storageError.message}`);
    }

    // Get or create subject
    let subjectId: string;
    const { data: existingSubject } = await supabase
      .from("subjects")
      .select("id")
      .eq("name", data.subject)
      .single();

    if (existingSubject) {
      subjectId = existingSubject.id;
    } else {
      const { data: newSubject, error: subjectError } = await supabase
        .from("subjects")
        .insert({
          name: data.subject,
        })
        .select("id")
        .single();

      if (subjectError || !newSubject) {
        console.error("Subject creation error:", subjectError);
        throw new Error(`Failed to create subject: ${subjectError?.message}`);
      }
      subjectId = newSubject.id;
    }

    // Create the note record with word count
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .insert({
        title: data.title,
        excerpt: data.excerpt || data.title,
        content_url: contentFileName,
        tags: data.tags,
        subject_id: subjectId,
        user_id: user.id,
        visibility: "public",
        is_public: true,
        group_id: null,
        word_count: data.wordCount, // Add word count to database insert
      })
      .select()
      .single();

    if (noteError) {
      console.error("Note creation error:", noteError);
      // Clean up uploaded file if note creation fails
      await supabase.storage.from("note-contents").remove([contentFileName]);

      throw new Error(`Failed to create note: ${noteError.message}`);
    }

    revalidatePath("/notes");
    return { success: true, noteId: note.id };
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
}

export async function deleteNote(noteId: string) {
  const supabase = await createClient();

  try {
    // 1. Fetch the note to get the content URL
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .select("content_url")
      .eq("id", noteId)
      .single();

    if (noteError || !note) {
      throw new Error(`Note not found: ${noteError?.message}`);
    }

    const { content_url } = note;

    // 2. Delete the content file from storage
    const { error: storageError } = await supabase.storage
      .from("note-contents")
      .remove([content_url]);

    if (storageError) {
      console.error("Failed to delete content file:", storageError);
      throw new Error(`Failed to delete content file: ${storageError.message}`);
    }

    // 3. Delete the note record
    const { error: deleteError } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId);

    if (deleteError) {
      throw new Error(`Failed to delete note: ${deleteError.message}`);
    }

    // 4. Revalidate frontend cache/path
    revalidatePath("/notes");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting note:", error);
    throw error;
  }
}
