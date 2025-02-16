import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const { blogSlug, text } = await req.json();

    if (!blogSlug || !text.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newComment = await client.create({
      _type: "comment",
      blogSlug,
      text,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
  }
}
