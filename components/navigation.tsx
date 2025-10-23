
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Results & More Testimonials', path: '/results' },
  { name: 'Class Schedules', path: '/schedules' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Franchising', path: '/franchising' },
  { name: 'About Us', path: '/about' },
  { name: 'Our Learning System', path: '/learning-system' },
  { name: 'Teachers\' Profiles', path: '/teachers' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
      <div className="max-w-container px-4">
        {/* Mobile menu button */}
        <div className="md:hidden py-3 flex justify-between items-center">
          <span className="font-semibold text-purple-700">Menu</span>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex flex-wrap justify-center gap-1 py-3">
          {navItems?.map((item) => (
            <li key={item?.path}>
              <Link
                href={item?.path ?? '/'}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-purple-100 hover:text-purple-700 hover:shadow-sm ${
                  pathname === item?.path
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-700'
                }`}
              >
                {item?.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu */}
        {isMenuOpen && (
          <ul className="md:hidden pb-3 space-y-1">
            {navItems?.map((item) => (
              <li key={item?.path}>
                <Link
                  href={item?.path ?? '/'}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === item?.path
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                  }`}
                >
                  {item?.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}
