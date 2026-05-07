
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
      const payload = JSON.stringify(content)
      
      // Write to Blobs
      await store.set(filePath, payload)
      
      // Verify write persists (Blobs has eventual consistency — up to 30s propagation)
      // Retry read with backoff until data matches what we wrote
      let verified = false
      for (let attempt = 0; attempt < 8; attempt++) {
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000)))
        }
        try {
          const blob = await store.get(filePath, { type: 'text' })
          if (blob === payload) {
            verified = true
            break
          }
        } catch {
          // Retry on read errors
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        storage: 'blobs',
        verified 
      })
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
