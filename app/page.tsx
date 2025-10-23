import Image from 'next/image'
import { BookOpen, Brain, Target, TrendingUp, Users, Award, Lightbulb, CheckCircle } from 'lucide-react'
import TestimonialCard from '@/components/testimonial-card'
import fs from 'fs'
import path from 'path'

// Icon mapping
const iconMap: Record<string, any> = {
  'book-open': BookOpen,
  'brain': Brain,
  'trending-up': TrendingUp,
  'target': Target,
  'lightbulb': Lightbulb
}

export default function Home() {
  // Read content from JSON file
  const filePath = path.join(process.cwd(), 'public', 'content', 'home.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(fileContents)

  const { trackRecord, subjectsOffered, methodology, testimonials } = data

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">
      {/* Track Record Section */}
      <section className="max-w-container px-4 py-8 md:py-12">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 border border-purple-200">
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <Award className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {trackRecord?.title}
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                The owners of Mind Centre, <span className="font-bold text-purple-700">David & Violet Lim</span>, together with their teacher team, have helped <span className="font-bold text-purple-700">hundreds of Primary, Secondary & JC students</span> achieve A's & multiple grade improvements in their examinations over the past 15 years.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mt-4">
                Using our <span className="font-bold text-purple-700">Fast & Systematic Learning Methodologies</span>, we've had the joy of helping <span className="font-bold text-purple-700">5 of our past students enter Medical faculty</span> and others enter Law, Pharmacology, Engineering, Accounting, Dentistry, Veterinary Medicine, Science and other University faculties!
              </p>
            </div>
          </div>

          {/* Hero Image and Video */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 shadow-lg">
              <Image
                src={trackRecord?.certificateImage ?? '/images/cert.jpg'}
                alt={trackRecord?.certificateAlt ?? 'Mind Centre Certificate'}
                fill
                className="object-contain"
              />
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-lg">
              <video 
                controls 
                className="w-full h-full object-contain"
                poster={trackRecord?.videoPoster ?? '/images/logo.jpg'}
              >
                <source src={trackRecord?.videoSrc ?? '/videos/intro.mp4'} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Offered Section */}
      <section className="max-w-container px-4 py-8 md:py-12">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-xl p-4 sm:p-6 md:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-6">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">{subjectsOffered?.title}</h2>
          </div>
          <p className="text-base sm:text-lg leading-relaxed">
            We offer <span className="font-bold text-yellow-300">Primary, Secondary & JC classes</span> teaching our superior mind-focused techniques for <span className="font-bold">English, Chinese & General Paper</span> covering Composition, Comprehension & Summary writing skills. In addition, we teach <span className="font-bold text-yellow-300">'Fast & Systematic'</span> learning and exam preparation methodologies for <span className="font-bold">Science, Math, Economics & Humanities</span> which help students achieve A's & multiple-grade improvement! (Coverage includes AEIS)
          </p>
        </div>
      </section>

      {/* Our Methodology Section */}
      <section className="max-w-container px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
            <span>{methodology?.title}</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            {methodology?.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methodology?.methods?.map((method: any, index: number) => {
            const IconComponent = iconMap[method?.icon] || Brain
            return (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-purple-100 hover:border-purple-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-purple-700 mb-2">{method?.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{method?.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-container px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Award className="w-10 h-10 text-purple-600" />
            {testimonials?.title}
          </h2>
          <p className="text-lg text-gray-700">{testimonials?.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials?.items?.map((testimonial: any, index: number) => (
            <TestimonialCard
              key={index}
              name={testimonial?.name ?? ''}
              title={testimonial?.title ?? ''}
              content={testimonial?.content ?? ''}
              image={testimonial?.image ?? ''}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <a 
            href={testimonials?.ctaButton?.link ?? '/results'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <CheckCircle className="w-5 h-5" />
            {testimonials?.ctaButton?.text ?? 'View More Testimonials'}
          </a>
        </div>
      </section>
    </div>
  )
}
