import { NextResponse } from "next/server";
import { parseToText } from "@/utils/tiptap/parseToText";

export async function GET() {
  const json = {
    type: "doc",
    content: [
      {
        type: "heading",
        content: [{ type: "text", text: "The Hidden Kingdom of Fungi" }],
      },
      { type: "paragraph" },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "Fungi" },
          {
            type: "text",
            text: " represent a vast and diverse group of eukaryotic organisms that include microorganisms such as yeasts and molds, as well as the more familiar mushrooms. Though often mistaken for plants, fungi belong to their own distinct kingdom, separate from plants, animals, and protists. They are characterized by a unique mode of nutrition: unlike plants, which produce their own food through photosynthesis, and animals, which ingest food, fungi are heterotrophic and obtain nutrients by ",
          },
          {
            type: "text",
            marks: [{ type: "bold" }],
            text: "absorbing dissolved molecules",
          },
          {
            type: "text",
            text: ", typically by secreting digestive enzymes into their environment.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The body of a fungus typically consists of a network of tiny, thread-like structures called ",
          },
          { type: "text", marks: [{ type: "bold" }], text: "hyphae" },
          {
            type: "text",
            text: ". These hyphae grow and branch out, forming a tangled mass known as a ",
          },
          { type: "text", marks: [{ type: "bold" }], text: "mycelium" },
          {
            type: "text",
            text: ". The visible part of many fungi, like a mushroom, is merely the fruiting body, responsible for reproduction by producing ",
          },
          { type: "text", marks: [{ type: "bold" }], text: "spores" },
          {
            type: "text",
            text: ". These spores are remarkable, capable of surviving harsh conditions and dispersing over vast distances, allowing fungi to colonize new environments.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Fungi play absolutely critical roles in ecosystems. They are the primary ",
          },
          { type: "text", marks: [{ type: "bold" }], text: "decomposers" },
          {
            type: "text",
            text: " in many terrestrial environments, breaking down dead organic matter and recycling essential nutrients like carbon and nitrogen back into the soil, making them available for plants. Without fungi, the Earth would be buried under layers of dead leaves and wood. ",
          },
          {
            type: "text",
            marks: [{ type: "highlight" }],
            text: "Mycorrhizal fungi form symbiotic relationships",
          },
          {
            type: "text",
            text: " with the roots of about 90% of all plant species, enhancing the plant's ability to absorb water and nutrients from the soil in exchange for sugars produced by the plant through photosynthesis. This mutualistic relationship is vital for the health and growth of forests and grasslands worldwide.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Beyond their ecological importance, fungi have significant economic and medical impacts. ",
          },
          { type: "text", marks: [{ type: "bold" }], text: "Yeasts" },
          {
            type: "text",
            text: ", a type of single-celled fungus, are indispensable in baking (causing dough to rise) and brewing (fermenting sugars into alcohol). Various fungi are used in the production of ",
          },
          { type: "text", marks: [{ type: "bold" }], text: "antibiotics" },
          {
            type: "text",
            text: ", most famously Penicillium, which yields penicillin, revolutionizing modern medicine. Some fungi are directly consumed as food, such as cultivated mushrooms (e.g., button, shiitake, oyster) and truffles. However, it's also important to note that some fungi can be pathogenic, causing diseases in plants (like rusts and smuts) or animals, including humans (e.g., athlete's foot, ringworm, candidiasis). The study of fungi is known as ",
          },
          { type: "text", marks: [{ type: "bold" }], text: "mycology" },
          { type: "text", text: "." },
        ],
      },
    ],
  };

  const text = parseToText(json);
  return NextResponse.json({ text });
}
