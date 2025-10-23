
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { path: filePath, content } = await request.json()

    if (!filePath || !content) {
      return NextResponse.json(
        { error: 'Missing path or content' },
        { status: 400 }
      )
    }

    // Determine the correct directory
    let fullPath: string
    if (filePath === 'blog-data.json') {
      fullPath = path.join(process.cwd(), 'public', filePath)
    } else {
      fullPath = path.join(process.cwd(), 'public', 'content', filePath)
    }

    // Write the file
    await fs.writeFile(fullPath, JSON.stringify(content, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json(
      { error: 'Failed to save file' },
      { status: 500 }
    )
  }
}
