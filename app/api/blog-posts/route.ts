import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const post = await request.json();

    if (!post.title || !post.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "data", "clean-blog-data.json");
    let allPosts: any[] = [];

    try {
      const fileContent = await readFile(filePath, "utf-8");
      allPosts = JSON.parse(fileContent);
    } catch (error) {
      allPosts = [];
    }

    const isEditing = allPosts.some((p: any) => p.id === post.id);
    
    if (isEditing) {
      allPosts = allPosts.map((p: any) =>
        p.id === post.id ? { ...post, id: Number(post.id) } : p
      );
    } else {
      allPosts.unshift({ ...post, id: Number(post.id) });
    }

    await writeFile(filePath, JSON.stringify(allPosts, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save post error:", error);
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}
