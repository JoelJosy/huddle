"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { Card, CardTitle, CardContent, CardHeader } from "../ui/card";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count"; // Import the extension

export interface NoteEditorRef {
  getJSON: () => any;
  getHTML: () => string;
  getText: () => string;
  getWordCount: () => number;
  getCharacterCount: () => number;
}

const NoteEditor = forwardRef<NoteEditorRef>((props, ref) => {
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
        limit: 50000, // Optional: set a character limit
      }),
    ],
    content: "<p>Enter note content here!</p>",
    autofocus: true,
    editable: true,
    injectCSS: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm m-0 min-h-[600px] min-w-full p-3",
      },
    },
  });

  useImperativeHandle(ref, () => ({
    getJSON: () => editor?.getJSON(),
    getHTML: () => editor?.getHTML() || "",
    getText: () => editor?.getText() || "",
    getWordCount: () => editor?.storage.characterCount.words() || 0,
    getCharacterCount: () => editor?.storage.characterCount.characters() || 0,
  }));

  return (
    <div className="space-y-6 lg:col-span-8">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MenuBar editor={editor} />

            <div className="bg-muted/30 flex min-h-[600px] flex-col rounded-lg border">
              <div className="text-muted-foreground flex-1 text-center">
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Word count display at bottom */}
            {editor && (
              <div className="text-muted-foreground text-right text-sm">
                {editor.storage.characterCount.words()} words,{" "}
                {editor.storage.characterCount.characters()} characters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

NoteEditor.displayName = "NoteEditor";

export default NoteEditor;
