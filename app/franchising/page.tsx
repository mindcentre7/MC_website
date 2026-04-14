
'use client'

import { Handshake, Mail, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'

interface FranchisingContent {
  pageTitle: string
  pageSubtitle: string
  content: {
    introduction: string
    mainContent: string[]
    contactHeading: string
    contactInfo: Array<{
      type: string
      label: string
      value: string
      href: string
    }>
    closing: {
      message: string
      signature: string
    }
  }
}

export default function FranchisingPage() {
  const [content, setContent] = useState<FranchisingContent | null>(null)

  useEffect(() => {
    fetch('/api/get-content/franchising.json')
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error('Error loading content:', err))
  }, [])

  if (!content) {
    return (
      <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <section className="max-w-container px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Handshake className="w-12 h-12 text-purple-600" />
            {content.pageTitle}
          </h1>
          <p className="text-lg text-gray-700">{content.pageSubtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 md:p-12 border border-purple-200">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.content.introduction}
            </p>

            {content.content.mainContent?.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="bg-purple-50 rounded-lg p-6 mt-8">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                {content.content.contactHeading}
              </p>

              <div className="space-y-4">
                {content.content.contactInfo?.map((contact, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {contact.type === 'email' ? (
                      <Mail className="w-6 h-6 text-purple-600 flex-shrink-0" />
                    ) : (
                      <Phone className="w-6 h-6 text-purple-600 flex-shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-gray-700">{contact.label}: </span>
                      <a href={contact.href} className="text-purple-600 hover:text-purple-700 hover:underline text-lg">
                        {contact.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-10 pt-8 border-t border-purple-200">
              <p className="text-lg text-gray-700 mb-2">{content.content.closing.message}</p>
              <p className="text-xl font-bold text-purple-700">{content.content.closing.signature}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
