'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { GraduationCap, TrendingUp, Users } from 'lucide-react'
import LanguageSwitcher from './language-switcher'

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

interface GlobalSettings {
  masterBackground?: string
  masterFont?: string
  masterFontSize?: number
  masterFontColor?: string
  theme?: string
  accentColor?: string
}

export default function Header() {
  const [data, setData] = useState<HeaderData | null>(null)
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch header data
    fetch('/content/header.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load header data:', err))
    
    // Fetch global settings
    fetch('/content/global-settings.json')
      .then(res => res.json())
      .then(setGlobalSettings)
      .catch(err => console.error('Failed to load global settings:', err))
      .finally(() => setLoading(false))
  }, [])

  // Use accent color from global settings, fallback to purple
  const headerBg = globalSettings.accentColor || '#8b5cf6'
  const headerBgDark = globalSettings.theme === 'dark' ? '#1f2937' : headerBg

  if (loading) {
    return (
      <header style={{ background: `linear-gradient(to right, ${headerBg}, ${headerBgDark})` }} className="text-white py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header style={{ background: `linear-gradient(to right, ${headerBg}, ${headerBgDark})` }} className="text-white py-4 md:py-6">
      <div className="max-w-7xl px-4">
        {/* Language Switcher - Top Right */}
        <div className="flex justify-end mb-3">
          <LanguageSwitcher />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-4">
          {/* Logo with glow effect and transparent background */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-2xl flex-shrink-0">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 blur-2xl opacity-70 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 blur-3xl opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 blur-xl opacity-30"></div>
            {/* Logo container with transparent background */}
            <div className="relative w-full h-full bg-transparent flex items-center justify-center">
              <Image
                src={data?.logo || '/images/logo.jpg'}
                alt="Mind Centre for Learning Logo"
                width={200}
                height={200}
                className="object-contain drop-shadow-2xl"
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
              <span>{data?.title || 'Mind Centre for Learning'}</span>
            </h1>
            {/* CORRECTED TAGLINE WITH YELLOW HIGHLIGHT */}
            <p className="text-lg sm:text-xl font-semibold flex items-center justify-center sm:justify-start gap-2 flex-wrap bg-yellow-100 text-black p-1 rounded-sm">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{data?.tagline || 'Go for A\'s and Multiple Grade Improvements!'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={data?.facebookUrl || 'https://www.facebook.com/mindcentre'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a
              href={data?.instagramUrl || 'https://www.instagram.com/mindcentreforlearning/'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
        
        {/* Promo Texts */}
        {data?.promoText1 && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-center font-medium">{data.promoText1}</p>
          </div>
        )}
      </div>
    </header>
  )
}
