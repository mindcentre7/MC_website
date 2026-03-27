import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  date_display: string;
  author: string;
  content: string;
  featured_image: string;
  content_images: string[];
  videos: string[] | { url: string; title?: string; videoId?: string }[];
  url: string;
}

// Load all posts at build time (static, no fetch)
let allPosts: BlogPost[] = [];
try {
  const filePath = path.join(process.cwd(), 'public', 'data', 'clean-blog-data.json');
  const jsonString = fs.readFileSync(filePath, 'utf8');
  allPosts = JSON.parse(jsonString);
} catch (error) {
  console.error('Error loading clean-blog-data.json:', error);
  allPosts = []; // Fallback empty
}

function getBlogPost(slug: string): BlogPost | null {
  return allPosts.find((p) => p.slug === slug) || null;
}

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
        <Link href="/blog" className="text-purple-600 hover:text-purple-800 font-medium text-sm">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  // Handle both string[] and object[] for videos
  const getVideoUrl = (video: string | { url: string; title?: string; videoId?: string }): string => {
    if (typeof video === 'string') return video;
    return video.url || '#';
  };

  const getVideoDisplay = (video: string | { url: string; title?: string; videoId?: string }): string => {
    if (typeof video === 'string') return video;
    return video.title || video.url || 'Video';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium mb-8"
        >
          ← Back to Blog
        </Link>

        {post.featured_image && (
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.featured_image}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-64 md:h-96 object-cover"
              priority
            />
          </div>
        )}

        <article>
          <header className="mb-8">
            <div className="text-sm text-gray-500 mb-4">
              {post.date_display} • {post.author}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
          </header>

          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.videos && post.videos.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Videos</h2>
              <ul className="space-y-4">
                {post.videos.map((video, index) => (
                  <li key={index} className="border rounded-lg p-4 hover:shadow-md transition-all">
                    <a
                      href={getVideoUrl(video)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 font-medium block"
                    >
                      📺 {getVideoDisplay(video)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        <div className="pt-12 border-t">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}