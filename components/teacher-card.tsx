
import Image from 'next/image'
import { GraduationCap } from 'lucide-react'

interface TeacherCardProps {
  name: string
  role: string
  qualifications: string[]
  image: string
}

export default function TeacherCard({ name, role, qualifications, image }: TeacherCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-purple-100 hover:border-purple-300">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-purple-100 shadow-md">
          <Image
            src={image ?? '/images/logo.png'}
            alt={name ?? 'Teacher'}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="font-bold text-xl text-purple-700 mb-2 flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          {name}
        </h3>
        <p className="text-sm font-semibold text-purple-600 mb-3">{role}</p>
        <div className="w-full text-left space-y-1">
          {qualifications?.map((qual, index) => (
            <p key={index} className="text-sm text-gray-700 leading-relaxed">
              {qual}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
