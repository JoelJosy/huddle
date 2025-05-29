"use client";

import React, { useEffect, useState } from "react";
import { Card, CardTitle, CardContent, CardHeader } from "../ui/card";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";

interface NoteViewerProps {
  content?: any;
  wordCount?: number;
}

const NoteViewer: React.FC<NoteViewerProps> = ({ content, wordCount }) => {
  const [isLoading, setIsLoading] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      Highlight,
      Underline,
      CharacterCount.configure({
        limit: 50000,
      }),
    ],
    content: content || "<p>Loading content...</p>",
    autofocus: false,
    editable: false, // Make it read-only
    injectCSS: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm m-0 min-h-[400px] min-w-full p-3",
      },
    },
  });

  useEffect(() => {
    if (content && editor) {
      editor.commands.setContent(content);
      setIsLoading(false);
    }
  }, [content, editor]);

  return (
    <div className="space-y-6 lg:col-span-8">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Content</span>
            {!isLoading && (
              <div className="text-muted-foreground text-sm">
                {wordCount || editor?.storage.characterCount.words() || 0} words
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="bg-muted/30 flex min-h-[400px] flex-col rounded-lg border">
                <div className="text-muted-foreground flex flex-1 items-center justify-center">
                  Loading content...
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 flex min-h-[400px] flex-col rounded-lg border">
                <div className="text-muted-foreground flex-1 text-center">
                  <EditorContent editor={editor} />
                </div>
              </div>
            )}

            {!isLoading && editor && (
              <div className="text-muted-foreground text-right text-sm">
                {wordCount || editor.storage.characterCount.words()} words,{" "}
                {editor.storage.characterCount.characters()} characters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteViewer;
