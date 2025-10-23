
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
function loadBlogData(): BlogPost[] {
  // This function is only called on the server side
  if (typeof window !== 'undefined') {
    // If accidentally called on client, return empty array
    return []
  }
  
  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'public', 'blog-data.json')
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

export function getAllPosts(): BlogPost[] {
  return loadBlogData()
}

export function getLatestPosts(count: number = 6): BlogPost[] {
  return getAllPosts().slice(0, count)
}

export function getRemainingPosts(skip: number = 6): BlogPost[] {
  return getAllPosts().slice(skip)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(post => post.slug === slug)
}

export function getTotalPostsCount(): number {
  return getAllPosts().length
}
