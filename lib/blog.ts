
import * as fs from 'fs'
import * as path from 'path'

export interface VideoInfo {
  url: string
  title?: string
  videoId?: string
}

export interface BlogPost {
  id: number
  slug: string
  title: string
  date: string
  date_display: string
  author: string
  content: string
  featured_image: string | null
  content_images: Array<{
    original_url: string
    local_path: string
  }>
  videos: (string | VideoInfo)[]
  url: string
}

// Helper function to load blog data dynamically (server-side only)
async function loadBlogData(): Promise<BlogPost[]> {
  // This function is only called on the server side
  if (typeof window !== 'undefined') {
    return []
  }
  
  // Try Netlify Blobs first (production)
  try {
    const blobs = await import('@netlify/blobs')
    const store = blobs.getStore('site-content')
    const blob = await store.get('data/clean-blog-data.json', { type: 'json' })
    if (blob) {
      return blob as BlogPost[]
    }
  } catch {
    // Blobs not available — fall through to filesystem
  }

  // Fallback: read from filesystem (local dev)
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'clean-blog-data.json')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent) as BlogPost[]
  } catch (error) {
    console.error('Error loading blog data:', error)
    return []
  }
}

// Helper function to convert YouTube URL to embed URL
export function getYouTubeEmbedUrl(video: string | VideoInfo): string | null {
  let url: string
  
  if (typeof video === 'string') {
    url = video
  } else if (video.url) {
    url = video.url
  } else {
    return null
  }
  
  // If already an embed URL, return it
  if (url.includes('youtube.com/embed/')) {
    return url
  }
  
  // Extract video ID from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
  }
  
  return null
}

// Helper function to get video title
export function getVideoTitle(video: string | VideoInfo, index: number): string {
  if (typeof video === 'object' && video.title && video.title !== 'YouTube video player') {
    return video.title
  }
  return `Video ${index + 1}`
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const data = await loadBlogData()
  return data
}

export async function getLatestPosts(count: number = 6): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.slice(0, count)
}

export async function getRemainingPosts(skip: number = 6): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.slice(skip)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllPosts()
  return posts.find(post => post.slug === slug)
}

export async function getTotalPostsCount(): Promise<number> {
  const posts = await getAllPosts()
  return posts.length
}
