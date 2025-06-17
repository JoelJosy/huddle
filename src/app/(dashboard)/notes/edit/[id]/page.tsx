"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import NoteEditor from "@/components/notes/NoteEditor";
import { updateNote } from "@/lib/noteActions";
import {
  fetchNoteByIdEdgeClient,
  fetchNoteContentEdgeClient,
} from "@/lib/notes";

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const editorRef = useRef<any>(null);
  const noteId = params?.id as string;

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [noteNotFound, setNoteNotFound] = useState(false);
  const [noteContent, setNoteContent] = useState<any>(null);

  // Load existing note data
  useEffect(() => {
    const loadNote = async () => {
      if (!noteId) {
        setNoteNotFound(true);
        setIsLoadingNote(false);
        return;
      }

      try {
        setIsLoadingNote(true);

        // Fetch note metadata
        const note = await fetchNoteByIdEdgeClient(noteId);
        console.log("Fetched note:", note);
        if (!note) {
          setNoteNotFound(true);
          return;
        }

        // Populate form fields
        setTitle(note.title);
        setSubject(note.subjects?.name || "");
        setTags(note.tags || []);

        // Fetch and load note content
        const content = await fetchNoteContentEdgeClient(note.content_url);

        if (content) {
          setNoteContent(content);
        }
      } catch (error) {
        console.error("Error loading note:", error);
        toast.error("Failed to load note");
        setNoteNotFound(true);
      } finally {
        setIsLoadingNote(false);
      }
    };

    loadNote();
  }, [noteId]);

  const addTag = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const extractExcerpt = (content: any): string => {
    if (!content || !content.content) return "";

    let text = "";
    const extractText = (node: any) => {
      if (node.type === "text") {
        text += node.text;
      } else if (node.content) {
        node.content.forEach(extractText);
      }
    };

    content.content.forEach(extractText);

    return text.slice(0, 200) + (text.length > 200 ? "..." : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !subject.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const editorContent = editorRef.current?.getJSON();
    if (!editorContent) {
      toast.error("Please add some content to your note.");
      return;
    }

    // Get word count only when submitting
    const wordCount = editorRef.current?.getWordCount() || 0;

    setIsLoading(true);

    try {
      const excerpt = extractExcerpt(editorContent);

      const result = await updateNote({
        noteId: noteId,
        title: title.trim(),
        subject: subject.trim(),
        tags: tags,
        content: editorContent,
        excerpt: excerpt,
        wordCount: wordCount,
      });

      if (result.success) {
        toast.success("Note updated successfully!");
        router.push("/notes");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update note. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = title.trim() && subject.trim();

  // Loading state
  if (isLoadingNote) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-64 items-center justify-center">
            <div className="text-lg">Loading note...</div>
          </div>
        </div>
      </div>
    );
  }

  // Note not found state
  if (noteNotFound) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Note not found</h1>
            <p className="text-muted-foreground mb-4">
              The note you're looking for doesn't exist or you don't have
              permission to edit it.
            </p>
            <Button asChild>
              <Link href="/notes">Back to Notes</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/notes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Notes
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Note</h1>
          <p className="text-muted-foreground mt-2">Update your note content</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Note Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter your note title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="text-lg"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      Subject <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Enter subject (e.g., Computer Science)"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          id="tags"
                          placeholder="Add a tag..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addTag}
                          disabled={!tagInput.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={(e) => removeTag(tag, e)}
                                className="hover:text-destructive ml-1 flex h-3 w-3 cursor-pointer items-center justify-center rounded-full"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Add tags to help others find your note
                    </p>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={!isFormValid || isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Updating..." : "Update Note"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <NoteEditor ref={editorRef} initialContent={noteContent} />
          </div>
        </form>
      </div>
    </div>
  );
}
