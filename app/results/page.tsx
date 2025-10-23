
'use client'

import { Award, FileText, Trophy } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ResultsContent {
  pageTitle: string
  pageSubtitle: string
  resultsSection: {
    title: string
    description: string
    categories: Array<{
      id: string
      label: string
      pdfPath: string
    }>
  }
  testimonialsSection: {
    title: string
    description: string
    buttonText: string
    infoText: string
  }
}

export default function ResultsPage() {
  const [content, setContent] = useState<ResultsContent | null>(null)

  useEffect(() => {
    fetch('/content/results.json')
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

  const handlePDFClick = (pdfPath: string) => {
    window.open(`/api/pdf?file=${pdfPath}`, '_blank')
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <section className="max-w-container px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-12 h-12 text-purple-600" />
            {content.pageTitle}
          </h1>
          <p className="text-lg text-gray-700">{content.pageSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Results Menu */}
          <div className="bg-white rounded-xl shadow-xl p-8 border border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-purple-700">{content.resultsSection.title}</h2>
            </div>
            <p className="text-gray-600 mb-6">{content.resultsSection.description}</p>
            
            <div className="space-y-3">
              {content.resultsSection.categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handlePDFClick(category.pdfPath)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-all duration-200 text-left group"
                >
                  <FileText className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-purple-700">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* More Testimonials Menu */}
          <div className="bg-white rounded-xl shadow-xl p-8 border border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-purple-700">{content.testimonialsSection.title}</h2>
            </div>
            <p className="text-gray-600 mb-6">{content.testimonialsSection.description}</p>
            
            <button
              onClick={() => window.location.href = '/testimonials'}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Trophy className="w-5 h-5" />
              {content.testimonialsSection.buttonText}
            </button>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                {content.testimonialsSection.infoText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
