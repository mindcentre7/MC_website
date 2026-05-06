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

export async function GET(request: NextRequest) {
  // One-time: strip HTML from all posts when ?strip=html
  if (request.nextUrl.searchParams.get('strip') === 'html') {
    try {
      const posts = await loadAllPosts();
      let count = 0;
      for (const post of posts) {
        if (/<[^>]+>/.test(post.content)) {
          post.content = post.content.replace(/<[^>]*>/g, '')
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>').replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'");
          count++;
        }
      }
      if (count > 0) {
        const { getStore } = await import('@netlify/blobs');
        const store = getStore('site-content');
        await store.setJSON('data/clean-blog-data.json', posts);
      }
      return NextResponse.json({ stripped: count, total: posts.length });
    } catch (error) {
      console.error("Strip HTML error:", error);
      return NextResponse.json({ error: "Strip failed" }, { status: 500 });
    }
  }

  try {
    const posts = await loadAllPosts();
    return NextResponse.json(posts);
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
