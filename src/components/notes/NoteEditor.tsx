"use client";

import React from "react";
import { Card, CardTitle, CardContent, CardHeader } from "../ui/card";
import { Separator } from "@radix-ui/react-separator";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

const NoteEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: "<p>Enter note content here!</p>",
    // place the cursor in the editor after initialization
    autofocus: true,
    // make the text editable (default is true)
    editable: true,
    // prevent loading the default CSS (which isn't much anyway)
    injectCSS: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm m-0 min-h-[600px] min-w-full p-3",
      },
    },
  });

  return (
    <div className="space-y-6 lg:col-span-8">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Editor toolbar placeholder */}
            <div className="bg-muted/20 flex items-center gap-2 rounded border p-2">
              <div className="flex gap-1">
                <div className="bg-muted h-8 w-8 rounded"></div>
                <div className="bg-muted h-8 w-8 rounded"></div>
                <div className="bg-muted h-8 w-8 rounded"></div>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex gap-1">
                <div className="bg-muted h-8 w-16 rounded"></div>
                <div className="bg-muted h-8 w-16 rounded"></div>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex gap-1">
                <div className="bg-muted h-8 w-8 rounded"></div>
                <div className="bg-muted h-8 w-8 rounded"></div>
                <div className="bg-muted h-8 w-8 rounded"></div>
              </div>
            </div>

            <div className="bg-muted/30 flex min-h-[600px] flex-col rounded-lg border">
              {/* Tiptap editor */}
              <div className="text-muted-foreground flex-1 text-center">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteEditor;
