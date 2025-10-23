
'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import Image from 'next/image'

interface Representative {
  name: string
  location: string
  isOnline: boolean
  phone: string
  avatar: string
}

interface WhatsAppConfig {
  enabled: boolean
  title: string
  subtitle: string
  defaultMessage: string
  representatives: Representative[]
}

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [config, setConfig] = useState<WhatsAppConfig | null>(null)

  useEffect(() => {
    // Load config from JSON
    fetch('/content/whatsapp.json')
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        // Show widget after a short delay if enabled
        if (data.enabled) {
          setTimeout(() => setIsVisible(true), 1000)
        }
      })
      .catch(error => {
        console.error('Error loading WhatsApp config:', error)
      })
  }, [])

  const handleChat = (phone: string) => {
    const message = encodeURIComponent(config?.defaultMessage || 'Hi! I would like to enquire about Mind Centre classes.')
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  if (!isVisible || !config?.enabled || !config?.representatives?.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Box */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 w-80">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{config.title}</h3>
              <p className="text-sm text-green-100">{config.subtitle}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Representatives List */}
          <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
            {config.representatives.map((rep, index) => (
              <button
                key={index}
                onClick={() => handleChat(rep.phone)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="relative flex-shrink-0">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={rep.avatar}
                      alt={rep.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {rep.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                    {rep.name}
                  </h4>
                  <p className="text-sm text-gray-600">{rep.location}</p>
                  <span className={`text-xs font-medium ${rep.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                    {rep.isOnline ? "I'm Online" : 'Offline'}
                  </span>
                </div>

                <MessageCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-2 text-center">
            <p className="text-xs text-gray-500">Powered by WhatsApp</p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 relative"
        aria-label="Open WhatsApp Chat"
      >
        <MessageCircle className="w-6 h-6" />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  )
}
