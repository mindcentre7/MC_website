
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import WhatsAppWidget from '@/components/whatsapp-widget'
import GlobalSettingsLoader from '@/components/global-settings-loader'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mindcentre.com.sg'),
  title: {
    default: 'Mind Centre for Learning - Primary, Secondary & JC Tuition in Singapore | Top PSLE & Exam Results',
    template: '%s | Mind Centre for Learning'
  },
  description: 'Mind Centre for Learning offers primary, secondary & JC tuition in Singapore. Proven results: A\'s for exams. Subjects: English, Chinese, Sciences, Math, Humanities. WhatsApp Call 98388821',
  keywords: [
    'tuition centre',
    'singapore tuition',
    'psle tuition',
    'secondary tuition',
    'jc tuition',
    'english tuition',
    'chinese tuition',
    'science tuition',
    'math tuition',
    'mind centre',
    'primary tuition',
    'O level tuition',
    'A level tuition',
    'tuition Serangoon',
    'tuition Bishan',
    'tuition Hougang',
  ],
  authors: [{ name: 'Mind Centre for Learning' }],
  creator: 'Mind Centre for Learning',
  publisher: 'Mind Centre for Learning',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: 'https://www.mindcentre.com.sg',
    siteName: 'Mind Centre for Learning',
    title: 'Serangoon Tuition | Mind Centre Tuition | Bedok Tuition | Singapore',
    description: 'Mind Centre – Tuition for Pri, Sec, JC For English, Math, Science, GP, Chinese, Geog/SS, POA, including IP, IB in Singapore.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Mind Centre for Learning - Serangoon Tuition & Bedok Tuition',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serangoon Tuition | Mind Centre Tuition | Bedok Tuition | Singapore',
    description: 'Mind Centre – Tuition for Pri, Sec, JC For English, Math, Science, GP, Chinese, Geog/SS, POA, including IP, IB in Singapore.',
    images: ['/opengraph-image'],
    creator: '@mindcentre',
  },
  alternates: {
    canonical: 'https://www.mindcentre.com.sg',
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual code
  },
  icons: {
    icon: '/images/logo.jpg',
    shortcut: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://www.mindcentre.com.sg/#organization',
      name: 'Mind Centre for Learning',
      url: 'https://www.mindcentre.com.sg',
      logo: {
        '@type': 'ImageObject',
        url: 'https://i.ytimg.com/vi/ZfDcQ_oGTZg/hqdefault.jpg',
      },
      description: 'Mind Centre\'s innovative studying techniques have enabled many students to attain A\'s for PSLE, GCE \'N\', \'O\' and \'A\' Levels, IP and IB.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '265 Serangoon Central Drive #04-267',
        addressLocality: 'Singapore',
        postalCode: '550265',
        addressCountry: 'SG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 1.352988,
        longitude: 103.87145899999996,
      },
      telephone: '+65-9740-2024',
      areaServed: [
        {
          '@type': 'City',
          name: 'Serangoon',
        },
        {
          '@type': 'City',
          name: 'Bedok',
        },
        {
          '@type': 'City',
          name: 'Bishan',
        },
      ],
      sameAs: [
        'https://www.facebook.com/mindcentre',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.mindcentre.com.sg/#website',
      url: 'https://www.mindcentre.com.sg',
      name: 'Mind Centre for Learning',
      description: 'Serangoon Tuition | Bedok Tuition | Bishan Tuition - Tuition for Primary, Secondary & JC students',
      publisher: {
        '@id': 'https://www.mindcentre.com.sg/#organization',
      },
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.mindcentre.com.sg/blog?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.mindcentre.com.sg/#localbusiness',
      name: 'Mind Centre for Learning - Serangoon',
      image: 'https://i.pinimg.com/736x/5f/6f/7b/5f6f7bb82c8ffb8314eedb17b7f89c13.jpg',
      url: 'https://www.mindcentre.com.sg',
      telephone: '+65-9740-2024',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '265 Serangoon Central Drive #04-267',
        addressLocality: 'Singapore',
        postalCode: '550265',
        addressCountry: 'SG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 1.352988,
        longitude: 103.87145899999996,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '09:00',
          closes: '21:00',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '150',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.mindcentre.com.sg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '80px' }}>
        <GlobalSettingsLoader />
        <Header />
        <Navigation />
        <main style={{ flex: '1 0 auto' }}>
          {children}
        </main>
        <div className="fixed bottom-0 left-0 right-0 z-50 shadow-lg">
          <Footer />
        </div>
        <WhatsAppWidget />
      </body>
    </html>
  )
}
