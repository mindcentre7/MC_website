import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    // Try Netlify Blobs first (production)
    try {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('site-content');
      const blob = await store.get('data/clean-blog-data.json', { type: 'json' });
      if (blob) {
        return NextResponse.json(blob);
      }
    } catch {
      // Blobs not available — fall through to filesystem
    }

    // Fallback: read from filesystem
    const filePath = path.join(process.cwd(), "public", "data", "clean-blog-data.json");
    const fileContent = await readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error) {
    console.error("Read blog data error:", error);
    return NextResponse.json({ error: "Failed to read blog data" }, { status: 500 });
  }
}

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

    // Try Netlify Blobs first (production)
    let savedToBlobs = false;
    try {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('site-content');
      await store.setJSON('data/clean-blog-data.json', allPosts);
      savedToBlobs = true;
    } catch {
      // Blobs not available — fall through to filesystem
    }

    // Fallback: write to filesystem (local dev)
    if (!savedToBlobs) {
      await writeFile(filePath, JSON.stringify(allPosts, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save post error:", error);
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}
