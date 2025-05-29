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
    editable: false,
    injectCSS: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm m-0 p-4 focus:outline-none max-w-none min-h-full",
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
      <Card className="flex h-[600px] flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center justify-between">
            <span>Content</span>
            {!isLoading && (
              <div className="text-muted-foreground text-sm">
                {wordCount || editor?.storage.characterCount.words() || 0} words
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
          {isLoading ? (
            <div className="bg-muted/30 flex flex-1 flex-col border-t">
              <div className="text-muted-foreground flex flex-1 items-center justify-center">
                Loading content...
              </div>
            </div>
          ) : (
            <div className="bg-muted/30 flex flex-1 flex-col overflow-hidden border-t">
              <div className="flex-1 overflow-y-auto">
                <div className="h-full">
                  <EditorContent
                    editor={editor}
                    className="h-full [&_.ProseMirror]:h-full [&_.ProseMirror]:min-h-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Move word count inside CardContent and stick to bottom */}
          {!isLoading && editor && (
            <div className="text-muted-foreground flex-shrink-0 border-t bg-white px-3 py-2 text-right text-sm">
              {wordCount || editor.storage.characterCount.words()} words,{" "}
              {editor.storage.characterCount.characters()} characters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteViewer;
