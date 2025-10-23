
import Image from 'next/image'
import { Quote } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  title: string
  content: string
  image: string
}

export default function TestimonialCard({ name, title, content, image }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-purple-100">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-purple-100">
          <Image
            src={image ?? '/images/logo.png'}
            alt={name ?? 'Student'}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-purple-700">{name}</h3>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
        <Quote className="w-8 h-8 text-purple-300" />
      </div>
      <p className="text-gray-700 leading-relaxed">{content}</p>
    </div>
  )
}
