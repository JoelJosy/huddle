"use client";

import React from "react";
import { Card, CardTitle, CardContent, CardHeader } from "../ui/card";
import { Separator } from "@radix-ui/react-separator";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";

const NoteEditor = () => {
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
      }),
      Highlight,
      Underline,
    ],
    content: "<p>Enter note content here!</p>",
    // place the cursor in the editor after initialization
    autofocus: true,
    // make the text editable (default is true)
    editable: true,
    // prevent loading the default CSS (which isn't much anyway)
    injectCSS: false,
    // prevent SSR hydration mismatches
    immediatelyRender: false,
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
            <MenuBar editor={editor} />

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
