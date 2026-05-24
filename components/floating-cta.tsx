'use client'

import { useState, useEffect } from 'react'
import { GraduationCap } from 'lucide-react'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show after a short delay
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <a
        href="/enroll"
        className="flex items-center gap-2 px-6 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-sm sm:text-base whitespace-nowrap animate-bounce-slow"
        aria-label="Sign up for trial classes"
      >
        <GraduationCap className="w-5 h-5 flex-shrink-0" />
        <span className="hidden sm:inline">Sign up for Buy 1 Get 1 Free Trial Classes (conditions apply)!</span>
        <span className="sm:hidden">Free Trial!</span>
      </a>
    </div>
  )
}
