import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const filePath = url.searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ error: 'Path required' }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), filePath);
    const content = await readFile(fullPath, 'utf-8');
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Read error:', error);
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { path: filePath, content } = await request.json();

    if (!filePath || !content) {
      return NextResponse.json({ error: 'Path and content required' }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), filePath);
    await writeFile(fullPath, content, 'utf-8');
    
    return NextResponse.json({ message: 'File saved successfully' });
  } catch (error) {
    console.error('Write error:', error);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}
