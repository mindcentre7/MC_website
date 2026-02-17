'use client'

import { Languages } from 'lucide-react'
import { useEffect, useState } from 'react'

// Declare global Google Translate types
declare global {
  interface Window {
    google?: any
    googleTranslateElementInit?: () => void
  }
}

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('en')

  useEffect(() => {
    // Function to initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,zh-CN,ms,ta',
            layout: 0,
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }
    }

    // Load Google Translate script if not already loaded
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value
    setCurrentLang(lang)
    
    // Trigger Google Translate
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (select) {
      select.value = lang
      select.dispatchEvent(new Event('change'))
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentLang}
        onChange={handleChange}
        className="text-sm bg-transparent text-white border border-white/30 rounded px-2 py-1 cursor-pointer font-medium"
        style={{ minWidth: '70px' }}
      >
        <option value="en" className="text-gray-900">English</option>
        <option value="zh-CN" className="text-gray-900">中文</option>
        <option value="ms" className="text-gray-900">Malay</option>
        <option value="ta" className="text-gray-900">Tamil</option>
      </select>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden"></div>
    </div>
  )
}
