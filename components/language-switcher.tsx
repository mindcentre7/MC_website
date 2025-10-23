
'use client'

import { Languages } from 'lucide-react'
import { useEffect } from 'react'

// Declare global Google Translate types
declare global {
  interface Window {
    google?: any
    googleTranslateElementInit?: () => void
  }
}

export default function LanguageSwitcher() {
  useEffect(() => {
    // Function to initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,zh-CN,zh-TW,ms,ta,hi', // English, Simplified Chinese, Traditional Chinese, Malay, Tamil, Hindi
            layout: 0, // InlineLayout.SIMPLE
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
    } else if (window.google?.translate?.TranslateElement) {
      // If script already loaded, initialize
      window.googleTranslateElementInit()
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
        <Languages className="w-4 h-4 text-white" />
        <div id="google_translate_element" className="translate-widget"></div>
      </div>
    </div>
  )
}
