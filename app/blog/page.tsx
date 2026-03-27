import Link from 'next/link';
import Image from 'next/image';
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
  videos: string[];
  url: string;
}

// Load all posts at build time (static, no fetch)
let allPosts: BlogPost[] = [];

// Helper to normalize dates - handle both ISO strings and plain "YYYY-MM-DD"
const normalizeDate = (dateStr: string): number => {
  if (!dateStr) return 0;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? 0 : date.getTime();
};

try {
  const filePath = path.join(process.cwd(), 'public', 'data', 'clean-blog-data.json');
  const jsonString = fs.readFileSync(filePath, 'utf8');
  allPosts = JSON.parse(jsonString).sort(
    (a: BlogPost, b: BlogPost) => normalizeDate(b.date) - normalizeDate(a.date)
  );
  console.log('Blog posts loaded from clean-blog-data.json:', allPosts.length, allPosts);
} catch (error) {
  console.error('Error loading clean-blog-data.json:', error);
  allPosts = []; // Fallback empty
}

export const metadata = {
  title: 'Tuition Blog & Education Articles | Mind Centre Singapore',
  description: 'Read the latest insights, study tips, and education news from Mind Centre for Learning. Covering PSLE, O-Level, and A-Level strategies.',
  keywords: ['singapore education blog', 'psle study tips', 'o level revision', 'tuition center news']
};

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Posts</h1>
        <p className="text-xl text-gray-600">Latest insights, tips, and updates from Mind Centre</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            {post.featured_image && (
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-6">
              <div className="text-sm text-gray-500 mb-2">{post.date_display}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
              </p>
              <Link
                href={post.url || `/blog/${post.slug}`}
                className="text-purple-600 hover:text-purple-800 font-medium text-sm"
              >
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {allPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blog posts available yet.</p>
        </div>
      )}
    </div>
  );
}