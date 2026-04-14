import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params
  const filePath = pathSegments.join('/')

  // Try Netlify Blobs first (production)
  try {
    const { getStore } = await import('@netlify/blobs')
    const store = getStore('site-content')
    const blob = await store.get(filePath, { type: 'json' })
    if (blob) {
      return NextResponse.json(blob)
    }
  } catch {
    // Blobs not available (local dev) — fall through to filesystem
  }

  // Fallback: read from static files
  try {
    const fullPath = path.join(process.cwd(), 'public', 'content', filePath)
    const data = fs.readFileSync(fullPath, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (e) {
    return NextResponse.json(
      { error: 'Content not found' },
      { status: 404 }
    )
  }
}
