export interface ExtractedText {
  text: string;
  pageCount: number;
  title?: string;
}

export async function extractTextFromPDF(file: File): Promise<ExtractedText> {
  // Only run in browser environment
  if (typeof window === "undefined") {
    throw new Error("PDF extraction can only be performed in the browser");
  }

  try {
    // Dynamic import to prevent server-side execution
    const pdfjsLib = await import("pdfjs-dist");

    // Set the worker source to use local file
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/js/pdf.worker.js";
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    const pageCount = pdf.numPages;

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine all text items from the page
      const pageText = textContent.items.map((item: any) => item.str).join(" ");

      fullText += pageText + "\n\n";
    }

    // Clean up the text
    fullText = fullText
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n\n")
      .trim();

    // Get document metadata for title
    try {
      const metadata = await pdf.getMetadata();
      const title =
        (metadata.info as any)?.Title || file.name.replace(".pdf", "");

      return {
        text: fullText,
        pageCount,
        title,
      };
    } catch (metadataError) {
      // If metadata fails, continue without it
      return {
        text: fullText,
        pageCount,
        title: file.name.replace(".pdf", ""),
      };
    }
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(
      "Failed to extract text from PDF. Please make sure the file is a valid PDF.",
    );
  }
}
