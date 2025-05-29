"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { createNote } from "@/lib/noteActions";

export default function CreateNotePage() {
  const router = useRouter();
  const editorRef = useRef<any>(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

    // Extract text from TipTap JSON content
    let text = "";
    const extractText = (node: any) => {
      if (node.type === "text") {
        text += node.text;
      } else if (node.content) {
        node.content.forEach(extractText);
      }
    };

    content.content.forEach(extractText);

    // Return first 200 characters as excerpt
    return text.slice(0, 200) + (text.length > 200 ? "..." : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !subject.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Get content from TipTap editor
    const editorContent = editorRef.current?.getJSON();
    if (!editorContent) {
      toast.error("Please add some content to your note.");
      return;
    }

    setIsLoading(true);

    try {
      const excerpt = extractExcerpt(editorContent);

      const result = await createNote({
        title: title.trim(),
        subject: subject.trim(),
        tags: tags,
        content: editorContent,
        excerpt: excerpt,
      });

      if (result.success) {
        toast.success("Note created successfully!");
        router.push("/notes");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = title.trim() && subject.trim();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/notes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Notes
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Create New Note</h1>
          <p className="text-muted-foreground mt-2">
            Share your knowledge with the community
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Section - Form Fields */}
            <div className="space-y-6 lg:col-span-4">
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

                  {/* Submit Buttons */}
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={!isFormValid || isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Saving..." : "Save Note"}
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

            {/* Right Section */}
            <NoteEditor ref={editorRef} />
          </div>
        </form>
      </div>
    </div>
  );
}
