
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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
      
      // Purge CDN cache + Next.js ISR cache so pages reflect changes immediately
      try {
        const siteId = process.env.NETLIFY_SITE_ID || '8aa0a17d-0f0d-469b-be6b-ee9d66dffc53'
        const authToken = process.env.NETLIFY_AUTH_TOKEN
        if (authToken) {
          await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/purge`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ paths: ['/'] })
          })
        }
        // Also trigger Next.js on-demand ISR revalidation
        revalidatePath('/', 'layout')
        if (filePath === 'home.json') revalidatePath('/')
        if (filePath === 'about.json') revalidatePath('/about')
        if (filePath === 'contact.json') revalidatePath('/contact')
      } catch { /* non-critical */ }
      
      return NextResponse.json({ 
        success: true, 
        storage: 'blobs',
        verified 
      })
    } catch {
      // Blobs not available (local dev) — fall back to filesystem
    }

    // Fallback: write to filesystem (local dev)
    // Strip 'content/' prefix if present (same convention as get-content)
    const contentPath = filePath.startsWith('content/') ? filePath.replace('content/', '') : filePath
    const fullPath = path.join(process.cwd(), 'public', 'content', contentPath)
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
