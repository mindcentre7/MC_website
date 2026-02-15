'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, X } from 'lucide-react'; // npm i lucide-react if missing

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

interface FormData {
  title: string;
  slug: string;
  author: string;
  content: string;
  featured_image: string;
  content_images: string[];
  videos: string[];
}

export default function EditBlogPost() {
  // 🐛 FIX 1: Correctly type `params`. It's typically an object where values are string | string[] | undefined.
  // Assuming the route is `[id]`, the id parameter will be a string.
  const params = useParams() as { id: string | string[] | undefined }; 
  const router = useRouter();
  
  // Extract and normalize id for use. We'll use a local const for clarity.
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isNewPost = postId === 'new' || postId === undefined;

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    author: '',
    content: '',
    featured_image: '',
    content_images: [],
    videos: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  // Note: uploadProgress is defined but not updated in the fetch, which is a logic/feature gap, but not a syntax error.
  const [uploadProgress, setUploadProgress] = useState(0); 
  const featuredInputRef = useRef<HTMLInputElement>(null);
  const contentImagesRef = useRef<HTMLInputElement>(null);
  const videosRef = useRef<HTMLInputElement>(null);

  // Load existing post if editing
  useEffect(() => {
    // Use the normalized postId
    if (!isNewPost && postId) { 
      const loadPost = async () => {
        try {
          setIsLoading(true);
          // ⚠️ NOTE: This relies on a static JSON file; in a real app, this would be an API call like `/api/posts/${postId}`
          const response = await fetch('/data/clean-blog-data.json'); 
          if (!response.ok) throw new Error('Failed to fetch blog data');
          
          const allPosts: BlogPost[] = await response.json();
          // The Post ID is stored as a number in the JSON data, so ensure `postId` is converted.
          const post = allPosts.find(p => p.id === Number(postId));
          
          if (post) {
            setFormData({
              title: post.title,
              slug: post.slug,
              author: post.author,
              content: post.content,
              featured_image: post.featured_image || '',
              content_images: Array.isArray(post.content_images) ? post.content_images : [],
              videos: Array.isArray(post.videos) ? post.videos : [],
            });
          } else {
            setError('Post not found');
          }
        } catch (error) {
          console.error('Error loading post:', error);
          // 🐛 FIX 2: Type guard for `error` to access `message`
          setError(`Failed to load post: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadPost();
    } else {
      setIsLoading(false);
    }
    // Depend on postId, not params.id
  }, [postId]); 

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        // The type for [name] is correct in the original code, but explicitly typed here
        [name as keyof FormData]: value, 
      }));
    }
  };

  // Handle array textarea changes
  const handleArrayChange = (
    field: 'videos' | 'content_images',
    value: string
  ) => {
    const array = value
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    setFormData(prev => ({
      ...prev,
      [field]: array,
    }));
  };

  // Remove item from array
  const removeItem = (field: 'content_images' | 'videos', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Update textarea value from array (for preview sync)
  const getArrayValue = (array: string[]) => array.join('\n');

  // Upload file to /api/blog/upload-image (generalized for image/video)
  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file || file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File too large (max 10MB) or invalid.');
      return null;
    }

    // ⚠️ NOTE: FormData constructor for browser-native is used correctly, but type is `window.FormData`.
    // The previous definition of `FormData` interface conflicts with the global type for file uploads.
    // However, TypeScript infers the correct usage based on context (i.e., new FormData() is global).
    const uploadFormData = new window.FormData();
    uploadFormData.append('image', file); // API expects 'image' param; works for video too

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const response = await fetch('/api/blog/upload-image', {
        method: 'POST',
        body: uploadFormData, // Use the file upload FormData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.imagePath; // e.g., /blog_images/filename.ext
    } catch (err) {
      console.error('Upload error:', err);
      // 🐛 FIX 3: Type guard for `err` in catch block
      setError(`Upload failed: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle featured image upload (single file, image/video)
  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    e.preventDefault?.(); // For drop

    let file: File | null = null;
    // Type guards are correct here.
    if ('dataTransfer' in e) {
      // Drop event
      file = (e as React.DragEvent<HTMLDivElement>).dataTransfer.files[0] || null;
    } else {
      // Change event
      file = (e as React.ChangeEvent<HTMLInputElement>).target.files?.[0] || null;
    }

    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      const url = await uploadFile(file);
      if (url) {
        setFormData(prev => ({ ...prev, featured_image: url }));
        setError(''); // Clear any previous error
      }
    } else if (file) {
      setError('Please select an image or video file.');
    }
    // Clear input after use to allow re-uploading the same file (Change event only)
    if ('target' in e && e.target instanceof HTMLInputElement) {
        e.target.value = '';
    }
  };

  // Handle multi-file upload for content images (images only)
  const handleContentImagesUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    e.preventDefault?.();

    let files: FileList | null = null;
    if ('dataTransfer' in e) {
      files = (e as React.DragEvent<HTMLDivElement>).dataTransfer.files;
    } else {
      files = (e as React.ChangeEvent<HTMLInputElement>).target.files;
    }

    if (files) {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const url = await uploadFile(file);
          if (url) newUrls.push(url);
        }
      }
      if (newUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          content_images: [...prev.content_images, ...newUrls],
        }));
        setError('');
      } else if (files.length > 0) {
        setError('Please select image files only.');
      }
    }
    // Clear input after use to allow re-uploading the same file (Change event only)
    if ('target' in e && e.target instanceof HTMLInputElement) {
        e.target.value = '';
    }
  };

  // Handle multi-file upload for videos (videos only)
  const handleVideosUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    e.preventDefault?.();

    let files: FileList | null = null;
    if ('dataTransfer' in e) {
      files = (e as React.DragEvent<HTMLDivElement>).dataTransfer.files;
    } else {
      files = (e as React.ChangeEvent<HTMLInputElement>).target.files;
    }

    if (files) {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('video/')) {
          const url = await uploadFile(file);
          if (url) newUrls.push(url);
        }
      }
      if (newUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          videos: [...prev.videos, ...newUrls],
        }));
        setError('');
      } else if (files.length > 0) {
        setError('Please select video files only (MP4, MOV).');
      }
    }
    // Clear input after use to allow re-uploading the same file (Change event only)
    if ('target' in e && e.target instanceof HTMLInputElement) {
        e.target.value = '';
    }
  };

  // Save post
  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    // Ensure slug is not empty and is safe.
    const safeSlug = generateSlug(formData.slug || formData.title || 'untitled-post');

    setIsSaving(true);
    setError('');

    try {
      // Check if this is a new post or editing existing
      const isNew = isNewPost || !postId;
      
      // For existing posts, preserve the original date
      const postIdAsNumber = isNew ? Date.now() : Number(postId);
      
      // Load existing post to preserve date if editing
      let originalDate = new Date().toISOString();
      let originalDateDisplay = new Date().toLocaleDateString('en-SG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      if (!isNew) {
        try {
          const response = await fetch('/data/clean-blog-data.json');
          const allPosts = await response.json();
          const existingPost = allPosts.find((p: BlogPost) => p.id === Number(postId));
          if (existingPost) {
            originalDate = existingPost.date;
            originalDateDisplay = existingPost.date_display;
          }
        } catch (e) {
          console.log('Could not load original post date');
        }
      }
      
      const newPost: BlogPost = {
        id: postIdAsNumber,
        title: formData.title.trim(),
        slug: safeSlug,
        author: formData.author.trim() || 'Mind Centre Team',
        content: formData.content.trim(),
        featured_image: formData.featured_image.trim() || '',
        content_images: formData.content_images,
        videos: formData.videos,
        url: `/blog/${safeSlug}`,
        date: originalDate,
        date_display: originalDateDisplay,
      };

      // Use old endpoint /api/blog-posts (fixed)
      const response = await fetch('/api/blog-posts', {
        method: 'POST', // Assuming this endpoint handles both POST (new) and PUT/PATCH (edit) via body content
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        router.push('/admin/blog');
        router.refresh(); // Refresh list
      } else {
        // Try to read error message from response body
        const errorData = await response.json().catch(() => ({ message: 'Failed to save post' }));
        setError(errorData.message || `Failed to save post: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      // 🐛 FIX 5: Type guard for `error`
      setError(`Failed to save post: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Drag over handler
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-500">Loading post...</div>
      </div>
    );
  }

  // Use isNewPost for conditional rendering
  const headerText = isNewPost ? 'Create New Post' : 'Edit Post';
  const headerSubText = isNewPost ? 'Fill in the details to create a new blog post' : 'Edit the post details below';
  const saveButtonDisabled = isSaving || !formData.title.trim();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Header (from old) */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {headerText}
              </h1>
              <p className="text-gray-600 mt-1">
                {headerSubText}
              </p>
            </div>
            <Link
              href="/admin/blog"
              className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
            >
              ← Back to Blog Management
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8">
              <div className="font-medium">Error:</div>
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Title (old) */}
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

            {/* Slug (old) */}
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

            {/* Author (old) */}
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

            {/* Featured Image (new upload + old URL input) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image/Video
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors mb-2"
                onDragOver={handleDragOver}
                onDrop={handleFeaturedUpload}
                onClick={() => featuredInputRef.current?.click()}
              >
                {uploading ? (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </div>
                ) : formData.featured_image ? (
                  <div className="space-y-2">
                    {/* Display image or video preview */}
                    {formData.featured_image.match(/\.(mp4|mov|webm)$/i) ? (
                      <video
                        src={formData.featured_image}
                        // alt="Featured Video"
                        className="w-32 h-32 object-cover rounded mx-auto"
                        controls={false}
                      />
                    ) : (
                      <img 
                        src={formData.featured_image} 
                        alt="Featured Image" 
                        className="w-32 h-32 object-cover rounded mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    {formData.featured_image && (
                      <p className="text-sm text-gray-600 break-all">{formData.featured_image}</p>
                    )}
                    {formData.featured_image && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the click from re-triggering the file input
                          setFormData(prev => ({ ...prev, featured_image: '' }));
                        }}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Drag & drop image/video or click</p>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF, MP4, MOV (max 10MB)</p>
                  </div>
                )}
              </div>
              <input
                ref={featuredInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFeaturedUpload}
                className="hidden"
              />
              {/* This input is for manual URL entry */}
              <input
                name="featured_image"
                value={formData.featured_image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Or paste URL: https://example.com/image.jpg"
              />
            </div>

            {/* Content Images (new upload + old textarea + preview list) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Images (one per line)
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors mb-2"
                onDragOver={handleDragOver}
                onDrop={handleContentImagesUpload}
                onClick={() => contentImagesRef.current?.click()}
              >
                {uploading ? (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </div>
                ) : (
                  <div>
                    <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Drag & drop images or click</p>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF (max 10MB each)</p>
                  </div>
                )}
              </div>
              <input
                ref={contentImagesRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleContentImagesUpload}
                className="hidden"
              />
              <textarea
                value={getArrayValue(formData.content_images)}
                onChange={(e) => handleArrayChange('content_images', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono resize-vertical mb-2"
                placeholder="Upload or paste URLs, one per line"
              />
              {/* Preview List */}
              {formData.content_images.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Uploaded Images:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.content_images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Content ${index + 1}`} 
                          className="w-full h-16 object-cover rounded" 
                        />
                        <button
                          onClick={() => removeItem('content_images', index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Videos (new upload + old textarea + preview list) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos (one per line)
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors mb-2"
                onDragOver={handleDragOver}
                onDrop={handleVideosUpload}
                onClick={() => videosRef.current?.click()}
              >
                {uploading ? (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </div>
                ) : (
                  <div>
                    <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Drag & drop videos or click</p>
                    <p className="text-xs text-gray-500">MP4, MOV (max 10MB each)</p>
                  </div>
                )}
              </div>
              <input
                ref={videosRef}
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideosUpload}
                className="hidden"
              />
              <textarea
                value={getArrayValue(formData.videos)}
                onChange={(e) => handleArrayChange('videos', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono resize-vertical mb-2"
                placeholder="Upload or paste URLs, one per line"
              />
              {/* Preview List */}
              {formData.videos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Uploaded Videos:</p>
                  <div className="space-y-2">
                    {formData.videos.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                        <video 
                          src={url} 
                          className="w-16 h-12 object-cover rounded" 
                          controls={false}
                          muted // Good practice for auto-playing previews
                        />
                        <span className="flex-1 truncate text-sm">{url}</span>
                        <button
                          onClick={() => removeItem('videos', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Content (old) */}
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

            {/* Buttons (old) */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={saveButtonDisabled}
                className="flex-1 px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
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
  );
}