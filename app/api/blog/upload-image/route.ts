import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // The name 'image' is used here, but it accepts any file as per the frontend code.
    const file = formData.get('image') as File; 

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 🛠️ FIX: Update validation to allow both 'image/' and 'video/' file types.
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be an image or video.' }, 
        { status: 400 }
      );
    }
    // ----------------------------------------------------------------------

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create blog_images directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'blog_images');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    // 💡 Improvement: Create a clean, slug-like filename from the original name
    const originalName = path.parse(file.name).name;
    const slugifiedName = originalName.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const ext = path.extname(file.name);
    // Use slugified name + timestamp for better SEO/caching management
    const filename = `${slugifiedName.substring(0, 30)}-${timestamp}${ext}`; 
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const imagePath = `/blog_images/${filename}`;

    // 💡 Improvement: Return the type to potentially help the frontend later
    return NextResponse.json({ 
      imagePath,
      fileType: file.type, 
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed on server' }, { status: 500 });
  }
}