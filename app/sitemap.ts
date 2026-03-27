import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Blog posts
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'clean-blog-data.json')
    const fileContents = fs.readFileSync(dataPath, 'utf8')
    const posts = JSON.parse(fileContents)

    const blogRoutes = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...routes, ...blogRoutes]
  } catch (error) {
    console.error('Error generating sitemap for blog posts:', error)
    return routes
  }
}
