// lib/tiptap/parseToText.ts

import { htmlToText } from "html-to-text";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";

// Match the client-side editor's extensions
const extensions = [
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
];

export function parseToText(tiptapJson: any): string {
  const html = generateHTML(tiptapJson, extensions);
  const plain = htmlToText(html, {
    wordwrap: false,
    selectors: [{ selector: "a", options: { ignoreHref: true } }],
  });

  return plain.trim();
}
