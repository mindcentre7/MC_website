import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/'],
    },
    // Allow AI crawlers to crawl
    sitemap: 'https://www.mindcentre.com.sg/sitemap.xml',
  }
}
