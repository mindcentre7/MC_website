import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { SITE_URL } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  
  // Base routes
  const routes = [
    { path: '', priority: 1 as const },
    { path: '/serangoon-tuition', priority: 0.95 as const },
    { path: '/about', priority: 0.8 as const },
    { path: '/teachers', priority: 0.8 as const },
    { path: '/testimonials', priority: 0.8 as const },
    { path: '/results', priority: 0.8 as const },
    { path: '/learning-system', priority: 0.8 as const },
    { path: '/schedules', priority: 0.8 as const },
    { path: '/enroll', priority: 0.85 as const },
    { path: '/franchising', priority: 0.8 as const },
    { path: '/contact', priority: 0.8 as const },
    { path: '/blog', priority: 0.8 as const },
  ].map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority,
  }))

  // Blog posts — try Blobs first, then filesystem
  let posts: any[] = [];
  try {
    const blobs = await import('@netlify/blobs')
    const store = blobs.getStore('site-content')
    const blob = await store.get('data/clean-blog-data.json', { type: 'json' })
    if (blob) {
      posts = blob as any[]
    }
  } catch {
    // Blobs not available — fall through to filesystem
  }

  if (posts.length === 0) {
    try {
      const dataPath = path.join(process.cwd(), 'public', 'data', 'clean-blog-data.json')
      const fileContents = fs.readFileSync(dataPath, 'utf8')
      posts = JSON.parse(fileContents)
    } catch (error) {
      console.error('Error generating sitemap for blog posts:', error)
    }
  }

  const blogRoutes = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...routes, ...blogRoutes]
}
