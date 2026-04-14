'use client'

import { Brain, Target, Users, Heart, BookOpen, CheckCircle, TrendingUp, Award, Star } from 'lucide-react'
import { useState, useEffect } from 'react'

interface LearningMethod {
  number: number
  title: string
  description: string
}

interface UniqueFeature {
  title: string
  description: string
  image: string
}

interface LearningSystemContent {
  pageTitle: string
  pageSubtitle: string
  mindSystem: {
    title: string
    introduction: string
    components: Array<{ title: string; description: string }>
  }
  keyElements: {
    title: string
    elements: string[]
  }
  examPreparation: {
    title: string
    introduction: string
    items: string[]
  }
  learningMethods?: {
    title: string
    subtitle: string
    description: string
    backgroundImage: string
    methods: LearningMethod[]
  }
  uniqueFeatures?: {
    title: string
    subtitle: string
    features: UniqueFeature[]
  }
}

const iconMap: { [key: string]: any } = {
  'Methodology': BookOpen,
  'Inquiry': Brain,
  'Nurturing': Heart,
  'Diligence': Target
}

export default function LearningSystemPage() {
  const [content, setContent] = useState<LearningSystemContent | null>(null)

  useEffect(() => {
    fetch('/api/get-content/learning-system.json')
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
            <Brain className="w-12 h-12 text-purple-600" />
            {content.pageTitle}
          </h1>
          <p className="text-lg text-gray-700">{content.pageSubtitle}</p>
        </div>

        {/* MIND System Introduction */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 border border-purple-200">
            <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">{content.mindSystem.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
              {content.mindSystem.introduction.split("'MIND'").map((part, index, arr) => (
                <span key={index}>
                  {part}
                  {index < arr.length - 1 && <strong className="text-purple-700">'MIND'</strong>}
                </span>
              ))}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {content.mindSystem.components?.map((component, index) => {
                const IconComponent = iconMap[component.title] || BookOpen
                return (
                  <div
                    key={index}
                    className="bg-purple-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 border border-purple-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-600 text-white rounded-lg flex-shrink-0">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-700 mb-2">{component.title}</h3>
                        <p className="text-gray-700 leading-relaxed">{component.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Key Elements */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 border border-purple-200">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-10 h-10 text-purple-600" />
              <h2 className="text-3xl font-bold text-purple-700">{content.keyElements.title}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {content.keyElements.elements?.map((element, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all duration-200"
                >
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{element}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exam Preparation */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 border border-purple-200">
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-10 h-10 text-purple-600" />
              <h2 className="text-3xl font-bold text-purple-700">{content.examPreparation.title}</h2>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {content.examPreparation.introduction}
            </p>

            <div className="space-y-4">
              {content.examPreparation.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all duration-200"
                >
                  <Target className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How Your Child Will Learn - 9 Methods */}
      {content.learningMethods && (
        <section
          className="py-16 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${content.learningMethods.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-purple-900/90"></div>
          <div className="relative max-w-container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">{content.learningMethods.title}</h2>
              <p className="text-purple-200 text-lg">{content.learningMethods.subtitle}</p>
              <p className="text-purple-300 mt-2">{content.learningMethods.description}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {content.learningMethods.methods?.map((method, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-yellow-400 text-purple-900 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                      {method.number}
                    </span>
                    <h3 className="text-white font-semibold text-lg">{method.title}</h3>
                  </div>
                  <p className="text-purple-200 text-sm">{method.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What Makes Us Unique - 6 USPs */}
      {content.uniqueFeatures && (
        <section className="py-16 bg-white">
          <div className="max-w-container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{content.uniqueFeatures.title}</h2>
              <p className="text-gray-600 text-lg">{content.uniqueFeatures.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.uniqueFeatures.features?.map((feature, i) => (
                <div key={i} className="bg-purple-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-purple-100">
                  {feature.image && (
                    <img src={feature.image} alt={feature.title} className="w-24 h-24 mx-auto mb-4 rounded-lg object-cover" />
                  )}
                  <h3 className="text-xl font-semibold text-purple-700 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
