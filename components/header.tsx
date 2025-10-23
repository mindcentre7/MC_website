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

export default function Header() {
  const [data, setData] = useState<HeaderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/content/header.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load header data:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <header className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white py-4 md:py-6">
      <div className="max-w-7xl px-4">
        {/* Language Switcher - Top Right */}
        <div className="flex justify-end mb-3">
          <LanguageSwitcher />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-white p-2 flex-shrink-0">
            <Image
              src={data?.logo || '/images/logo.jpg'}
              alt="Mind Centre for Learning Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
              <span>{data?.title || 'Mind Centre for Learning'}</span>
            </h1>
            <p className="text-lg sm:text-xl font-semibold flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{data?.tagline || 'Go for A\'s and Multiple Grade Improvements!'}</span>
            </p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <p className="text-sm md:text-base leading-relaxed">
            {data?.promoText1 || 'Are you struggling with your studies? Learn our proven Fast & Systematic study methodologies which have helped many students excel!'}
          </p>
          <p className="text-sm md:text-base leading-relaxed mt-2">
            {data?.promoText2 || 'Go to www.mindcentre.site to secure our special promotion - Buy 1 Get 1 class free for a new subject!'}
          </p>
          <p className="text-sm md:text-base leading-relaxed mt-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{data?.promoText3 || 'RECOMMEND A FIEND and BOTH OF YOU will get a Special $10 discount when he/she signs up for a term!'}</span>
          </p>
        </div>
      </div>
    </header>
  )
}