
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

    // Try Netlify Blobs first (production)
    try {
      const { getStore } = await import('@netlify/blobs')
      const store = getStore('site-content')
      // Use set() instead of setJSON() — setJSON has an overwrite bug
      // where it silently fails to update existing keys
      await store.set(filePath, JSON.stringify(content))
      return NextResponse.json({ success: true, storage: 'blobs' })
    } catch {
      // Blobs not available (local dev) — fall back to filesystem
    }

    // Fallback: write to filesystem (local dev)
    const fullPath = path.join(process.cwd(), 'public', 'content', filePath)
    await fs.writeFile(fullPath, JSON.stringify(content, null, 2), 'utf-8')
    return NextResponse.json({ success: true, storage: 'filesystem' })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json(
      { error: 'Failed to save file' },
      { status: 500 }
    )
  }
}
