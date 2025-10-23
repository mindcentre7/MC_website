
'use client'

import { Calendar, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SchedulesContent {
  pageTitle: string
  pageSubtitle: string
  locations: Array<{
    name: string
    address: {
      line1: string
      line2: string
    }
    locationInfo: string
    pdfPath: string
  }>
}

export default function SchedulesPage() {
  const [content, setContent] = useState<SchedulesContent | null>(null)

  useEffect(() => {
    fetch('/content/schedules.json')
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

  const handleScheduleClick = (pdfPath: string) => {
    window.open(`/api/pdf?file=${pdfPath}`, '_blank')
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <section className="max-w-container px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Calendar className="w-12 h-12 text-purple-600" />
            {content.pageTitle}
          </h1>
          <p className="text-lg text-gray-700">{content.pageSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {content.locations?.map((location) => (
            <div 
              key={location.name}
              className="bg-white rounded-xl shadow-xl p-8 border border-purple-200 hover:border-purple-400 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-purple-700">{location.name}</h2>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong>
                </p>
                <p className="text-gray-600">
                  {location.address.line1}<br />
                  {location.address.line2}
                </p>
              </div>

              <button
                onClick={() => handleScheduleClick(location.pdfPath)}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Calendar className="w-5 h-5" />
                View {location.name} Schedule (PDF)
              </button>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Location:</strong> {location.locationInfo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
