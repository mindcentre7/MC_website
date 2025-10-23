import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const newPost = await request.json();

    if (!newPost.id || !newPost.slug || !newPost.title) {
      return NextResponse.json({ error: 'Invalid post data' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'data', 'clean-blog-data.json');
    
    let allPosts: any[] = [];
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      allPosts = JSON.parse(fileContent);
    } catch (error) {
      console.log('Creating new blog data file');
      allPosts = [];
    }

    // Remove existing post with same ID
    const updatedPosts = allPosts.filter((post) => post.id !== newPost.id);
    updatedPosts.push(newPost);

    // Sort by date descending
    updatedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Ensure data directory exists (Node.js fs)
    const dataDir = path.join(process.cwd(), 'public', 'data');
    try {
      await mkdir(dataDir, { recursive: true });
    } catch (error) {
      // Directory likely exists, ignore error
    }

    await writeFile(filePath, JSON.stringify(updatedPosts, null, 2), 'utf-8');

    console.log(`Post ${newPost.id} saved successfully`);
    return NextResponse.json({ message: 'Post saved successfully' });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}