"use client";

import { forwardRef, useImperativeHandle, useEffect, useMemo } from "react";
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
    // Memoize extensions to prevent recreation on every render
    const extensions = useMemo(
      () => [
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
      [],
    );

    const editor = useEditor({
      extensions,
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
      // Add performance optimizations
      enableInputRules: true,
      enablePasteRules: true,
      enableCoreExtensions: true,
    });

    // Handle initial content loading with debouncing
    useEffect(() => {
      if (editor && initialContent) {
        // Use requestAnimationFrame to defer content setting
        requestAnimationFrame(() => {
          editor.commands.setContent(initialContent);
          onReady?.();
        });
      }
    }, [editor, initialContent, onReady]);

    useImperativeHandle(ref, () => ({
      getJSON: () => editor?.getJSON(),
      getHTML: () => editor?.getHTML() || "",
      getText: () => editor?.getText() || "",
      getWordCount: () => editor?.storage.characterCount.words() || 0,
      getCharacterCount: () => editor?.storage.characterCount.characters() || 0,
      setContent: (content: any) => {
        if (editor) {
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
            <div className="mb-4 flex-shrink-0">
              <MenuBar editor={editor} />
            </div>

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
