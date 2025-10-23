'use client'

import { useEffect, useState } from 'react'
import { Facebook, Instagram, Mail, Twitter } from 'lucide-react'

interface FooterData {
  queryEmailUrl: string
  facebookUrl: string
  twitterUrl: string
  instagramUrl: string
  copyrightText: string
}

export default function Footer() {
  const [data, setData] = useState<FooterData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/content/footer.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load footer data:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Query Form */}
          <a
            href={data?.queryEmailUrl || 'mailto:all@mindcentre.sg?subject=Query%20from%20Mind%20Centre%20Website&body=Dear%20Mind%20Centre%20Team,%0A%0A'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Mail className="w-5 h-5" />
            Send us a Query
          </a>

          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            <a
              href={data?.facebookUrl || 'https://www.facebook.com/mindcentre'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Visit our Facebook page"
            >
              <Facebook className="w-5 h-5" />
              <span className="font-medium">Facebook</span>
            </a>
            
            <a
              href={data?.twitterUrl || 'https://x.com/Mindcentre7'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Visit our X page"
            >
              <Twitter className="w-5 h-5" />
              <span className="font-medium">X</span>
            </a>
            
            <a
              href={data?.instagramUrl || 'https://www.instagram.com/mindcentreforlearning/'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Visit our Instagram page"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-medium">Instagram</span>
            </a>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-400">
          <p>{data?.copyrightText || `© ${new Date().getFullYear()} Mind Centre for Learning. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  )
}