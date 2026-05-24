'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { GraduationCap, TrendingUp, Users } from 'lucide-react'
import LanguageSwitcher from './language-switcher'

interface HeaderData {
  logo: string
  title: string
  titleColor?: string
  titleFont?: string
  titleFontSize?: number
  titleBold?: boolean
  titleItalic?: boolean
  tagline: string
  taglineColor?: string
  taglineFont?: string
  taglineFontSize?: number
  taglineBold?: boolean
  taglineItalic?: boolean
  tagline1?: string
  tagline2?: string
  tagline2Color?: string
  tagline2Bold?: boolean
  tagline2Italic?: boolean
  tagline3?: string
  tagline3Color?: string
  tagline3Bold?: boolean
  tagline3Italic?: boolean
  promoText1: string
  promoText1Color?: string
  promoText1Font?: string
  promoText1FontSize?: number
  promoText1Bold?: boolean
  promoText1Italic?: boolean
  promoText2: string
  promoText2Color?: string
  promoText2Font?: string
  promoText2FontSize?: number
  promoText2Bold?: boolean
  promoText2Italic?: boolean
  promoText3: string
  promoText3Color?: string
  promoText3Font?: string
  promoText3FontSize?: number
  promoText3Bold?: boolean
  promoText3Italic?: boolean
  facebookUrl: string
  twitterUrl: string
  instagramUrl: string
  youtubeUrl?: string
  tiktokUrl?: string
  email?: string
}

interface GlobalSettings {
  masterBackground?: string
  masterFont?: string
  masterFontSize?: number
  masterFontColor?: string
  theme?: string
  accentColor?: string
}

// Helper function to build text style object
function buildTextStyle(data: HeaderData | null, prefix: string): React.CSSProperties {
  const style: React.CSSProperties = {}
  const colorKey = `${prefix}Color` as keyof HeaderData
  const fontKey = `${prefix}Font` as keyof HeaderData
  const fontSizeKey = `${prefix}FontSize` as keyof HeaderData
  
  if (data && data[colorKey]) {
    style.color = data[colorKey] as string
  }
  if (data && data[fontKey] && data[fontKey] !== 'inherit') {
    style.fontFamily = data[fontKey] as string
  }
  if (data && data[fontSizeKey]) {
    style.fontSize = `${data[fontSizeKey]}px`
  }
  return style
}

// Helper to get bold style
function getBoldStyle(data: HeaderData | null, prefix: string): string {
  const boldKey = `${prefix}Bold` as keyof HeaderData
  return (data && data[boldKey]) ? 'bold' : 'normal'
}

// Helper to get italic style
function getItalicStyle(data: HeaderData | null, prefix: string): string {
  const italicKey = `${prefix}Italic` as keyof HeaderData
  return (data && data[italicKey]) ? 'italic' : 'normal'
}

export default function Header() {
  const [data, setData] = useState<HeaderData | null>(null)
  const [socialLinks, setSocialLinks] = useState<Partial<HeaderData>>({})
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch header data
    fetch('/api/get-content/header.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load header data:', err))
    
    // Fetch footer data (for social links) — independent state, no race condition
    fetch('/api/get-content/footer.json')
      .then(res => res.json())
      .then(footer => {
        setSocialLinks({
          facebookUrl: footer.facebookUrl,
          instagramUrl: footer.instagramUrl,
          youtubeUrl: footer.youtubeUrl,
          tiktokUrl: footer.tiktokUrl,
        })
      })
      .catch(err => console.error('Failed to load footer data for social links:', err))
    
    // Fetch global settings
    fetch('/api/get-content/global-settings.json')
      .then(res => res.json())
      .then(setGlobalSettings)
      .catch(err => console.error('Failed to load global settings:', err))
      .finally(() => setLoading(false))
  }, [])

  // Social URLs: use footer values, fall back to header values
  const facebookUrl = socialLinks.facebookUrl || data?.facebookUrl
  const instagramUrl = socialLinks.instagramUrl || data?.instagramUrl
  const youtubeUrl = socialLinks.youtubeUrl || data?.youtubeUrl
  const tiktokUrl = socialLinks.tiktokUrl || data?.tiktokUrl

  // Build text styles
  const titleStyle = buildTextStyle(data, 'title')
  const taglineStyle = buildTextStyle(data, 'tagline')
  const promoText1Style = buildTextStyle(data, 'promoText1')
  const promoText3Style = buildTextStyle(data, 'promoText3')

  if (loading) {
    return (
      <header className="bg-white text-gray-900 py-4 md:py-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white text-gray-900 py-4 md:py-6 border-b border-gray-100 w-full">
      <div className="w-full px-4 md:px-8">
        {/* Language Switcher - Top Right */}
        <div className="flex justify-end mb-3">
          <LanguageSwitcher />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-4">
          {/* Logo with transparent background and blend utility */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 flex-shrink-0">
            {/* Elegant subtle shadow instead of heavy glow */}
            <div className="absolute inset-0 bg-gray-50 blur-2xl opacity-30 rounded-full"></div>
            {/* Logo container */}
            <div className="relative w-full h-full bg-transparent flex items-center justify-center">
              <Image
                src={data?.logo || '/images/logo.jpg'}
                alt="Mind Centre for Learning Logo"
                width={200}
                height={200}
                className="object-contain logo-blend"
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
          </div>
          <div className="flex-1 text-center">
            <h1 
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2 flex-wrap text-gray-900 leading-snug tracking-normal"
              style={{ 
                ...titleStyle, 
                lineHeight: 1.5,
                letterSpacing: 'normal',
                fontWeight: getBoldStyle(data, 'title') as any,
                fontStyle: getItalicStyle(data, 'title') as any
              }}
            >
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <span>{data?.title || 'Mind Centre for Learning'}</span>
            </h1>
            {/* TAGLINE WITH CUSTOMIZABLE STYLING - 3 lines */}
            {data?.tagline1 && (
              <p 
                className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2 flex-wrap text-gray-700 leading-snug tracking-normal"
                style={{ 
                  ...taglineStyle, 
                  lineHeight: 1.5,
                  letterSpacing: 'normal',
                  fontWeight: getBoldStyle(data, 'tagline') as any,
                  fontStyle: getItalicStyle(data, 'tagline') as any
                }}
              >
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span>{data.tagline1}</span>
              </p>
            )}
            {data?.tagline2 && (
              <p 
                className="text-base sm:text-lg font-medium flex items-center justify-center gap-2 flex-wrap text-gray-700 leading-snug tracking-normal"
                style={{ 
                  color: data.tagline2Color || undefined,
                  fontWeight: data.tagline2Bold ? 'bold' : 'normal',
                  fontStyle: data.tagline2Italic ? 'italic' : 'normal'
                }}
              >
                <span>{data.tagline2}</span>
              </p>
            )}
            {data?.tagline3 && (
              <p 
                className="text-sm sm:text-base font-medium flex items-center justify-center gap-2 flex-wrap text-gray-700 leading-snug tracking-normal"
                style={{ 
                  color: data.tagline3Color || undefined,
                  fontWeight: data.tagline3Bold ? 'bold' : 'normal',
                  fontStyle: data.tagline3Italic ? 'italic' : 'normal'
                }}
              >
                <span>{data.tagline3}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            {/* YouTube */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            {/* TikTok */}
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.46-1.11 1.14-1.36 1.87-.21.68-.23 1.4-.17 2.1.19 2.17 2.11 3.95 4.3 4.11 1.19.1 2.4-.2 3.4-.9 1.04-.7 1.8-1.8 2.1-2.96.26-1.05.24-2.15.1-3.22-.14-1.07-.4-2.1-.82-3.06-.4-.92-.94-1.77-1.6-2.52z"/></svg>
            </a>
            {/* X (Twitter) */}
            <a
              href={data?.twitterUrl || 'https://x.com/mindcentre'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* Email */}
            <a
              href={`mailto:${data?.email || 'all@mindcentre.sg'}?subject=Query%20from%20Mind%20Centre%20Website&body=Dear%20Mind%20Centre%20Team,%0A%0A`}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </a>
          </div>
        </div>
        
        {/* Promo Texts */}
        {data?.promoText1 && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-lg">
            <p 
              className="text-sm text-center font-medium text-gray-800"
              style={{ 
                ...promoText1Style, 
                lineHeight: 1.5,
                fontWeight: getBoldStyle(data, 'promoText1') as any,
                fontStyle: getItalicStyle(data, 'promoText1') as any
              }}
            >
              {data.promoText1}
            </p>
          </div>
        )}

        {data?.promoText3 && (
          <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-lg">
            <p 
              className="text-sm text-center text-green-800"
              style={{ 
                ...promoText3Style, 
                lineHeight: 1.5,
                fontWeight: getBoldStyle(data, 'promoText3') as any,
                fontStyle: getItalicStyle(data, 'promoText3') as any
              }}
            >
              {data.promoText3}
            </p>
          </div>
        )}
      </div>
    </header>
  )
}
