'use client'

import { useEffect, useState } from 'react'
import { Facebook, Instagram, Mail } from 'lucide-react'

interface FooterData {
  queryEmailUrl: string
  facebookUrl: string
  twitterUrl: string
  instagramUrl: string
  tiktokUrl?: string
  copyrightText: string
  styles?: {
    backgroundColor?: string
    linkColor?: string
  }
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
    return null
  }

  const footerStyle = {
    backgroundColor: data?.styles?.backgroundColor || '#1f2937',
  }

  const iconColor = data?.styles?.linkColor || '#9ca3af'

  return (
    <footer style={footerStyle}>
      <div className="max-w-7xl px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          {/* Email */}
          {data?.queryEmailUrl && (
            <a
              href={data.queryEmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" style={{ color: iconColor }} />
            </a>
          )}

          {/* Facebook */}
          {data?.facebookUrl && (
            <a
              href={data.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" style={{ color: iconColor }} />
            </a>
          )}

          {/* X (Twitter) */}
          {data?.twitterUrl && (
            <a
              href={data.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="X"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: iconColor }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          )}

          {/* Instagram */}
          {data?.instagramUrl && (
            <a
              href={data.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" style={{ color: iconColor }} />
            </a>
          )}

          {/* TikTok */}
          {(data?.tiktokUrl || true) && (
            <a
              href={data?.tiktokUrl || 'https://www.tiktok.com/@mindcentre'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: iconColor }}>
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </a>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-2 pt-2 text-center">
          <p className="text-xs opacity-60" style={{ color: iconColor }}>
            {data?.copyrightText || '© 2025 Mind Centre for Learning. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
