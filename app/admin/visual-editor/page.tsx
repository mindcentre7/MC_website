'use client'

import { useState, useEffect } from 'react'
import { 
  Save, RefreshCw, FileText, AlertCircle, CheckCircle, 
  ArrowRight, Lock, Eye, EyeOff, Edit3, Image as ImageIcon,
  ChevronRight, ChevronDown, Layout, Home, FileEdit, Layers,
  Palette, Type, Image as ImageIcon2, ToggleLeft, ToggleRight,
  Plus, Trash2, User, Users, ArrowUp, ArrowDown, Upload
} from 'lucide-react'
import Link from 'next/link'

// Reusable Image Upload Field Component
function ImageUploadField({ 
  label, 
  value, 
  onChange, 
  placeholder = '/images/logo.jpg' 
}: { 
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch('/api/blog/upload-image', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) throw new Error('Upload failed')
      
      const result = await response.json()
      return result.imagePath
    } catch (error) {
      console.error('Upload error:', error)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return
    
    const path = await uploadFile(file)
    if (path) {
      onChange(path)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const path = await uploadFile(file)
    if (path) {
      onChange(path)
    }
  }

  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-purple-500 transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder={placeholder}
        />
        <label className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg cursor-pointer flex items-center gap-1 text-sm">
          <Upload className="w-4 h-4" />
          Browse
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>
      <p className="text-xs text-gray-500 mt-2">Drag & drop an image or click Browse</p>
      {isUploading && <p className="text-xs text-purple-600 mt-1">Uploading...</p>}
      {value && (
        <img src={value} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
      )}
    </div>
  )
}

// Page definitions with their sections
interface Section {
  id: string
  name: string
  description: string
}

interface PageDef {
  id: string
  name: string
  path: string
  previewUrl: string
  sections: Section[]
}

const pageDefinitions: PageDef[] = [
  {
    id: 'home',
    name: 'Home Page',
    path: 'home.json',
    previewUrl: '/',
    sections: [
      { id: 'trackRecord', name: 'Track Record', description: 'Success stories and achievements' },
      { id: 'subjectsOffered', name: 'Subjects Offered', description: 'List of subjects taught' },
      { id: 'methodology', name: 'Methodology', description: 'Teaching methods and approaches' },
      { id: 'testimonials', name: 'Testimonials', description: 'Student testimonials carousel' },
      { id: 'whyChooseUs', name: 'Why Choose Us', description: 'Key benefits and features' },
    ]
  },
  {
    id: 'about',
    name: 'About Us',
    path: 'about.json',
    previewUrl: '/about-us',
    sections: [
      { id: 'mission', name: 'Mission & Vision', description: 'Our purpose and goals' },
      { id: 'values', name: 'Core Values', description: 'What we stand for' },
      { id: 'founders', name: 'Founders', description: 'About the founders' },
      { id: 'achievements', name: 'Achievements', description: 'Awards and accomplishments' },
    ]
  },
  {
    id: 'contact',
    name: 'Contact',
    path: 'contact.json',
    previewUrl: '/contact',
    sections: [
      { id: 'locations', name: 'Branch Locations', description: 'Addresses and maps' },
      { id: 'contactInfo', name: 'Contact Information', description: 'Phone, email, hours' },
      { id: 'form', name: 'Contact Form', description: 'Inquiry form settings' },
    ]
  },
  {
    id: 'teachers',
    name: 'Teachers',
    path: 'teachers.json',
    previewUrl: '/teachers',
    sections: [
      { id: 'teachers', name: 'Teacher Profiles', description: 'List of teachers' },
    ]
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    path: 'testimonials.json',
    previewUrl: '/testimonials',
    sections: [
      { id: 'testimonials', name: 'Student Testimonials', description: 'Success stories' },
    ]
  },
  {
    id: 'learning-system',
    name: 'Learning System',
    path: 'learning-system.json',
    previewUrl: '/our-learning-system',
    sections: [
      { id: 'overview', name: 'System Overview', description: 'MIND system introduction' },
      { id: 'components', name: 'Components', description: 'System components' },
    ]
  },
  {
    id: 'schedules',
    name: 'Schedules',
    path: 'schedules.json',
    previewUrl: '/schedules',
    sections: [
      { id: 'serangoon', name: 'Serangoon Schedule', description: 'Class times for Serangoon' },
      { id: 'bedok', name: 'Bedok Schedule', description: 'Class times for Bedok' },
    ]
  },
  {
    id: 'results',
    name: 'Results',
    path: 'results.json',
    previewUrl: '/results',
    sections: [
      { id: 'examResults', name: 'Exam Results', description: 'PDF downloads' },
    ]
  },
  {
    id: 'franchising',
    name: 'Franchising',
    path: 'franchising.json',
    previewUrl: '/franchising',
    sections: [
      { id: 'opportunity', name: 'Franchise Opportunity', description: 'Business opportunity details' },
      { id: 'contact', name: 'Franchise Contact', description: 'Contact for inquiries' },
    ]
  },
]

// Site-wide settings
const siteSettingsDef = {
  id: 'site-settings',
  name: 'Site Settings',
  path: 'site-settings.json',
  previewUrl: '/',
  sections: [
    { id: 'general', name: 'General Settings', description: 'Logo, site name, colors' },
    { id: 'social', name: 'Social Media', description: 'Facebook, Instagram, etc.' },
    { id: 'seo', name: 'SEO Settings', description: 'Meta tags, descriptions' },
  ]
}

const headerSettingsDef = {
  id: 'header',
  name: 'Header Settings',
  path: 'header.json',
  previewUrl: '/',
  sections: [
    { id: 'header', name: 'Header Configuration', description: 'Logo, title, tagline, promo texts' },
  ]
}

const footerSettingsDef = {
  id: 'footer',
  name: 'Footer Settings',
  path: 'footer.json',
  previewUrl: '/',
  sections: [
    { id: 'footer', name: 'Footer Configuration', description: 'Links, social media, contact button' },
  ]
}

const whatsappSettingsDef = {
  id: 'whatsapp',
  name: 'WhatsApp Widget',
  path: 'whatsapp.json',
  previewUrl: '/',
  sections: [
    { id: 'whatsapp', name: 'WhatsApp Settings', description: 'Chat widget configuration' },
  ]
}

const globalSettingsDef = {
  id: 'global',
  name: 'Global Settings',
  path: 'global-settings.json',
  previewUrl: '/',
  sections: [
    { id: 'global', name: 'Global Configuration', description: 'Theme, fonts, colors' },
  ]
}

export default function VisualEditorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState(false)
  
  // Navigation state
  const [activeTab, setActiveTab] = useState<'pages' | 'settings'>('pages')
  const [selectedPage, setSelectedPage] = useState<PageDef | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  
  // Content state
  const [pageData, setPageData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  // Header data (separate)
  const [headerData, setHeaderData] = useState<any>(null)
  const [footerData, setFooterData] = useState<any>(null)
  const [whatsappData, setWhatsappData] = useState<any>(null)
  const [globalData, setGlobalData] = useState<any>(null)

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
    setSelectedPage(null)
    setSelectedSection(null)
  }

  // Load page data
  const loadPageData = async (page: PageDef) => {
    setIsLoading(true)
    setMessage(null)
    try {
      const response = await fetch(`/content/${page.path}`)
      if (!response.ok) throw new Error(`Failed to load: ${response.status}`)
      
      const data = await response.json()
      setPageData(data)
      setSelectedPage(page)
      setSelectedSection(null)
      setHasChanges(false)
      
      // Auto-expand first section
      if (page.sections.length > 0) {
        setExpandedSections(new Set([page.sections[0].id]))
        setSelectedSection(page.sections[0].id)
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to load ${page.name}: ${error.message}` })
    } finally {
      setIsLoading(false)
    }
  }

  // Load site-wide settings
  const loadSettings = async (type: 'header' | 'footer' | 'whatsapp' | 'global') => {
    setIsLoading(true)
    setMessage(null)
    try {
      const paths = {
        header: 'header.json',
        footer: 'footer.json', 
        whatsapp: 'whatsapp.json',
        global: 'global-settings.json'
      }
      
      const response = await fetch(`/content/${paths[type]}`)
      if (!response.ok) throw new Error(`Failed to load: ${response.status}`)
      
      const data = await response.json()
      
      if (type === 'header') {
        setHeaderData(data)
        setSelectedPage(headerSettingsDef as any)
      } else if (type === 'footer') {
        setFooterData(data)
        setSelectedPage(footerSettingsDef as any)
      } else if (type === 'whatsapp') {
        setWhatsappData(data)
        setSelectedPage(whatsappSettingsDef as any)
      } else {
        setGlobalData(data)
        setSelectedPage(globalSettingsDef as any)
      }
      
      setSelectedSection(type)
      setHasChanges(false)
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to load settings: ${error.message}` })
    } finally {
      setIsLoading(false)
    }
  }

  // Save current data
  const saveCurrentData = async () => {
    if (!selectedPage) return
    
    const path = selectedPage.path
    let dataToSave = pageData
    
    // Handle site settings
    if (selectedPage.id === 'header') {
      dataToSave = headerData
    } else if (selectedPage.id === 'footer') {
      dataToSave = footerData
    } else if (selectedPage.id === 'whatsapp') {
      dataToSave = whatsappData
    } else if (selectedPage.id === 'global') {
      dataToSave = globalData
    }
    
    if (!dataToSave) return
    
    setIsSaving(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: path,
          content: dataToSave,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setHasChanges(false)
      setMessage({ type: 'success', text: 'Changes saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  // Update nested data
  const updateSectionData = (sectionId: string, field: string, value: any) => {
    if (!pageData) return
    
    const newData = {
      ...pageData,
      [sectionId]: {
        ...pageData[sectionId],
        [field]: value
      }
    }
    setPageData(newData)
    setHasChanges(true)
  }

  // Update header data
  const updateHeaderData = (field: string, value: any) => {
    if (!headerData) return
    const newData = { ...headerData, [field]: value }
    setHeaderData(newData)
    setHasChanges(true)
  }

  // Upload file to /api/blog/upload-image
  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch('/api/blog/upload-image', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      return data.imagePath
    } catch (error) {
      console.error('Upload error:', error)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  // Handle drag & drop for image upload
  const handleImageDrop = async (e: React.DragEvent, field: string, target: 'header' | 'global') => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return
    
    const path = await uploadFile(file)
    if (path) {
      if (target === 'header') {
        updateHeaderData(field, path)
      } else if (target === 'global') {
        setGlobalData({ ...globalData, [field]: path })
        setHasChanges(true)
      }
    }
  }

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
    setSelectedSection(sectionId)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Layout className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Visual Editor</h1>
            <p className="text-gray-600">Enter password to access the Wix-like content editor</p>
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Layout className="w-6 h-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">Mind Centre Visual Editor</h1>
              </div>
              {selectedPage && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ChevronRight className="w-4 h-4" />
                  <span>{selectedPage.name}</span>
                  {selectedSection && (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      <span className="text-purple-600 font-medium">
                        {selectedPage.sections.find(s => s.id === selectedSection)?.name || selectedSection || 'Section'}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {selectedPage && (
                <>
                  <button
                    onClick={() => window.open(selectedPage.previewUrl, '_blank')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={saveCurrentData}
                    disabled={isSaving || !hasChanges}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </>
              )}
              <Link
                href="/admin"
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
              >
                <FileEdit className="w-4 h-4" />
                JSON Editor
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Message Toast */}
        {message && (
          <div className={`absolute top-full left-0 right-0 mx-auto max-w-md mt-2 p-3 rounded-lg flex items-center gap-2 shadow-lg ${
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
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <aside className="w-80 bg-white border-r flex flex-col overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('pages')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
                activeTab === 'pages' 
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              Pages
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
                activeTab === 'settings' 
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Palette className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Page/Section List */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'pages' ? (
              <div className="p-3 space-y-2">
                {pageDefinitions.map((page) => (
                  <div key={page.id}>
                    <button
                      onClick={() => loadPageData(page)}
                      className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                        selectedPage?.id === page.id
                          ? 'bg-purple-100 border-2 border-purple-500 shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <Home className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{page.name}</div>
                        <div className="text-xs text-gray-500">{page.sections.length} sections</div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                        selectedPage?.id === page.id ? 'rotate-90' : ''
                      }`} />
                    </button>
                    
                    {/* Sections - shown when page is selected */}
                    {selectedPage?.id === page.id && (
                      <div className="ml-4 mt-2 space-y-1 border-l-2 border-purple-200 pl-2">
                        {page.sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => toggleSection(section.id)}
                            className={`w-full text-left p-2 rounded transition-all flex items-center gap-2 text-sm ${
                              selectedSection === section.id
                                ? 'bg-purple-50 text-purple-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {expandedSections.has(section.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                            {section.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 space-y-2">
                <button
                  onClick={() => loadSettings('header')}
                  className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                    selectedPage?.id === 'header'
                      ? 'bg-purple-100 border-2 border-purple-500 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <Layout className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Header</div>
                    <div className="text-xs text-gray-500">Logo, title, promo texts</div>
                  </div>
                </button>
                
                <button
                  onClick={() => loadSettings('footer')}
                  className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                    selectedPage?.id === 'footer'
                      ? 'bg-purple-100 border-2 border-purple-500 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <Layout className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Footer</div>
                    <div className="text-xs text-gray-500">Links, social, contact</div>
                  </div>
                </button>
                
                <button
                  onClick={() => loadSettings('whatsapp')}
                  className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                    selectedPage?.id === 'whatsapp'
                      ? 'bg-purple-100 border-2 border-purple-500 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <ImageIcon2 className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">WhatsApp Widget</div>
                    <div className="text-xs text-gray-500">Chat widget config</div>
                  </div>
                </button>
                
                <button
                  onClick={() => loadSettings('global')}
                  className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                    selectedPage?.id === 'global'
                      ? 'bg-purple-100 border-2 border-purple-500 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <Palette className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Global Settings</div>
                    <div className="text-xs text-gray-500">Theme, fonts, colors</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content - Editor */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-gray-500">Loading content...</div>
            </div>
          ) : selectedPage ? (
            <div className="p-6">
              {/* Header Editor */}
              {selectedPage.id === 'header' && headerData && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Layout className="w-5 h-5 text-purple-600" />
                      Header Configuration
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <ImageUploadField
                          label="Logo Image"
                          value={headerData.logo || ''}
                          onChange={(value) => updateHeaderData('logo', value)}
                          placeholder="/images/logo.jpg"
                        />
                      </div>
                      
                      {/* Title Styling */}
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                        <input
                          type="text"
                          value={headerData.title || ''}
                          onChange={(e) => updateHeaderData('title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-3"
                          placeholder="Mind Centre for Learning"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Color</label>
                            <input
                              type="color"
                              value={headerData.titleColor || '#ffffff'}
                              onChange={(e) => updateHeaderData('titleColor', e.target.value)}
                              className="w-full h-9 rounded cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Font</label>
                            <select
                              value={headerData.titleFont || 'inherit'}
                              onChange={(e) => updateHeaderData('titleFont', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="inherit">Inherit</option>
                              <option value="Arial">Arial</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Georgia">Georgia</option>
                              <option value="Verdana">Verdana</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Poppins">Poppins</option>
                              <option value="Open Sans">Open Sans</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Size (px)</label>
                            <input
                              type="number"
                              min="12"
                              max="120"
                              value={headerData.titleFontSize || 32}
                              onChange={(e) => updateHeaderData('titleFontSize', parseInt(e.target.value) || 32)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Bold</label>
                            <button
                              onClick={() => updateHeaderData('titleBold', !headerData.titleBold)}
                              className={`w-full px-2 py-1 text-sm border rounded ${headerData.titleBold ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {headerData.titleBold ? 'ON' : 'OFF'}
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Italic</label>
                            <button
                              onClick={() => updateHeaderData('titleItalic', !headerData.titleItalic)}
                              className={`w-full px-2 py-1 text-sm border rounded ${headerData.titleItalic ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {headerData.titleItalic ? 'ON' : 'OFF'}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tagline Styling */}
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                        <input
                          type="text"
                          value={headerData.tagline || ''}
                          onChange={(e) => updateHeaderData('tagline', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-3"
                          placeholder="Go for As and Multiple Grade Improvements!"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Color</label>
                            <input
                              type="color"
                              value={headerData.taglineColor || '#000000'}
                              onChange={(e) => updateHeaderData('taglineColor', e.target.value)}
                              className="w-full h-9 rounded cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Font</label>
                            <select
                              value={headerData.taglineFont || 'inherit'}
                              onChange={(e) => updateHeaderData('taglineFont', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="inherit">Inherit</option>
                              <option value="Arial">Arial</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Georgia">Georgia</option>
                              <option value="Verdana">Verdana</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Poppins">Poppins</option>
                              <option value="Open Sans">Open Sans</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Size (px)</label>
                            <input
                              type="number"
                              min="12"
                              max="120"
                              value={headerData.taglineFontSize || 20}
                              onChange={(e) => updateHeaderData('taglineFontSize', parseInt(e.target.value) || 20)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Bold</label>
                            <button
                              onClick={() => updateHeaderData('taglineBold', !headerData.taglineBold)}
                              className={`w-full px-2 py-1 text-sm border rounded ${headerData.taglineBold ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {headerData.taglineBold ? 'ON' : 'OFF'}
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Italic</label>
                            <button
                              onClick={() => updateHeaderData('taglineItalic', !headerData.taglineItalic)}
                              className={`w-full px-2 py-1 text-sm border rounded ${headerData.taglineItalic ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {headerData.taglineItalic ? 'ON' : 'OFF'}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Promo Text 1 Styling */}
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Text 1</label>
                        <textarea
                          rows={2}
                          value={headerData.promoText1 || ''}
                          onChange={(e) => updateHeaderData('promoText1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-3"
                          placeholder="Enter your first promotional text..."
                        />
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Color</label>
                            <input
                              type="color"
                              value={headerData.promoText1Color || '#ffffff'}
                              onChange={(e) => updateHeaderData('promoText1Color', e.target.value)}
                              className="w-full h-9 rounded cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Font</label>
                            <select
                              value={headerData.promoText1Font || 'inherit'}
                              onChange={(e) => updateHeaderData('promoText1Font', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="inherit">Inherit</option>
                              <option value="Arial">Arial</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Georgia">Georgia</option>
                              <option value="Verdana">Verdana</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Poppins">Poppins</option>
                              <option value="Open Sans">Open Sans</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Size (px)</label>
                            <input
                              type="number"
                              min="12"
                              max="120"
                              value={headerData.promoText1FontSize || 16}
                              onChange={(e) => updateHeaderData('promoText1FontSize', parseInt(e.target.value) || 16)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Bold</label>
                            <button
                              onClick={() => updateHeaderData('promoText1Bold', !headerData.promoText1Bold)}
                              className={`w-full px-2 py-1 text-sm border rounded ${headerData.promoText1Bold ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {headerData.promoText1Bold ? 'ON' : 'OFF'}
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Italic</label>
                            <button
                              onClick={() => updateHeaderData('promoText1Italic', !headerData.promoText1Italic)}
                              className={`w-full px-2 py-1 text-sm border rounded ${headerData.promoText1Italic ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {headerData.promoText1Italic ? 'ON' : 'OFF'}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Promo Text 2 Styling */}
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Text 2</label>
                        <textarea
                          rows={2}
                          value={headerData.promoText2 || ''}
                          onChange={(e) => updateHeaderData('promoText2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-3"
                          placeholder="Enter your second promotional text..."
                        />
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Color</label>
                            <input
                              type="color"
                              value={headerData.promoText2Color || '#ffffff'}
                              onChange={(e) => updateHeaderData('promoText2Color', e.target.value)}
                              className="w-full h-9 rounded cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Font</label>
                            <select
                              value={headerData.promoText2Font || 'inherit'}
                              onChange={(e) => updateHeaderData('promoText2Font', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="inherit">Inherit</option>
                              <option value="Arial">Arial</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Georgia">Georgia</option>
                              <option value="Verdana">Verdana</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Poppins">Poppins</option>
                              <option value="Open Sans">Open Sans</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Size (px)</label>
                            <input
                              type="number"
                              min="12"
                              max="120"
                              value={headerData.promoText2FontSize || 16}
                              onChange={(e) => updateHeaderData('promoText2FontSize', parseInt(e.target.value) || 16)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Bold</label>
                            <button
                              onClick={() => updateHeaderData('promoText2Bold', !headerData.promoText2Bold)}
                              className={`w-full px-2 py-1 text-sm border rounded ${headerData.promoText2Bold ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {headerData.promoText2Bold ? 'ON' : 'OFF'}
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Italic</label>
                            <button
                              onClick={() => updateHeaderData('promoText2Italic', !headerData.promoText2Italic)}
                              className={`w-full px-2 py-1 text-sm border rounded ${headerData.promoText2Italic ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {headerData.promoText2Italic ? 'ON' : 'OFF'}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Promo Text 3 Styling */}
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Text 3</label>
                        <textarea
                          rows={2}
                          value={headerData.promoText3 || ''}
                          onChange={(e) => updateHeaderData('promoText3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-3"
                          placeholder="Enter your third promotional text..."
                        />
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Color</label>
                            <input
                              type="color"
                              value={headerData.promoText3Color || '#ffffff'}
                              onChange={(e) => updateHeaderData('promoText3Color', e.target.value)}
                              className="w-full h-9 rounded cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Font</label>
                            <select
                              value={headerData.promoText3Font || 'inherit'}
                              onChange={(e) => updateHeaderData('promoText3Font', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="inherit">Inherit</option>
                              <option value="Arial">Arial</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Georgia">Georgia</option>
                              <option value="Verdana">Verdana</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Poppins">Poppins</option>
                              <option value="Open Sans">Open Sans</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Size (px)</label>
                            <input
                              type="number"
                              min="12"
                              max="120"
                              value={headerData.promoText3FontSize || 16}
                              onChange={(e) => updateHeaderData('promoText3FontSize', parseInt(e.target.value) || 16)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Bold</label>
                            <button
                              onClick={() => updateHeaderData('promoText3Bold', !headerData.promoText3Bold)}
                              className={`w-full px-2 py-1 text-sm border rounded ${headerData.promoText3Bold ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {headerData.promoText3Bold ? 'ON' : 'OFF'}
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Italic</label>
                            <button
                              onClick={() => updateHeaderData('promoText3Italic', !headerData.promoText3Italic)}
                              className={`w-full px-2 py-1 text-sm border rounded ${headerData.promoText3Italic ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {headerData.promoText3Italic ? 'ON' : 'OFF'}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Social Media Links</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Facebook</label>
                            <input
                              type="url"
                              value={headerData.facebookUrl || ''}
                              onChange={(e) => updateHeaderData('facebookUrl', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Twitter/X</label>
                            <input
                              type="url"
                              value={headerData.twitterUrl || ''}
                              onChange={(e) => updateHeaderData('twitterUrl', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Instagram</label>
                            <input
                              type="url"
                              value={headerData.instagramUrl || ''}
                              onChange={(e) => updateHeaderData('instagramUrl', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

{/* Navigation Links Section */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Layout className="w-5 h-5 text-purple-600" />
                        🔗 Navigation Menu Links
                      </h3>
                      <button
                        onClick={() => {
                          const newLinks = [...(headerData.navigation?.links || []), { name: 'New Link', path: '/new-page' }]
                          setHeaderData({
                            ...headerData,
                            navigation: { ...headerData.navigation, links: newLinks }
                          })
                          setHasChanges(true)
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" /> Add Link
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Edit the navigation menu links shown in header</p>
                    
                    <div className="space-y-3">
                      {headerData.navigation?.links?.map((link: any, index: number) => (
                        <div key={index} className="flex gap-2 items-center">
                          <span className="w-8 text-center text-sm font-medium text-gray-500">{index + 1}.</span>
                          <input
                            type="text"
                            value={link.name || ''}
                            onChange={(e) => {
                              const newLinks = [...(headerData.navigation?.links || [])]
                              newLinks[index] = { ...newLinks[index], name: e.target.value }
                              setHeaderData({
                                ...headerData,
                                navigation: { ...headerData.navigation, links: newLinks }
                              })
                              setHasChanges(true)
                            }}
                            placeholder="Link name"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                          <input
                            type="text"
                            value={link.path || ''}
                            onChange={(e) => {
                              const newLinks = [...(headerData.navigation?.links || [])]
                              newLinks[index] = { ...newLinks[index], path: e.target.value }
                              setHeaderData({
                                ...headerData,
                                navigation: { ...headerData.navigation, links: newLinks }
                              })
                              setHasChanges(true)
                            }}
                            placeholder="/page-path"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                          <button
                            onClick={() => {
                              const newLinks = (headerData.navigation?.links || []).filter((_: any, i: number) => i !== index)
                              setHeaderData({
                                ...headerData,
                                navigation: { ...headerData.navigation, links: newLinks }
                              })
                              setHasChanges(true)
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            title="Remove link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {(!headerData.navigation?.links || headerData.navigation.links.length === 0) && (
                        <p className="text-gray-400 text-sm text-center py-4">No links yet. Click "Add Link" to create one.</p>
                      )}
                    </div>
                  </div>

                  
                </div>
              )}

              {/* WhatsApp Editor */}
              {selectedPage.id === 'whatsapp' && whatsappData && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ImageIcon2 className="w-5 h-5 text-purple-600" />
                      WhatsApp Widget Settings
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enabled</label>
                        <button
                          onClick={() => {
                            setWhatsappData({ ...whatsappData, enabled: !whatsappData.enabled })
                            setHasChanges(true)
                          }}
                          className={`flex items-center gap-2 ${whatsappData.enabled ? 'text-green-600' : 'text-gray-400'}`}
                        >
                          {whatsappData.enabled ? <ToggleRight className="w-8 h-6" /> : <ToggleLeft className="w-8 h-6" />}
                          {whatsappData.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Number</label>
                        <input
                          type="text"
                          value={whatsappData.defaultNumber || ''}
                          onChange={(e) => {
                            setWhatsappData({ ...whatsappData, defaultNumber: e.target.value })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="+6586705696"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Message</label>
                        <input
                          type="text"
                          value={whatsappData.defaultMessage || ''}
                          onChange={(e) => {
                            setWhatsappData({ ...whatsappData, defaultMessage: e.target.value })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Hi, I'd like to know more about Mind Centre..."
                        />
                      </div>
                      
                      {/* Representatives Section */}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-900">Representatives ({whatsappData.representatives?.length || 0})</h4>
                          <button
                            onClick={() => {
                              const newReps = whatsappData.representatives ? [...whatsappData.representatives, { name: '', phone: '', location: '', online: false }] : [{ name: '', phone: '', location: '', online: false }]
                              setWhatsappData({ ...whatsappData, representatives: newReps })
                              setHasChanges(true)
                            }}
                            className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </button>
                        </div>
                        
                        {whatsappData.representatives?.map((rep: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2 border">
                            <div className="flex items-start gap-2">
                              <div className="flex-1 grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Name</label>
                                  <input
                                    type="text"
                                    value={rep.name || ''}
                                    onChange={(e) => {
                                      const newReps = [...whatsappData.representatives]
                                      newReps[index] = { ...newReps[index], name: e.target.value }
                                      setWhatsappData({ ...whatsappData, representatives: newReps })
                                      setHasChanges(true)
                                    }}
                                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                    placeholder="Name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Phone</label>
                                  <input
                                    type="text"
                                    value={rep.phone || ''}
                                    onChange={(e) => {
                                      const newReps = [...whatsappData.representatives]
                                      newReps[index] = { ...newReps[index], phone: e.target.value }
                                      setWhatsappData({ ...whatsappData, representatives: newReps })
                                      setHasChanges(true)
                                    }}
                                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                    placeholder="+6586705696"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Location</label>
                                  <input
                                    type="text"
                                    value={rep.location || ''}
                                    onChange={(e) => {
                                      const newReps = [...whatsappData.representatives]
                                      newReps[index] = { ...newReps[index], location: e.target.value }
                                      setWhatsappData({ ...whatsappData, representatives: newReps })
                                      setHasChanges(true)
                                    }}
                                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                    placeholder="Serangoon / Bedok"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Online Status</label>
                                  <button
                                    onClick={() => {
                                      const newReps = [...whatsappData.representatives]
                                      newReps[index] = { ...newReps[index], online: !newReps[index].online }
                                      setWhatsappData({ ...whatsappData, representatives: newReps })
                                      setHasChanges(true)
                                    }}
                                    className={`w-full px-2 py-1.5 rounded text-sm flex items-center justify-center gap-1 ${rep.online ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                                  >
                                    {rep.online ? <><div className="w-2 h-2 bg-green-500 rounded-full"></div> Online</> : <><div className="w-2 h-2 bg-gray-400 rounded-full"></div> Offline</>}
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => {
                                    if (index > 0) {
                                      const newReps = [...whatsappData.representatives]
                                      const temp = newReps[index]
                                      newReps[index] = newReps[index - 1]
                                      newReps[index - 1] = temp
                                      setWhatsappData({ ...whatsappData, representatives: newReps })
                                      setHasChanges(true)
                                    }
                                  }}
                                  disabled={index === 0}
                                  className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-purple-50'}`}
                                  title="Move up"
                                >
                                  <ArrowUp className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (index < (whatsappData.representatives?.length || 0) - 1) {
                                      const newReps = [...whatsappData.representatives]
                                      const temp = newReps[index]
                                      newReps[index] = newReps[index + 1]
                                      newReps[index + 1] = temp
                                      setWhatsappData({ ...whatsappData, representatives: newReps })
                                      setHasChanges(true)
                                    }
                                  }}
                                  disabled={index >= (whatsappData.representatives?.length || 0) - 1}
                                  className={`p-1 rounded ${index >= (whatsappData.representatives?.length || 0) - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-purple-50'}`}
                                  title="Move down"
                                >
                                  <ArrowDown className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    const newReps = whatsappData.representatives.filter((_: any, i: number) => i !== index)
                                    setWhatsappData({ ...whatsappData, representatives: newReps })
                                    setHasChanges(true)
                                  }}
                                  className="p-1 rounded text-red-600 hover:bg-red-50"
                                  title="Remove"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {(!whatsappData.representatives || whatsappData.representatives.length === 0) && (
                          <p className="text-gray-500 text-sm text-center py-3">No representatives. Click "Add" to create one.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Editor */}
              {selectedPage.id === 'footer' && footerData && (
                <div className="space-y-6 max-w-4xl">
                  {/* Contact Info Section */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      📞 Contact Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="text"
                          value={footerData.contactInfo?.phone || ''}
                          onChange={(e) => {
                            setFooterData({
                              ...footerData,
                              contactInfo: { ...footerData.contactInfo, phone: e.target.value }
                            })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="text"
                          value={footerData.contactInfo?.email || ''}
                          onChange={(e) => {
                            setFooterData({
                              ...footerData,
                              contactInfo: { ...footerData.contactInfo, email: e.target.value }
                            })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea
                          value={footerData.contactInfo?.address || ''}
                          onChange={(e) => {
                            setFooterData({
                              ...footerData,
                              contactInfo: { ...footerData.contactInfo, address: e.target.value }
                            })
                            setHasChanges(true)
                          }}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Media Section */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      📱 Social Media & Email Links
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Query Email URL (mailto:...)</label>
                        <input
                          type="text"
                          value={footerData.queryEmailUrl || ''}
                          onChange={(e) => {
                            setFooterData({ ...footerData, queryEmailUrl: e.target.value })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                        <input
                          type="text"
                          value={footerData.facebookUrl || ''}
                          onChange={(e) => {
                            setFooterData({ ...footerData, facebookUrl: e.target.value })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter/X URL</label>
                        <input
                          type="text"
                          value={footerData.twitterUrl || ''}
                          onChange={(e) => {
                            setFooterData({ ...footerData, twitterUrl: e.target.value })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                        <input
                          type="text"
                          value={footerData.instagramUrl || ''}
                          onChange={(e) => {
                            setFooterData({ ...footerData, instagramUrl: e.target.value })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Button Section */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Layout className="w-5 h-5 text-purple-600" />
                      🔘 Contact Button
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Button Text</label>
                        <input
                          type="text"
                          value={footerData.contactButton?.text || ''}
                          onChange={(e) => {
                            setFooterData({
                              ...footerData,
                              contactButton: { ...footerData.contactButton, text: e.target.value }
                            })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Button Link</label>
                        <input
                          type="text"
                          value={footerData.contactButton?.link || ''}
                          onChange={(e) => {
                            setFooterData({
                              ...footerData,
                              contactButton: { ...footerData.contactButton, link: e.target.value }
                            })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Font Styling Section */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Type className="w-5 h-5 text-purple-600" />
                      🎨 Footer Font Styling
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Font Family */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                        <select
                          value={footerData.styles?.fontFamily || 'system-ui'}
                          onChange={(e) => {
                            setFooterData({
                              ...footerData,
                              styles: { ...footerData.styles, fontFamily: e.target.value }
                            })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="system-ui">System UI</option>
                          <option value="Arial, sans-serif">Arial</option>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="Times New Roman, serif">Times New Roman</option>
                          <option value="Verdana, sans-serif">Verdana</option>
                          <option value="Tahoma, sans-serif">Tahoma</option>
                          <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                        </select>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="10"
                            max="20"
                            value={footerData.styles?.fontSize || 14}
                            onChange={(e) => {
                              setFooterData({
                                ...footerData,
                                styles: { ...footerData.styles, fontSize: parseInt(e.target.value) }
                              })
                              setHasChanges(true)
                            }}
                            className="flex-1"
                          />
                          <span className="text-sm w-10">{footerData.styles?.fontSize || 14}px</span>
                        </div>
                      </div>

                      {/* Text Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={footerData.styles?.color || '#ffffff'}
                            onChange={(e) => {
                              setFooterData({
                                ...footerData,
                                styles: { ...footerData.styles, color: e.target.value }
                              })
                              setHasChanges(true)
                            }}
                            className="w-12 h-10 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={footerData.styles?.color || '#ffffff'}
                            onChange={(e) => {
                              setFooterData({
                                ...footerData,
                                styles: { ...footerData.styles, color: e.target.value }
                              })
                              setHasChanges(true)
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>

                      {/* Link Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={footerData.styles?.linkColor || '#9ca3af'}
                            onChange={(e) => {
                              setFooterData({
                                ...footerData,
                                styles: { ...footerData.styles, linkColor: e.target.value }
                              })
                              setHasChanges(true)
                            }}
                            className="w-12 h-10 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={footerData.styles?.linkColor || '#9ca3af'}
                            onChange={(e) => {
                              setFooterData({
                                ...footerData,
                                styles: { ...footerData.styles, linkColor: e.target.value }
                              })
                              setHasChanges(true)
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>

                      {/* Background Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={footerData.styles?.backgroundColor || '#1f2937'}
                            onChange={(e) => {
                              setFooterData({
                                ...footerData,
                                styles: { ...footerData.styles, backgroundColor: e.target.value }
                              })
                              setHasChanges(true)
                            }}
                            className="w-12 h-10 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={footerData.styles?.backgroundColor || '#1f2937'}
                            onChange={(e) => {
                              setFooterData({
                                ...footerData,
                                styles: { ...footerData.styles, backgroundColor: e.target.value }
                              })
                              setHasChanges(true)
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>

                      {/* Font Weight */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
                        <select
                          value={footerData.styles?.fontWeight || 'normal'}
                          onChange={(e) => {
                            setFooterData({
                              ...footerData,
                              styles: { ...footerData.styles, fontWeight: e.target.value }
                            })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="normal">Normal</option>
                          <option value="bold">Bold</option>
                          <option value="lighter">Light</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Copyright Section */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Layout className="w-5 h-5 text-purple-600" />
                      © Copyright Text
                    </h3>
                    
                    <div>
                      <input
                        type="text"
                        value={footerData.copyrightText || ''}
                        onChange={(e) => {
                          setFooterData({ ...footerData, copyrightText: e.target.value })
                          setHasChanges(true)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Global Settings Editor */}
              {selectedPage.id === 'global' && globalData && (
                <div className="space-y-6 max-w-4xl">
                  {/* Master Background & Font Settings */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-600" />
                      🎨 Master Settings (Whole Website)
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Master Background */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Master Background Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={globalData.masterBackground || '#ffffff'}
                            onChange={(e) => {
                              setGlobalData({ ...globalData, masterBackground: e.target.value })
                              setHasChanges(true)
                            }}
                            className="w-12 h-10 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={globalData.masterBackground || '#ffffff'}
                            onChange={(e) => {
                              setGlobalData({ ...globalData, masterBackground: e.target.value })
                              setHasChanges(true)
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      {/* Master Font */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Master Font Family</label>
                        <select
                          value={globalData.masterFont || 'Inter'}
                          onChange={(e) => {
                            setGlobalData({ ...globalData, masterFont: e.target.value })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="Inter">Inter (Default)</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Lato">Lato</option>
                          <option value="Poppins">Poppins</option>
                          <option value="Arial">Arial</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Times New Roman">Times New Roman</option>
                        </select>
                      </div>
                      
                      {/* Master Font Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Master Font Size</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="12"
                            max="24"
                            value={globalData.masterFontSize || 16}
                            onChange={(e) => {
                              setGlobalData({ ...globalData, masterFontSize: parseInt(e.target.value) })
                              setHasChanges(true)
                            }}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-12">{globalData.masterFontSize || 16}px</span>
                        </div>
                      </div>
                      
                      {/* Master Font Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Master Font Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={globalData.masterFontColor || '#1f2937'}
                            onChange={(e) => {
                              setGlobalData({ ...globalData, masterFontColor: e.target.value })
                              setHasChanges(true)
                            }}
                            className="w-12 h-10 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={globalData.masterFontColor || '#1f2937'}
                            onChange={(e) => {
                              setGlobalData({ ...globalData, masterFontColor: e.target.value })
                              setHasChanges(true)
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      {/* Accent Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accent/Link Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={globalData.accentColor || '#8b5cf6'}
                            onChange={(e) => {
                              setGlobalData({ ...globalData, accentColor: e.target.value })
                              setHasChanges(true)
                            }}
                            className="w-12 h-10 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={globalData.accentColor || '#8b5cf6'}
                            onChange={(e) => {
                              setGlobalData({ ...globalData, accentColor: e.target.value })
                              setHasChanges(true)
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      {/* Theme */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                        <select
                          value={globalData.theme || 'light'}
                          onChange={(e) => {
                            setGlobalData({ ...globalData, theme: e.target.value })
                            setHasChanges(true)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="light">Light Theme</option>
                          <option value="dark">Dark Theme</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preset Themes */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Theme Presets</h3>
                    <div className="grid grid-cols-4 gap-3">
                      <button
                        onClick={() => {
                          setGlobalData({
                            ...globalData,
                            masterBackground: '#ffffff',
                            masterFontColor: '#111827',
                            masterFont: 'Inter',
                            masterFontSize: 18,
                            accentColor: '#2563eb',
                            theme: 'light'
                          })
                          setHasChanges(true)
                        }}
                        className="p-3 border-2 rounded-lg hover:border-blue-500 transition-colors text-left"
                      >
                        <div className="w-full h-8 rounded bg-white border mb-2"></div>
                        <span className="text-xs font-medium">Wix Minimal (Default)</span>
                      </button>
                      <button
                        onClick={() => {
                          setGlobalData({
                            ...globalData,
                            masterBackground: '#f8fafc',
                            masterFontColor: '#334155',
                            masterFont: 'Merriweather',
                            masterFontSize: 18,
                            accentColor: '#475569',
                            theme: 'light'
                          })
                          setHasChanges(true)
                        }}
                        className="p-3 border-2 rounded-lg hover:border-slate-500 transition-colors text-left"
                      >
                        <div className="w-full h-8 rounded bg-slate-50 border mb-2"></div>
                        <span className="text-xs font-medium">Elegant Slate</span>
                      </button>
                      <button
                        onClick={() => {
                          setGlobalData({
                            ...globalData,
                            masterBackground: '#fdfcfb',
                            masterFontColor: '#45474a',
                            masterFont: 'Inter',
                            masterFontSize: 18,
                            accentColor: '#e0d9d1',
                            theme: 'light'
                          })
                          setHasChanges(true)
                        }}
                        className="p-3 border-2 rounded-lg hover:border-stone-500 transition-colors text-left"
                      >
                        <div className="w-full h-8 rounded bg-stone-50 border mb-2"></div>
                        <span className="text-xs font-medium">Soft Sand</span>
                      </button>
                      <button
                        onClick={() => {
                          setGlobalData({
                            ...globalData,
                            masterBackground: '#0f172a',
                            masterFontColor: '#f8fafc',
                            masterFont: 'Inter',
                            masterFontSize: 18,
                            accentColor: '#38bdf8',
                            theme: 'dark'
                          })
                          setHasChanges(true)
                        }}
                        className="p-3 border-2 rounded-lg hover:border-sky-500 transition-colors text-left"
                      >
                        <div className="w-full h-8 rounded bg-slate-900 border mb-2"></div>
                        <span className="text-xs font-medium">Modern Dark</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Content Editor - Track Record */}
              {selectedPage.id === 'home' && pageData && selectedSection === 'trackRecord' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      📝 Track Record Section - Content
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                        <input
                          type="text"
                          value={pageData.trackRecord?.title || ''}
                          onChange={(e) => updateSectionData('trackRecord', 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 1</label>
                        <textarea
                          rows={3}
                          value={pageData.trackRecord?.paragraph1 || ''}
                          onChange={(e) => updateSectionData('trackRecord', 'paragraph1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 2</label>
                        <textarea
                          rows={3}
                          value={pageData.trackRecord?.paragraph2 || ''}
                          onChange={(e) => updateSectionData('trackRecord', 'paragraph2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <ImageUploadField
                            label="Certificate Image"
                            value={pageData.trackRecord?.certificateImage || ''}
                            onChange={(value) => updateSectionData('trackRecord', 'certificateImage', value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Alt Text</label>
                          <input
                            type="text"
                            value={pageData.trackRecord?.certificateAlt || ''}
                            onChange={(e) => updateSectionData('trackRecord', 'certificateAlt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section Styling */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-600" />
                      🎨 Track Record Section - Style & Size
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Section Height */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Min Height</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="200"
                            max="800"
                            value={pageData.trackRecord?.styles?.minHeight || 400}
                            onChange={(e) => updateSectionData('trackRecord', 'styles', { ...pageData.trackRecord?.styles, minHeight: parseInt(e.target.value) })}
                            className="flex-1"
                          />
                          <span className="text-sm w-16">{pageData.trackRecord?.styles?.minHeight || 400}px</span>
                        </div>
                      </div>
                      
                      {/* Section Padding */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Padding</label>
                        <select
                          value={pageData.trackRecord?.styles?.padding || 'medium'}
                          onChange={(e) => updateSectionData('trackRecord', 'styles', { ...pageData.trackRecord?.styles, padding: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="none">None</option>
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                          <option value="xlarge">Extra Large</option>
                        </select>
                      </div>
                      
                      {/* Use Master Background Toggle */}
                      <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                        <label className="text-sm font-medium text-gray-700">Use Master Background</label>
                        <button
                          onClick={() => updateSectionData('trackRecord', 'colors', { ...pageData.trackRecord?.colors, useMasterBackground: !pageData.trackRecord?.colors?.useMasterBackground })}
                          className={`px-3 py-1.5 rounded text-sm font-medium ${pageData.trackRecord?.colors?.useMasterBackground !== false ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                          {pageData.trackRecord?.colors?.useMasterBackground !== false ? '✓ On' : 'Off'}
                        </button>
                      </div>
                      
                      {/* Background Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={pageData.trackRecord?.colors?.backgroundColor || '#ffffff'}
                            onChange={(e) => updateSectionData('trackRecord', 'colors', { ...pageData.trackRecord?.colors, backgroundColor: e.target.value })}
                            className="w-10 h-10 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.trackRecord?.colors?.backgroundColor || '#ffffff'}
                            onChange={(e) => updateSectionData('trackRecord', 'colors', { ...pageData.trackRecord?.colors, backgroundColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      {/* Title Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={pageData.trackRecord?.colors?.titleColor || '#1f2937'}
                            onChange={(e) => updateSectionData('trackRecord', 'colors', { ...pageData.trackRecord?.colors, titleColor: e.target.value })}
                            className="w-10 h-10 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.trackRecord?.colors?.titleColor || '#1f2937'}
                            onChange={(e) => updateSectionData('trackRecord', 'colors', { ...pageData.trackRecord?.colors, titleColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      {/* Text Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={pageData.trackRecord?.colors?.textColor || '#4b5563'}
                            onChange={(e) => updateSectionData('trackRecord', 'colors', { ...pageData.trackRecord?.colors, textColor: e.target.value })}
                            className="w-10 h-10 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.trackRecord?.colors?.textColor || '#4b5563'}
                            onChange={(e) => updateSectionData('trackRecord', 'colors', { ...pageData.trackRecord?.colors, textColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      {/* Accent Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={pageData.trackRecord?.colors?.accentColor || '#7c3aed'}
                            onChange={(e) => updateSectionData('trackRecord', 'colors', { ...pageData.trackRecord?.colors, accentColor: e.target.value })}
                            className="w-10 h-10 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.trackRecord?.colors?.accentColor || '#7c3aed'}
                            onChange={(e) => updateSectionData('trackRecord', 'colors', { ...pageData.trackRecord?.colors, accentColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      
                      {/* Title Font Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title Font Size</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="16"
                            max="48"
                            value={pageData.trackRecord?.styles?.titleFontSize || 24}
                            onChange={(e) => updateSectionData('trackRecord', 'styles', { ...pageData.trackRecord?.styles, titleFontSize: parseInt(e.target.value) })}
                            className="flex-1"
                          />
                          <span className="text-sm w-12">{pageData.trackRecord?.styles?.titleFontSize || 24}px</span>
                        </div>
                      </div>
                      
                      {/* Title Font Style */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title Font Style</label>
                        <select
                          value={pageData.trackRecord?.styles?.titleFontWeight || 'bold'}
                          onChange={(e) => updateSectionData('trackRecord', 'styles', { ...pageData.trackRecord?.styles, titleFontWeight: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="normal">Normal</option>
                          <option value="bold">Bold</option>
                          <option value="lighter">Light</option>
                        </select>
                      </div>
                      
                      {/* Text Font Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Text Font Size</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="12"
                            max="24"
                            value={pageData.trackRecord?.styles?.textFontSize || 16}
                            onChange={(e) => updateSectionData('trackRecord', 'styles', { ...pageData.trackRecord?.styles, textFontSize: parseInt(e.target.value) })}
                            className="flex-1"
                          />
                          <span className="text-sm w-12">{pageData.trackRecord?.styles?.textFontSize || 16}px</span>
                        </div>
                      </div>
                      
                      {/* Text Font Style */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Text Font Style</label>
                        <select
                          value={pageData.trackRecord?.styles?.textFontStyle || 'normal'}
                          onChange={(e) => updateSectionData('trackRecord', 'styles', { ...pageData.trackRecord?.styles, textFontStyle: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="normal">Normal</option>
                          <option value="italic">Italic</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Content Editor - Subjects Offered */}
              {selectedPage.id === 'home' && pageData && selectedSection === 'subjectsOffered' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Subjects Offered
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                        <input
                          type="text"
                          value={pageData.subjectsOffered?.title || ''}
                          onChange={(e) => updateSectionData('subjectsOffered', 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          rows={4}
                          value={pageData.subjectsOffered?.description || ''}
                          onChange={(e) => updateSectionData('subjectsOffered', 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      {/* Colors & Styles */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">🎨 Colors & Styles</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.subjectsOffered?.colors?.backgroundColor || '#ffffff'}
                                onChange={(e) => updateSectionData('subjectsOffered', 'colors', { ...pageData.subjectsOffered?.colors, backgroundColor: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.subjectsOffered?.colors?.backgroundColor || '#ffffff'}
                                onChange={(e) => updateSectionData('subjectsOffered', 'colors', { ...pageData.subjectsOffered?.colors, backgroundColor: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Title Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.subjectsOffered?.colors?.titleColor || '#1f2937'}
                                onChange={(e) => updateSectionData('subjectsOffered', 'colors', { ...pageData.subjectsOffered?.colors, titleColor: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.subjectsOffered?.colors?.titleColor || '#1f2937'}
                                onChange={(e) => updateSectionData('subjectsOffered', 'colors', { ...pageData.subjectsOffered?.colors, titleColor: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.subjectsOffered?.colors?.textColor || '#4b5563'}
                                onChange={(e) => updateSectionData('subjectsOffered', 'colors', { ...pageData.subjectsOffered?.colors, textColor: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.subjectsOffered?.colors?.textColor || '#4b5563'}
                                onChange={(e) => updateSectionData('subjectsOffered', 'colors', { ...pageData.subjectsOffered?.colors, textColor: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Card Background</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.subjectsOffered?.colors?.cardBackground || '#f9fafb'}
                                onChange={(e) => updateSectionData('subjectsOffered', 'colors', { ...pageData.subjectsOffered?.colors, cardBackground: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.subjectsOffered?.colors?.cardBackground || '#f9fafb'}
                                onChange={(e) => updateSectionData('subjectsOffered', 'colors', { ...pageData.subjectsOffered?.colors, cardBackground: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Font Styles */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">🔤 Font Styles</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Title Font Size</label>
                            <div className="flex items-center gap-2">
                              <input type="range" min="16" max="48" value={pageData.subjectsOffered?.styles?.titleFontSize || 30} onChange={(e) => updateSectionData('subjectsOffered', 'styles', { ...pageData.subjectsOffered?.styles, titleFontSize: parseInt(e.target.value) })} className="flex-1" />
                              <span className="text-xs w-8">{pageData.subjectsOffered?.styles?.titleFontSize || 30}px</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Text Font Size</label>
                            <div className="flex items-center gap-2">
                              <input type="range" min="12" max="24" value={pageData.subjectsOffered?.styles?.textFontSize || 16} onChange={(e) => updateSectionData('subjectsOffered', 'styles', { ...pageData.subjectsOffered?.styles, textFontSize: parseInt(e.target.value) })} className="flex-1" />
                              <span className="text-xs w-8">{pageData.subjectsOffered?.styles?.textFontSize || 16}px</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Title Font Weight</label>
                            <select value={pageData.subjectsOffered?.styles?.titleFontWeight || 'bold'} onChange={(e) => updateSectionData('subjectsOffered', 'styles', { ...pageData.subjectsOffered?.styles, titleFontWeight: e.target.value })} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                              <option value="normal">Normal</option><option value="bold">Bold</option><option value="lighter">Light</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Section Padding</label>
                            <select value={pageData.subjectsOffered?.styles?.padding || 'large'} onChange={(e) => updateSectionData('subjectsOffered', 'styles', { ...pageData.subjectsOffered?.styles, padding: e.target.value })} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                              <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Content Editor - Methodology */}
              {selectedPage.id === 'home' && pageData && selectedSection === 'methodology' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Methodology Section
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                        <input
                          type="text"
                          value={pageData.methodology?.title || ''}
                          onChange={(e) => updateSectionData('methodology', 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          rows={3}
                          value={pageData.methodology?.description || ''}
                          onChange={(e) => updateSectionData('methodology', 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Methods ({pageData.methodology?.methods?.length || 0})</h4>
                        {pageData.methodology?.methods?.map((method: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Icon</label>
                                <input
                                  type="text"
                                  value={method.icon || ''}
                                  onChange={(e) => {
                                    const newMethods = [...pageData.methodology.methods]
                                    newMethods[index] = { ...newMethods[index], icon: e.target.value }
                                    updateSectionData('methodology', 'methods', newMethods)
                                  }}
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-600 mb-1">Title</label>
                                <input
                                  type="text"
                                  value={method.title || ''}
                                  onChange={(e) => {
                                    const newMethods = [...pageData.methodology.methods]
                                    newMethods[index] = { ...newMethods[index], title: e.target.value }
                                    updateSectionData('methodology', 'methods', newMethods)
                                  }}
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                />
                              </div>
                            </div>
                            <div className="mt-2">
                              <label className="block text-xs text-gray-600 mb-1">Description</label>
                              <textarea
                                rows={2}
                                value={method.description || ''}
                                onChange={(e) => {
                                  const newMethods = [...pageData.methodology.methods]
                                  newMethods[index] = { ...newMethods[index], description: e.target.value }
                                  updateSectionData('methodology', 'methods', newMethods)
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Colors & Styles */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">🎨 Colors & Styles</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.methodology?.colors?.backgroundColor || '#f9fafb'}
                                onChange={(e) => updateSectionData('methodology', 'colors', { ...pageData.methodology?.colors, backgroundColor: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.methodology?.colors?.backgroundColor || '#f9fafb'}
                                onChange={(e) => updateSectionData('methodology', 'colors', { ...pageData.methodology?.colors, backgroundColor: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Title Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.methodology?.colors?.titleColor || '#1f2937'}
                                onChange={(e) => updateSectionData('methodology', 'colors', { ...pageData.methodology?.colors, titleColor: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.methodology?.colors?.titleColor || '#1f2937'}
                                onChange={(e) => updateSectionData('methodology', 'colors', { ...pageData.methodology?.colors, titleColor: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.methodology?.colors?.textColor || '#4b5563'}
                                onChange={(e) => updateSectionData('methodology', 'colors', { ...pageData.methodology?.colors, textColor: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.methodology?.colors?.textColor || '#4b5563'}
                                onChange={(e) => updateSectionData('methodology', 'colors', { ...pageData.methodology?.colors, textColor: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Card Background</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.methodology?.colors?.cardBackground || '#ffffff'}
                                onChange={(e) => updateSectionData('methodology', 'colors', { ...pageData.methodology?.colors, cardBackground: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.methodology?.colors?.cardBackground || '#ffffff'}
                                onChange={(e) => updateSectionData('methodology', 'colors', { ...pageData.methodology?.colors, cardBackground: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Font Styles */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">🔤 Font Styles</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Title Font Size</label>
                            <div className="flex items-center gap-2">
                              <input type="range" min="16" max="48" value={pageData.methodology?.styles?.titleFontSize || 36} onChange={(e) => updateSectionData('methodology', 'styles', { ...pageData.methodology?.styles, titleFontSize: parseInt(e.target.value) })} className="flex-1" />
                              <span className="text-xs w-8">{pageData.methodology?.styles?.titleFontSize || 36}px</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Text Font Size</label>
                            <div className="flex items-center gap-2">
                              <input type="range" min="12" max="24" value={pageData.methodology?.styles?.textFontSize || 16} onChange={(e) => updateSectionData('methodology', 'styles', { ...pageData.methodology?.styles, textFontSize: parseInt(e.target.value) })} className="flex-1" />
                              <span className="text-xs w-8">{pageData.methodology?.styles?.textFontSize || 16}px</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Title Font Weight</label>
                            <select value={pageData.methodology?.styles?.titleFontWeight || 'bold'} onChange={(e) => updateSectionData('methodology', 'styles', { ...pageData.methodology?.styles, titleFontWeight: e.target.value })} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                              <option value="normal">Normal</option><option value="bold">Bold</option><option value="lighter">Light</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Section Padding</label>
                            <select value={pageData.methodology?.styles?.padding || 'large'} onChange={(e) => updateSectionData('methodology', 'styles', { ...pageData.methodology?.styles, padding: e.target.value })} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                              <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Content Editor - Why Choose Us */}
              {selectedPage.id === 'home' && pageData && selectedSection === 'whyChooseUs' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      Why Choose Us
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                        <input
                          type="text"
                          value={pageData.whyChooseUs?.title || ''}
                          onChange={(e) => updateSectionData('whyChooseUs', 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Features ({pageData.whyChooseUs?.items?.length || 0})</h4>
                        {pageData.whyChooseUs?.items?.map((item: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Icon</label>
                                <input
                                  type="text"
                                  value={item.icon || ''}
                                  onChange={(e) => {
                                    const newItems = [...pageData.whyChooseUs.items]
                                    newItems[index] = { ...newItems[index], icon: e.target.value }
                                    updateSectionData('whyChooseUs', 'items', newItems)
                                  }}
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-600 mb-1">Title</label>
                                <input
                                  type="text"
                                  value={item.title || ''}
                                  onChange={(e) => {
                                    const newItems = [...pageData.whyChooseUs.items]
                                    newItems[index] = { ...newItems[index], title: e.target.value }
                                    updateSectionData('whyChooseUs', 'items', newItems)
                                  }}
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                                />
                              </div>
                            </div>
                            <div className="mt-2">
                              <label className="block text-xs text-gray-600 mb-1">Description</label>
                              <textarea
                                rows={2}
                                value={item.description || ''}
                                onChange={(e) => {
                                  const newItems = [...pageData.whyChooseUs.items]
                                  newItems[index] = { ...newItems[index], description: e.target.value }
                                  updateSectionData('whyChooseUs', 'items', newItems)
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Colors & Styles */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">🎨 Colors & Styles</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.whyChooseUs?.colors?.backgroundColor || '#ffffff'}
                                onChange={(e) => updateSectionData('whyChooseUs', 'colors', { ...pageData.whyChooseUs?.colors, backgroundColor: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.whyChooseUs?.colors?.backgroundColor || '#ffffff'}
                                onChange={(e) => updateSectionData('whyChooseUs', 'colors', { ...pageData.whyChooseUs?.colors, backgroundColor: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Title Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.whyChooseUs?.colors?.titleColor || '#1f2937'}
                                onChange={(e) => updateSectionData('whyChooseUs', 'colors', { ...pageData.whyChooseUs?.colors, titleColor: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.whyChooseUs?.colors?.titleColor || '#1f2937'}
                                onChange={(e) => updateSectionData('whyChooseUs', 'colors', { ...pageData.whyChooseUs?.colors, titleColor: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.whyChooseUs?.colors?.textColor || '#4b5563'}
                                onChange={(e) => updateSectionData('whyChooseUs', 'colors', { ...pageData.whyChooseUs?.colors, textColor: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.whyChooseUs?.colors?.textColor || '#4b5563'}
                                onChange={(e) => updateSectionData('whyChooseUs', 'colors', { ...pageData.whyChooseUs?.colors, textColor: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Icon/Accent Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={pageData.whyChooseUs?.colors?.iconColor || '#7c3aed'}
                                onChange={(e) => updateSectionData('whyChooseUs', 'colors', { ...pageData.whyChooseUs?.colors, iconColor: e.target.value })}
                                className="w-10 h-10 rounded cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={pageData.whyChooseUs?.colors?.iconColor || '#7c3aed'}
                                onChange={(e) => updateSectionData('whyChooseUs', 'colors', { ...pageData.whyChooseUs?.colors, iconColor: e.target.value })}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Font Styles */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">🔤 Font Styles</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Title Font Size</label>
                            <div className="flex items-center gap-2">
                              <input type="range" min="16" max="48" value={pageData.whyChooseUs?.styles?.titleFontSize || 30} onChange={(e) => updateSectionData('whyChooseUs', 'styles', { ...pageData.whyChooseUs?.styles, titleFontSize: parseInt(e.target.value) })} className="flex-1" />
                              <span className="text-xs w-8">{pageData.whyChooseUs?.styles?.titleFontSize || 30}px</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Text Font Size</label>
                            <div className="flex items-center gap-2">
                              <input type="range" min="12" max="24" value={pageData.whyChooseUs?.styles?.textFontSize || 16} onChange={(e) => updateSectionData('whyChooseUs', 'styles', { ...pageData.whyChooseUs?.styles, textFontSize: parseInt(e.target.value) })} className="flex-1" />
                              <span className="text-xs w-8">{pageData.whyChooseUs?.styles?.textFontSize || 16}px</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Title Font Weight</label>
                            <select value={pageData.whyChooseUs?.styles?.titleFontWeight || 'bold'} onChange={(e) => updateSectionData('whyChooseUs', 'styles', { ...pageData.whyChooseUs?.styles, titleFontWeight: e.target.value })} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                              <option value="normal">Normal</option><option value="bold">Bold</option><option value="lighter">Light</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Font Family</label>
                            <select value={pageData.whyChooseUs?.styles?.fontFamily || 'inherit'} onChange={(e) => updateSectionData('whyChooseUs', 'styles', { ...pageData.whyChooseUs?.styles, fontFamily: e.target.value })} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                              <option value="inherit">Inherit</option><option value="Arial">Arial</option><option value="Times New Roman">Times New Roman</option><option value="Georgia">Georgia</option><option value="Verdana">Verdana</option><option value="Roboto">Roboto</option><option value="Poppins">Poppins</option><option value="Open Sans">Open Sans</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Text Font Style</label>
                            <select value={pageData.whyChooseUs?.styles?.textFontStyle || 'normal'} onChange={(e) => updateSectionData('whyChooseUs', 'styles', { ...pageData.whyChooseUs?.styles, textFontStyle: e.target.value })} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                              <option value="normal">Normal</option><option value="italic">Italic</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Section Padding</label>
                            <select value={pageData.whyChooseUs?.styles?.padding || 'large'} onChange={(e) => updateSectionData('whyChooseUs', 'styles', { ...pageData.whyChooseUs?.styles, padding: e.target.value })} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                              <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Content Editor - Testimonials */}
              {selectedPage.id === 'home' && pageData && selectedSection === 'testimonials' && (
                <TestimonialsEditor 
                  data={pageData.testimonials} 
                  onUpdate={(data) => {
                    setPageData({ ...pageData, testimonials: data })
                    setHasChanges(true)
                  }}
                />
              )}

              {/* Fallback for unhandled sections */}
              {selectedPage.id === 'home' && pageData && selectedSection && 
               !['hero', 'promotionalBanner', 'trackRecord', 'subjectsOffered', 'methodology', 'testimonials', 'whyChooseUs'].includes(selectedSection) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                  <p className="font-medium">Section "{selectedSection}" editor coming soon!</p>
                  <p className="text-sm mt-1">You can still edit this section in the JSON editor.</p>
                  <Link href="/admin" className="text-sm underline mt-2 inline-block">
                    Go to JSON Editor
                  </Link>
                </div>
              )}

              {/* Teachers Page Editor */}
              {selectedPage.id === 'teachers' && (
                <TeachersEditor />
              )}

              {/* Testimonials Page Editor */}
              {selectedPage.id === 'testimonials' && (
                <TestimonialsPageEditor />
              )}

              {/* Other Pages - Coming Soon */}
              {selectedPage.id !== 'home' && selectedPage.id !== 'header' && selectedPage.id !== 'footer' && selectedPage.id !== 'whatsapp' && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="text-center py-12">
                    <FileEdit className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedPage.name} Editor
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Visual editor for this page is coming soon!
                    </p>
                    <Link 
                      href="/admin"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      Use JSON Editor
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Layout className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a page to edit</h3>
                <p className="text-gray-500">Choose a page from the sidebar to start editing</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Testimonials Editor Component (for Home Page section)
function TestimonialsEditor({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  const [testimonials, setTestimonials] = useState<any[]>(data?.items || [])
  const [isEditing, setIsEditing] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', title: '', content: '', image: '' })

  useEffect(() => {
    setTestimonials(data?.items || [])
  }, [data])

  const handleSave = () => {
    onUpdate({
      ...data,
      items: testimonials
    })
  }

  const handleAdd = () => {
    setFormData({ name: '', title: '', content: '', image: '/images/logo.jpg' })
    setIsEditing(true)
    setEditingIndex(null)
  }

  const handleEdit = (index: number) => {
    setFormData(testimonials[index])
    setIsEditing(true)
    setEditingIndex(index)
  }

  const handleDelete = (index: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const newItems = [...testimonials]
      newItems.splice(index, 1)
      setTestimonials(newItems)
      onUpdate({ ...data, items: newItems })
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.content) {
      alert('Please fill in name and content')
      return
    }
    
    if (editingIndex !== null) {
      const newItems = [...testimonials]
      newItems[editingIndex] = formData
      setTestimonials(newItems)
    } else {
      setTestimonials([...testimonials, formData])
    }
    setIsEditing(false)
    onUpdate({ ...data, items: editingIndex !== null ? testimonials : [...testimonials, formData] })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Testimonials Section
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={data?.title || ''}
                onChange={(e) => onUpdate({ ...data, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={data?.subtitle || ''}
                onChange={(e) => onUpdate({ ...data, subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={data?.ctaButton?.text || ''}
                onChange={(e) => onUpdate({ ...data, ctaButton: { ...data?.ctaButton, text: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
              <input
                type="text"
                value={data?.ctaButton?.link || ''}
                onChange={(e) => onUpdate({ ...data, ctaButton: { ...data?.ctaButton, link: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          {/* Colors & Styles */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">🎨 Colors & Styles</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data?.colors?.backgroundColor || '#f9fafb'}
                    onChange={(e) => onUpdate({ ...data, colors: { ...data?.colors, backgroundColor: e.target.value } })}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={data?.colors?.backgroundColor || '#f9fafb'}
                    onChange={(e) => onUpdate({ ...data, colors: { ...data?.colors, backgroundColor: e.target.value } })}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Title Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data?.colors?.titleColor || '#1f2937'}
                    onChange={(e) => onUpdate({ ...data, colors: { ...data?.colors, titleColor: e.target.value } })}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={data?.colors?.titleColor || '#1f2937'}
                    onChange={(e) => onUpdate({ ...data, colors: { ...data?.colors, titleColor: e.target.value } })}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data?.colors?.textColor || '#4b5563'}
                    onChange={(e) => onUpdate({ ...data, colors: { ...data?.colors, textColor: e.target.value } })}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={data?.colors?.textColor || '#4b5563'}
                    onChange={(e) => onUpdate({ ...data, colors: { ...data?.colors, textColor: e.target.value } })}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Card Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data?.colors?.cardBackground || '#ffffff'}
                    onChange={(e) => onUpdate({ ...data, colors: { ...data?.colors, cardBackground: e.target.value } })}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={data?.colors?.cardBackground || '#ffffff'}
                    onChange={(e) => onUpdate({ ...data, colors: { ...data?.colors, cardBackground: e.target.value } })}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Font Styles */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">🔤 Font Styles</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Title Font Size</label>
                <div className="flex items-center gap-2">
                  <input type="range" min="16" max="48" value={data?.styles?.titleFontSize || 36} onChange={(e) => onUpdate({ ...data, styles: { ...data?.styles, titleFontSize: parseInt(e.target.value) }})} className="flex-1" />
                  <span className="text-xs w-8">{data?.styles?.titleFontSize || 36}px</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Text Font Size</label>
                <div className="flex items-center gap-2">
                  <input type="range" min="12" max="24" value={data?.styles?.textFontSize || 16} onChange={(e) => onUpdate({ ...data, styles: { ...data?.styles, textFontSize: parseInt(e.target.value) }})} className="flex-1" />
                  <span className="text-xs w-8">{data?.styles?.textFontSize || 16}px</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Title Font Weight</label>
                <select value={data?.styles?.titleFontWeight || 'bold'} onChange={(e) => onUpdate({ ...data, styles: { ...data?.styles, titleFontWeight: e.target.value }})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                  <option value="normal">Normal</option><option value="bold">Bold</option><option value="lighter">Light</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Font Family</label>
                <select value={data?.styles?.fontFamily || 'inherit'} onChange={(e) => onUpdate({ ...data, styles: { ...data?.styles, fontFamily: e.target.value }})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                  <option value="inherit">Inherit</option><option value="Arial">Arial</option><option value="Times New Roman">Times New Roman</option><option value="Georgia">Georgia</option><option value="Verdana">Verdana</option><option value="Roboto">Roboto</option><option value="Poppins">Poppins</option><option value="Open Sans">Open Sans</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Text Font Style</label>
                <select value={data?.styles?.textFontStyle || 'normal'} onChange={(e) => onUpdate({ ...data, styles: { ...data?.styles, textFontStyle: e.target.value }})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                  <option value="normal">Normal</option><option value="italic">Italic</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Section Padding</label>
                <select value={data?.styles?.padding || 'large'} onChange={(e) => onUpdate({ ...data, styles: { ...data?.styles, padding: e.target.value }})} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                  <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Testimonials ({testimonials.length})
          </h3>
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
        </div>

        {isEditing && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
            <h4 className="font-medium text-gray-900 mb-3">
              {editingIndex !== null ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., GCE 'O' Level Student"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Testimonial content"
                />
              </div>
              <div>
                <ImageUploadField
                  label="Image"
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  placeholder="/images/logo.jpg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.title}</div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">{item.content}</div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <p className="text-gray-500 text-center py-4">No testimonials yet. Click "Add Testimonial" to create one.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Teachers Editor Component
function TeachersEditor() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', role: '', qualifications: [''], image: '/images/logo.jpg' })
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    setIsLoading(true)
    try {
      // Add cache-busting timestamp to ensure we get fresh data
      const response = await fetch(`/content/teachers.json?t=${Date.now()}`)
      const data = await response.json()
      setTeachers(data.teachers || [])
    } catch (error) {
      console.error('Failed to load teachers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveTeachers = async () => {
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'teachers.json',
          content: { teachers },
        }),
      })
      if (response.ok) {
        alert('Teachers saved successfully!')
        setHasChanges(false)
      } else {
        alert('Failed to save teachers')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save teachers')
    }
  }

  const handleAdd = () => {
    setFormData({ name: '', role: '', qualifications: [''], image: '/images/logo.jpg' })
    setIsEditing(true)
    setEditingIndex(null)
  }

  const handleEdit = (index: number) => {
    setFormData({ ...teachers[index], qualifications: [...teachers[index].qualifications] })
    setIsEditing(true)
    setEditingIndex(index)
  }

  const handleDelete = (index: number) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      const newTeachers = [...teachers]
      newTeachers.splice(index, 1)
      setTeachers(newTeachers)
      setHasChanges(true)
    }
  }

  const moveTeacher = (index: number, direction: 'up' | 'down') => {
    const newTeachers = [...teachers]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newTeachers.length) return
    
    // Swap elements
    const temp = newTeachers[index]
    newTeachers[index] = newTeachers[newIndex]
    newTeachers[newIndex] = temp
    
    setTeachers(newTeachers)
    setHasChanges(true)
  }

  const handleQualificationChange = (index: number, value: string) => {
    const newQuals = [...formData.qualifications]
    newQuals[index] = value
    setFormData({ ...formData, qualifications: newQuals })
  }

  const addQualification = () => {
    setFormData({ ...formData, qualifications: [...formData.qualifications, ''] })
  }

  const removeQualification = (index: number) => {
    const newQuals = formData.qualifications.filter((_, i) => i !== index)
    setFormData({ ...formData, qualifications: newQuals })
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.role) {
      alert('Please fill in name and role')
      return
    }
    
    const cleanQualifications = formData.qualifications.filter(q => q.trim() !== '')
    
    if (editingIndex !== null) {
      const newTeachers = [...teachers]
      newTeachers[editingIndex] = { ...formData, qualifications: cleanQualifications }
      setTeachers(newTeachers)
    } else {
      setTeachers([...teachers, { ...formData, qualifications: cleanQualifications }])
    }
    setIsEditing(false)
    setHasChanges(true)
  }

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading teachers...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Teacher Profiles ({teachers.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={loadTeachers}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Reload
            </button>
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Teacher
            </button>
            {hasChanges && (
              <button
                onClick={saveTeachers}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-1"
              >
                <Save className="w-4 h-4" />
                Save All
              </button>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
            <h4 className="font-medium text-gray-900 mb-3">
              {editingIndex !== null ? 'Edit Teacher' : 'Add New Teacher'}
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Teacher name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Science & English Tutor"
                />
              </div>
              <div>
                <ImageUploadField
                  label="Image Path"
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  placeholder="/images/teachers/violet.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                {formData.qualifications.map((qual, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={qual}
                      onChange={(e) => handleQualificationChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Qualification"
                    />
                    {formData.qualifications.length > 1 && (
                      <button
                        onClick={() => removeQualification(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addQualification}
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Qualification
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {teachers.map((teacher, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{teacher.name}</div>
                <div className="text-sm text-purple-600">{teacher.role}</div>
                <div className="text-xs text-gray-500 mt-1">Image: {teacher.image}</div>
                <div className="text-sm text-gray-600 mt-2">
                  {teacher.qualifications?.slice(0, 2).join(', ')}
                  {teacher.qualifications?.length > 2 && '...'}
                </div>
              </div>
              <div className="flex gap-1 ml-4">
                <button
                  onClick={() => moveTeacher(index, 'up')}
                  disabled={index === 0}
                  className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'}`}
                  title="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveTeacher(index, 'down')}
                  disabled={index === teachers.length - 1}
                  className={`p-1 rounded ${index === teachers.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'}`}
                  title="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(index)}
                  className="p-1 rounded text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-1 rounded text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {teachers.length === 0 && (
            <p className="text-gray-500 text-center py-4">No teachers yet. Click "Add Teacher" to create one.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Testimonials Page Editor (for /testimonials page)
function TestimonialsPageEditor() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [pageData, setPageData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', title: '', content: '', image: '' })
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/content/testimonials.json?t=${Date.now()}`)
      const data = await response.json()
      setTestimonials(data.testimonials || [])
      setPageData({ pageTitle: data.pageTitle, pageSubtitle: data.pageSubtitle, callToAction: data.callToAction })
    } catch (error) {
      console.error('Failed to load testimonials:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveTestimonials = async () => {
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'testimonials.json',
          content: { ...pageData, testimonials },
        }),
      })
      if (response.ok) {
        alert('Testimonials saved successfully!')
        setHasChanges(false)
      } else {
        alert('Failed to save')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save testimonials')
    }
  }

  const handleAdd = () => {
    setFormData({ name: '', title: '', content: '', image: '/images/logo.jpg' })
    setIsEditing(true)
    setEditingIndex(null)
  }

  const handleEdit = (index: number) => {
    setFormData(testimonials[index])
    setIsEditing(true)
    setEditingIndex(index)
  }

  const handleDelete = (index: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const newItems = [...testimonials]
      newItems.splice(index, 1)
      setTestimonials(newItems)
      setHasChanges(true)
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.content) {
      alert('Please fill in name and content')
      return
    }
    
    if (editingIndex !== null) {
      const newItems = [...testimonials]
      newItems[editingIndex] = formData
      setTestimonials(newItems)
    } else {
      setTestimonials([...testimonials, formData])
    }
    setIsEditing(false)
    setHasChanges(true)
  }

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading testimonials...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Testimonials Page Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
            <input
              type="text"
              value={pageData.pageTitle || ''}
              onChange={(e) => { setPageData({ ...pageData, pageTitle: e.target.value }); setHasChanges(true) }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Subtitle</label>
            <textarea
              rows={2}
              value={pageData.pageSubtitle || ''}
              onChange={(e) => { setPageData({ ...pageData, pageSubtitle: e.target.value }); setHasChanges(true) }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Testimonials ({testimonials.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={loadTestimonials}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Reload
            </button>
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Testimonial
            </button>
            {hasChanges && (
              <button
                onClick={saveTestimonials}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-1"
              >
                <Save className="w-4 h-4" />
                Save All
              </button>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
            <h4 className="font-medium text-gray-900 mb-3">
              {editingIndex !== null ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <ImageUploadField
                  label="Image Path"
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.title}</div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">{item.content}</div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <p className="text-gray-500 text-center py-4">No testimonials yet. Click "Add Testimonial" to create one.</p>
          )}
        </div>
      </div>
    </div>
  )
}
