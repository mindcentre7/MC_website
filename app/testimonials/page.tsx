'use client'

import { MessageSquare, Award, Star } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface Testimonial {
  name: string
  title: string
  content: string
  image: string
}

interface TestimonialsContent {
  pageTitle: string
  pageSubtitle: string
  testimonials: Testimonial[]
  callToAction: {
    title: string
    description: string
  }
}

export default function TestimonialsPage() {
  const [content, setContent] = useState<TestimonialsContent | null>(null)

  useEffect(() => {
    fetch(`/content/testimonials.json?t=${Date.now()}`)
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
            <MessageSquare className="w-12 h-12 text-purple-600" />
            {content.pageTitle}
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {content.pageSubtitle}
          </p>
        </div>

        <div className="space-y-8">
          {content.testimonials?.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-purple-200"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 mx-auto md:mx-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-3">
                    <Award className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-purple-700 mb-1">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm md:text-base text-purple-600 font-semibold">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm md:prose-base max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {testimonial.content}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-purple-100 rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-purple-800 mb-3">
              {content.callToAction.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {content.callToAction.description.split('Fast & Systematic').map((part, index, arr) => (
                <span key={index}>
                  {part}
                  {index < arr.length - 1 && <span className="font-bold text-purple-700">Fast & Systematic</span>}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
