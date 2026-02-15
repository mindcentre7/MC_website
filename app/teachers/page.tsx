
'use client'

import { GraduationCap } from 'lucide-react'
import TeacherCard from '@/components/teacher-card'
import { useState, useEffect } from 'react'

interface Teacher {
  name: string
  role: string
  qualifications: string[]
  image: string
}

interface TeachersContent {
  pageTitle: string
  pageSubtitle: string
  teachers: Teacher[]
}

export default function TeachersPage() {
  const [content, setContent] = useState<TeachersContent | null>(null)

  useEffect(() => {
    // Add cache-busting to ensure fresh data is loaded after edits
    fetch(`/content/teachers.json?t=${Date.now()}`)
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
    </div>
  )
}
