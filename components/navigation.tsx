'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

// Default navigation items (fallback)
const defaultNavItems = [
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
  const [navItems, setNavItems] = useState(defaultNavItems)

  // Load navigation from footer.json
  useEffect(() => {
    fetch('/content/header.json')
      .then(res => res.json())
      .then(data => {
        if (data.navigation?.links) {
          setNavItems(data.navigation.links)
        }
      })
      .catch(err => console.log('Using default navigation'))
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm w-full">
      <div className="w-full px-4 md:px-8">
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
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm ${
                  pathname === item?.path 
                    ? 'bg-gray-900 text-white shadow-md' 
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
          <div className="md:hidden py-2 border-t">
            <ul className="space-y-1">
              {navItems?.map((item) => (
                <li key={item?.path}>
                  <Link
                    href={item?.path ?? '/'}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      pathname === item?.path
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
