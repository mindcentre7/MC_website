'use client'

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-purple-700 focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
    >
      Skip to main content
    </a>
  )
}
