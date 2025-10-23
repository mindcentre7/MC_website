
import { Metadata } from 'next'
import { getPostBySlug } from '@/lib/blog'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.',
    }
  }

  const title = post.title
  const description = post.content.replace(/<[^>]*>/g, '').substring(0, 155) + '...'
  const url = `https://www.mindcentre.com.sg/blog/${post.slug}`
  const imageUrl = post.featured_image ? `https://i.ytimg.com/vi/U9J7G8yoc3g/sddefault.jpg` : 'http://uxmovement.com/wp-content/uploads/2018/05/right_centered_left_logo-comparison.png'

  return {
    title,
    description,
    keywords: [
      'serangoon tuition',
      'bedok tuition',
      'bishan tuition',
      'education blog',
      'learning tips',
      'study methods',
      'tuition singapore',
      post.title,
    ],
    authors: [{ name: post.author || 'Mind Centre for Learning' }],
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      siteName: 'Mind Centre for Learning',
      locale: 'en_SG',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@mindcentre',
    },
    alternates: {
      canonical: url,
    },
  }
}
