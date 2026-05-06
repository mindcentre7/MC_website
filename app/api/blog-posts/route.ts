import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Helper: load all posts from Blobs first, then filesystem
async function loadAllPosts(): Promise<any[]> {
  // Try Netlify Blobs first (production)
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('site-content');
    const blob = await store.get('data/clean-blog-data.json', { type: 'json' });
    if (blob && Array.isArray(blob)) {
      return blob;
    }
  } catch {
    // Blobs not available — fall through to filesystem
  }

  // Fallback: read from filesystem (local dev / build)
  try {
    const filePath = path.join(process.cwd(), "public", "data", "clean-blog-data.json");
    const fileContent = await readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const posts = await loadAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Read blog data error:", error);
    return NextResponse.json({ error: "Failed to read blog data" }, { status: 500 });
  }
}

// Temporary fix endpoint — removes "aaa-" prefix from slugs
export async function PUT() {
  try {
    const posts = await loadAllPosts();
    let fixed = 0;
    for (const post of posts) {
      if (post.slug && post.slug.startsWith('aaa-')) {
        const oldSlug = post.slug;
        post.slug = post.slug.slice(4);
        console.log(`Fixed slug: "${oldSlug}" → "${post.slug}"`);
        fixed++;
      }
    }
    if (fixed > 0) {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('site-content');
      await store.setJSON('data/clean-blog-data.json', posts);
    }
    return NextResponse.json({ fixed });
  } catch (error) {
    console.error("Fix slugs error:", error);
    return NextResponse.json({ error: "Fix failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const post = await request.json();

    if (!post.title || !post.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    // Load existing posts (Blobs-first, fs fallback)
    let allPosts = await loadAllPosts();

    const isEditing = allPosts.some((p: any) => p.id === post.id);
    
    if (isEditing) {
      allPosts = allPosts.map((p: any) =>
        p.id === post.id ? { ...post, id: Number(post.id) } : p
      );
    } else {
      allPosts.unshift({ ...post, id: Number(post.id) });
    }

    // Save to Netlify Blobs (production)
    try {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('site-content');
      await store.setJSON('data/clean-blog-data.json', allPosts);
    } catch {
      // Blobs not available — write to filesystem (local dev)
      const filePath = path.join(process.cwd(), "public", "data", "clean-blog-data.json");
      const { writeFile } = await import("fs/promises");
      await writeFile(filePath, JSON.stringify(allPosts, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save post error:", error);
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}
