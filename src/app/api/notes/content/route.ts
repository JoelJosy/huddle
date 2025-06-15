import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentUrl = searchParams.get("url");

    if (!contentUrl) {
      return NextResponse.json(
        { error: "Content URL is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get the current user for authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    try {
      const { data, error } = await supabase.storage
        .from("note-contents")
        .download(contentUrl);

      if (error) {
        console.error("Error fetching note content:", error);
        return NextResponse.json(
          { error: "Failed to fetch note content" },
          { status: 404 },
        );
      }

      const content = await data.text();
      const parsedContent = JSON.parse(content);

      return NextResponse.json(
        { content: parsedContent },
        {
          headers: {
            "Cache-Control":
              "public, s-maxage=1800, stale-while-revalidate=3600",
          },
        },
      );
    } catch (parseError) {
      console.error("Error parsing note content:", parseError);
      return NextResponse.json(
        { error: "Invalid content format" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Unexpected error in note content API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
