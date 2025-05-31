"use client";

import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { Card, CardTitle, CardContent, CardHeader } from "../ui/card";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";

export interface NoteEditorRef {
  getJSON: () => any;
  getHTML: () => string;
  getText: () => string;
  getWordCount: () => number;
  getCharacterCount: () => number;
  setContent: (content: any) => void;
}

interface NoteEditorProps {
  initialContent?: any;
  onReady?: () => void;
}

const NoteEditor = forwardRef<NoteEditorRef, NoteEditorProps>(
  ({ initialContent, onReady }, ref) => {
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
      content: initialContent || "<p>Enter note content here!</p>",
      autofocus: true,
      editable: true,
      injectCSS: false,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm m-0 p-4 focus:outline-none max-w-none min-h-full",
        },
      },
      onCreate: ({ editor }) => {
        // Editor is ready
        console.log("Editor created and ready");
        onReady?.();
      },
    });

    // Handle initial content loading
    useEffect(() => {
      if (editor && initialContent) {
        console.log("Setting initial content in editor:", initialContent);
        editor.commands.setContent(initialContent);
      }
    }, [editor, initialContent]);

    useImperativeHandle(ref, () => ({
      getJSON: () => editor?.getJSON(),
      getHTML: () => editor?.getHTML() || "",
      getText: () => editor?.getText() || "",
      getWordCount: () => editor?.storage.characterCount.words() || 0,
      getCharacterCount: () => editor?.storage.characterCount.characters() || 0,
      setContent: (content: any) => {
        if (editor) {
          console.log("Setting content via ref:", content);
          editor.commands.setContent(content);
        }
      },
    }));

    return (
      <div className="space-y-6 lg:col-span-8">
        <Card className="flex h-[600px] flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center justify-between">
              <span>Content</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col overflow-hidden p-4">
            {/* MenuBar at the top */}
            <div className="mb-4 flex-shrink-0">
              <MenuBar editor={editor} />
            </div>

            {/* Scrollable editor content */}
            <div className="bg-muted/30 flex flex-1 flex-col overflow-hidden rounded-lg border">
              <div className="flex-1 overflow-y-auto">
                <div className="h-full">
                  <EditorContent
                    editor={editor}
                    className="h-full [&_.ProseMirror]:h-full [&_.ProseMirror]:min-h-full"
                  />
                </div>
              </div>
            </div>

            {/* Word count display at bottom with white background */}
            {editor && (
              <div className="text-muted-foreground mt-4 flex-shrink-0 rounded-b-lg border-t border-r border-b border-l bg-white px-3 py-2 text-right text-sm">
                {editor.storage.characterCount.words()} words,{" "}
                {editor.storage.characterCount.characters()} characters
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  },
);

NoteEditor.displayName = "NoteEditor";

export default NoteEditor;
