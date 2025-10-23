'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface BlogPost {
  id: number
  slug: string
  title: string
  date: string
  date_display: string
  author: string
  content: string
  featured_image: string
  content_images: string[]
  videos: string[]
  url: string
}

interface FormData {
  title: string
  slug: string
  author: string
  content: string
  featured_image: string
  content_images: string[]
  videos: string[]
}

export default function EditBlogPost() {
  const params = useParams()
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    author: '',
    content: '',
    featured_image: '',
    content_images: [],
    videos: [],
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // ✅ LOAD EXISTING POST DATA
  useEffect(() => {
    if (params.id !== 'new') {
      const loadPost = async () => {
        try {
          setIsLoading(true)
          const response = await fetch('/data/clean-blog-data.json')
          if (!response.ok) throw new Error('Failed to fetch blog data')
          
          const allPosts: BlogPost[] = await response.json()
          const post = allPosts.find(p => p.id === Number(params.id))
          
          if (post) {
            setFormData({
              title: post.title,
              slug: post.slug,
              author: post.author,
              content: post.content,
              featured_image: post.featured_image || '',
              content_images: Array.isArray(post.content_images) ? post.content_images : [],
              videos: Array.isArray(post.videos) ? post.videos : [],
            })
          } else {
            setError('Post not found')
          }
        } catch (error) {
          console.error('Error loading post:', error)
          setError('Failed to load post')
        } finally {
          setIsLoading(false)
        }
      }
      
      loadPost()
    } else {
      setIsLoading(false)
    }
  }, [params.id])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    
    // Handle regular text inputs
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      // Generate safe slug
      const safeSlug = formData.slug && formData.slug.trim()
        ? formData.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^[-]+|[-]+$/g, '')
        : (formData.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^[-]+|[-]+$/g, '')

      const newPost: BlogPost = {
        id: params.id === 'new' ? Date.now() : Number(params.id),
        title: formData.title.trim(),
        slug: safeSlug,
        author: formData.author.trim() || 'Mind Centre Team',
        content: formData.content.trim(),
        featured_image: formData.featured_image.trim() || '',
        content_images: formData.content_images,
        videos: formData.videos,
        url: `/blog/${safeSlug}`,
        date: new Date().toISOString(),
        date_display: new Date().toLocaleDateString('en-SG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }

      const response = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      })

      if (response.ok) {
        router.push('/admin/blog')
        router.refresh()
      } else {
        setError('Failed to save post')
      }
    } catch (error) {
      console.error('Save error:', error)
      setError('Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle array textarea changes
  const handleArrayChange = (
    field: 'videos' | 'content_images',
    value: string
  ) => {
    const array = value
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0)
    
    setFormData(prev => ({
      ...prev,
      [field]: array,
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-500">Loading post...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {params.id === 'new' ? 'Create New Post' : 'Edit Post'}
              </h1>
              <p className="text-gray-600 mt-1">
                {params.id === 'new' 
                  ? 'Fill in the details to create a new blog post'
                  : 'Edit the post details below'
                }
              </p>
            </div>
            <Link
              href="/admin/blog"
              className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
            >
              ← Back to Blog Management
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8">
              <div className="font-medium">Error:</div>
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (optional)
              </label>
              <input
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Will be auto-generated from title"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image URL
              </label>
              <input
                name="featured_image"
                value={formData.featured_image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Videos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos (one per line)
              </label>
              <textarea
                value={formData.videos.join('\n')}
                onChange={(e) => handleArrayChange('videos', e.target.value)}
                rows={4}
                placeholder="Paste YouTube URLs or video links, one per line
https://youtube.com/watch?v=abc123
https://youtube.com/watch?v=def456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono resize-vertical"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter YouTube URLs or embed links (one per line)
              </p>
            </div>

            {/* Content Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Images (one per line)
              </label>
              <textarea
                value={formData.content_images.join('\n')}
                onChange={(e) => handleArrayChange('content_images', e.target.value)}
                rows={3}
                placeholder="Enter image URLs, one per line
https://example.com/image1.jpg
https://example.com/image2.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono resize-vertical"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter image URLs for post content (one per line)
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono resize-vertical"
                placeholder="Write your blog post content here..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving || !formData.title.trim()}
                className="flex-1 px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  'Save Post'
                )}
              </button>
              <Link
                href="/admin/blog"
                className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 flex items-center justify-center transition-all"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}