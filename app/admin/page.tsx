'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw, FileText, AlertCircle, CheckCircle, BookOpen, ArrowRight, Lock, Eye, EyeOff, Edit3, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

interface ContentFile {
  name: string
  path: string
  description: string
  previewUrl: string
  isCode?: boolean
}

interface HeaderData {
  logo: string
  title: string
  tagline: string
  promoText1: string
  promoText2: string
  promoText3: string
  facebookUrl: string
  twitterUrl: string
  instagramUrl: string
}

const contentFiles: ContentFile[] = [
  { name: 'Home Page', path: 'home.json', description: 'Hero section, promotional banners, and why choose us', previewUrl: '/' },
  { name: 'Contact Information', path: 'contact.json', description: 'Branch addresses, phone numbers, operating hours', previewUrl: '/contact' },
  { name: 'WhatsApp Widget', path: 'whatsapp.json', description: 'WhatsApp chat representatives, phone numbers, and messages', previewUrl: '/' },
  { name: 'Site Settings', path: 'site-settings.json', description: 'Logo, social media links, colors, SEO settings', previewUrl: '/' },
  { name: 'About Us', path: 'about.json', description: 'Mission, vision, values, achievements, founders background', previewUrl: '/about-us' },
  { name: 'Results & More Testimonials', path: 'results.json', description: 'Exam results PDFs and testimonials link', previewUrl: '/results' },
  { name: 'Class Schedules', path: 'schedules.json', description: 'Class schedule PDFs for Serangoon and Bedok locations', previewUrl: '/schedules' },
  { name: 'Franchising', path: 'franchising.json', description: 'Franchising opportunity information and contact details', previewUrl: '/franchising' },
  { name: 'Our Learning System', path: 'learning-system.json', description: 'MIND system components, key elements, and exam preparation', previewUrl: '/our-learning-system' },
  { name: 'Teachers\' Profiles', path: 'teachers.json', description: 'Teacher profiles, qualifications, and experience', previewUrl: '/teachers' },
  { name: 'More Testimonials', path: 'testimonials.json', description: 'Additional student success stories and testimonials', previewUrl: '/testimonials' },
  { name: 'Header Settings', path: 'header.json', description: 'Header text, logo path, promotional messages', previewUrl: '/', isCode: false },
  { name: 'Footer Settings', path: 'footer.json', description: 'Footer links, social media URLs, contact button', previewUrl: '/', isCode: false },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [selectedFile, setSelectedFile] = useState<ContentFile | null>(null)
  const [content, setContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [headerData, setHeaderData] = useState<HeaderData>({
    logo: '/images/logo.jpg',
    title: 'Mind Centre for Learning',
    tagline: 'Go for A\'s and Multiple Grade Improvements!',
    promoText1: 'Are you struggling with your studies? Learn our proven Fast & Systematic study methodologies which have helped many students excel!',
    promoText2: 'Go to www.mindcentre.site to secure our special promotion - Buy 1 Get 1 class free for a new subject!',
    promoText3: 'RECOMMEND A FRIEND and BOTH OF YOU will get a Special $10 discount when he/she signs up for a term!',
    facebookUrl: 'https://www.facebook.com/mindcentre',
    twitterUrl: 'https://x.com/Mindcentre7',
    instagramUrl: 'https://www.instagram.com/mindcentreforlearning/',
  })

  useEffect(() => {
    const token = localStorage.getItem('admin-auth')
    if (token === process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '13165'
    
    if (password === expectedPassword) {
      const token = btoa(password + Date.now().toString())
      localStorage.setItem('admin-auth', token)
      setIsAuthenticated(true)
      setAuthError(false)
    } else {
      setAuthError(true)
      setPassword('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-auth')
    setIsAuthenticated(false)
    setPassword('')
    setSelectedFile(null)
    setContent('')
  }

// Replace ONLY the loadFile function with this DEBUG VERSION:
const loadFile = async (file: ContentFile) => {
  setIsLoading(true)
  setMessage(null)
  try {
    console.log('Loading file:', file.path) // DEBUG
    
    if (file.path === 'header.json') {
      console.log('Loading HEADER.JSON') // DEBUG
      const response = await fetch('/content/header.json')
      console.log('Header response status:', response.status) // DEBUG
      
      if (!response.ok) {
        throw new Error(`Header file not found: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Header data loaded:', data) // DEBUG
      setHeaderData(data)
      setSelectedFile(file)
      setHasChanges(false)
      setIsLoading(false)
      return
    } else {
      console.log('Loading normal file:', file.path) // DEBUG
      const response = await fetch(`/content/${file.path}`)
      if (!response.ok) throw new Error(`File not found: ${response.status}`)
      
      const data = await response.json()
      const formatted = JSON.stringify(data, null, 2)
      setContent(formatted)
      setOriginalContent(formatted)
      setSelectedFile(file)
      setHasChanges(false)
    }
  } catch (error: any) {
    console.error('Load error details:', error) // DEBUG
    setMessage({ 
      type: 'error', 
      text: `Failed to load ${file.path}: ${error.message}` 
    })
  } finally {
    setIsLoading(false)
  }
}

  const saveHeaderData = async () => {
    setIsSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'header.json',
          content: headerData,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setMessage({ type: 'success', text: 'Header saved successfully! Refresh your site to see changes.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save header. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const saveFile = async () => {
    if (!selectedFile) return
    
    if (selectedFile.path === 'header.json') {
      return saveHeaderData()
    }
    
    try {
      JSON.parse(content)
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid JSON format. Please check your syntax.' })
      return
    }

    setIsSaving(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: selectedFile.path,
          content: JSON.parse(content),
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setOriginalContent(content)
      setHasChanges(false)
      setMessage({ type: 'success', text: 'Content saved successfully! Changes are now live on your website.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save file. Please try again.' })
      console.error('Error saving file:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setHasChanges(newContent !== originalContent)
  }

  const handleHeaderChange = (field: keyof HeaderData, value: string) => {
    const newData = { ...headerData, [field]: value } as HeaderData
    setHeaderData(newData)
    setHasChanges(true)
  }

  const resetChanges = () => {
    if (selectedFile?.path === 'header.json') {
      setHeaderData({
        logo: '/images/logo.jpg',
        title: 'Mind Centre for Learning',
        tagline: 'Go for A\'s and Multiple Grade Improvements!',
        promoText1: 'Are you struggling with your studies? Learn our proven Fast & Systematic study methodologies which have helped many students excel!',
        promoText2: 'Go to www.mindcentre.site to secure our special promotion - Buy 1 Get 1 class free for a new subject!',
        promoText3: 'RECOMMEND A FRIEND and BOTH OF YOU will get a Special $10 discount when he/she signs up for a term!',
        facebookUrl: 'https://www.facebook.com/mindcentre',
        twitterUrl: 'https://x.com/Mindcentre7',
        instagramUrl: 'https://www.instagram.com/mindcentreforlearning/',
      })
    } else {
      setContent(originalContent)
    }
    setHasChanges(false)
    setMessage({ type: 'info', text: 'Changes have been reset.' })
    setTimeout(() => setMessage(null), 2000)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Lock className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter password to access content editor</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {authError && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Incorrect password
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Login
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 space-y-2">
            <p>• Default password: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-purple-600 font-semibold">13165</span></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mind Centre - Content Editor</h1>
              <p className="text-sm text-gray-600 mt-1">Edit your website content easily - no coding required!</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/blog"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Blog Management
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Content Files
              </h2>
              <div className="space-y-2">
                {contentFiles.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => loadFile(file)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedFile?.path === file.path
                        ? 'bg-purple-100 border-2 border-purple-500 shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{file.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{file.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedFile ? (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="border-b p-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedFile.name}</h2>
                    <p className="text-sm text-gray-600">{selectedFile.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (selectedFile?.previewUrl) {
                          window.open(`${selectedFile.previewUrl}?preview=true`, '_blank');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
                      title="Preview on live site"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    {hasChanges && (
                      <button
                        onClick={resetChanges}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reset
                      </button>
                    )}
                    <button
                      onClick={saveFile}
                      disabled={isSaving || !hasChanges}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>

                {message && (
                  <div className={`mx-4 mt-4 p-3 rounded-lg flex items-center gap-2 ${
                    message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                    message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                    'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                     message.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
                     <AlertCircle className="w-5 h-5" />}
                    {message.text}
                  </div>
                )}

                <div className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                      <div className="text-gray-500">Loading content...</div>
                    </div>
                  ) : selectedFile.path === 'header.json' ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo Image Path</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={headerData.logo}
                            onChange={(e) => handleHeaderChange('logo', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="/images/logo.jpg"
                          />
                          <ImageIcon className="w-5 h-5 text-gray-400 mt-2" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                        <input
                          type="text"
                          value={headerData.title}
                          onChange={(e) => handleHeaderChange('title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                        <input
                          type="text"
                          value={headerData.tagline}
                          onChange={(e) => handleHeaderChange('tagline', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Text 1</label>
                        <textarea
                          rows={3}
                          value={headerData.promoText1}
                          onChange={(e) => handleHeaderChange('promoText1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Text 2</label>
                        <textarea
                          rows={2}
                          value={headerData.promoText2}
                          onChange={(e) => handleHeaderChange('promoText2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Text 3</label>
                        <textarea
                          rows={2}
                          value={headerData.promoText3}
                          onChange={(e) => handleHeaderChange('promoText3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Social Media Links</h4>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Facebook URL</label>
                            <input
                              type="url"
                              value={headerData.facebookUrl}
                              onChange={(e) => handleHeaderChange('facebookUrl', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Twitter/X URL</label>
                            <input
                              type="url"
                              value={headerData.twitterUrl}
                              onChange={(e) => handleHeaderChange('twitterUrl', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Instagram URL</label>
                            <input
                              type="url"
                              value={headerData.instagramUrl}
                              onChange={(e) => handleHeaderChange('instagramUrl', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <textarea
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="w-full h-96 font-mono text-sm p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Content will appear here..."
                      spellCheck={false}
                    />
                  )}
                </div>

                <div className="border-t p-4 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Editing Tips:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• For Header/Footer: Just type your text - no coding needed!</li>
                    <li>• For JSON files: Keep text inside quotation marks</li>
                    <li>• Don't remove commas or brackets (JSON files only)</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a file to edit</h3>
                <p className="text-gray-600">Choose a content file from the list on the left to start editing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}