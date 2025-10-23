import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'data', 'clean-blog-data.json');
    
    let allPosts: any[] = [];
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      allPosts = JSON.parse(fileContent);
    } catch (error) {
      return NextResponse.json({ error: 'No blog data found' }, { status: 404 });
    }

    const updatedPosts = allPosts.filter((post) => post.id !== id);

    await writeFile(filePath, JSON.stringify(updatedPosts, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}