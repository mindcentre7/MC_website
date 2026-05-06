import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.mindcentre.com.sg'
  
  // Base routes
  const routes = [
    '',
    '/about',
    '/teachers',
    '/testimonials',
    '/results',
    '/learning-system',
    '/schedules',
    '/franchising',
    '/contact',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
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
