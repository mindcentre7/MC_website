
'use client'

import { GraduationCap, Play } from 'lucide-react'
import TeacherCard from '@/components/teacher-card'
import { useState, useEffect } from 'react'

interface Teacher {
  name: string
  role: string
  qualifications: string[]
  image: string
}

interface UniqueItem {
  title: string
  description: string
  image: string
}

interface VideoItem {
  title: string
  description: string
  video: string
  thumbnail: string
}

interface TeachersContent {
  pageTitle: string
  pageSubtitle: string
  teachers: Teacher[]
  uniqueSection?: {
    title: string
    subtitle: string
    items: UniqueItem[]
  }
  videoGallery?: {
    title: string
    subtitle: string
    videos: VideoItem[]
  }
}

export default function TeachersPage() {
  const [content, setContent] = useState<TeachersContent | null>(null)

  useEffect(() => {
    fetch(`/api/get-content/teachers.json`)
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
      {/* Teacher Profiles */}
      <section className="max-w-container px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="w-12 h-12 text-purple-600" />
            {content.pageTitle}
          </h1>
          <p className="text-lg text-gray-700">{content.pageSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.teachers?.map((teacher, index) => (
            <TeacherCard
              key={index}
              name={teacher?.name ?? ''}
              role={teacher?.role ?? ''}
              qualifications={teacher?.qualifications ?? []}
              image={teacher?.image ?? ''}
            />
          ))}
        </div>
      </section>

      {/* What Makes Us Unique */}
      {content.uniqueSection && (
        <section className="bg-purple-900 text-white py-16">
          <div className="max-w-container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">{content.uniqueSection.title}</h2>
              <p className="text-purple-200 text-lg">{content.uniqueSection.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.uniqueSection.items?.map((item, i) => (
                <div key={i} className="bg-purple-800 rounded-xl p-6 text-center hover:bg-purple-700 transition-colors">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-20 h-20 mx-auto mb-4 rounded-lg object-cover" />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-purple-200 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Gallery */}
      {content.videoGallery && (
        <section className="py-16 bg-white">
          <div className="max-w-container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{content.videoGallery.title}</h2>
              <p className="text-gray-600 text-lg">{content.videoGallery.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.videoGallery.videos?.map((v, i) => (
                <div key={i} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video bg-gray-200">
                    <video
                      src={v.video}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      playsInline
                      controls
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{v.title}</h3>
                    <p className="text-gray-500 text-xs">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
