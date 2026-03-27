
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import WhatsAppWidget from '@/components/whatsapp-widget'
import GlobalSettingsLoader from '@/components/global-settings-loader'
import SkipToContent from '@/components/skip-to-content'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mindcentre.com.sg'),
  title: {
    default: 'Mind Centre for Learning | Top PSLE & O/A Level Tuition SG',
    template: '%s | Mind Centre for Learning'
  },
  description: 'Proven primary, secondary & JC tuition in Singapore. A\'s for PSLE, O/A Levels. English, Math, Science & more. Call 97402024 for a trial class today!',
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
    'tuition Bedok',
    'tuition Bukit Batok',
    'Serangoon Tuition',
    'Bishan Tuition',
    'Bedok Tuition',
    'Bukit Batok Tuition',
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'When are the classes held?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Our group classes are held on Wednesday 7:30 PM, Saturday 9:00 AM, and Sunday 3:00 PM. We also offer 1-to-1 sessions at special rates.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What are your tuition fees?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Primary: $170-230, Secondary: $185-365, JC: $275-365 for 4 lessons. Registration $10, Materials $25/subject. Discounts for multiple subjects.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What results have your students achieved?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Students attained AL1-3 for PSLE, A\'s for IP, GCE \'N\', \'O\', & \'A\' level exams. 5 past students entered Medical faculty and others entered Law, Engineering, and other University faculties.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Where is Mind Centre located?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Block 265, Serangoon Central Drive, #04-267 (Lift C), Singapore 550265. Near Serangoon MRT (CC13/NE12) - 5 min walk.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How do I sign up for classes?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Call or WhatsApp us at +65 9740 2024. We need your child\'s name, school, level, subjects needed, and preferred timeslot.'
      }
    }
  ]
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://www.mindcentre.com.sg/#organization',
      name: 'Mind Centre for Learning',
      alternateName: 'Mind Centre',
      url: 'https://www.mindcentre.com.sg',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mindcentre.com.sg/images/logo.jpg',
      },
      description: 'Mind Centre for Learning is a premier tuition centre in Singapore founded by David and Violet Lim. Specializing in primary, secondary, and JC tuition, offering Fast & Systematic study methodologies that have helped students attain AL1-3 for PSLE and A grades for IP, GCE O-Level, and A-Level examinations. 5 past students have entered Medical faculty.',
      founder: [
        {
          '@type': 'Person',
          name: 'David Lim'
        },
        {
          '@type': 'Person',
          name: 'Violet Lim'
        }
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Blk 265 Serangoon Central Drive #04-267 (Lift C)',
        addressLocality: 'Singapore',
        postalCode: '550265',
        addressCountry: 'SG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 1.353988,
        longitude: 103.872458,
      },
      telephone: '+65 9740 2024',
      email: 'all@mindcentre.sg',
      areaServed: [
        { '@type': 'City', name: 'Serangoon' },
        { '@type': 'City', name: 'Bedok' },
        { '@type': 'City', name: 'Bishan' },
        { '@type': 'City', name: 'Hougang' }
      ],
      sameAs: [
        'https://www.facebook.com/mindcentre',
        'https://www.instagram.com/mindcentreforlearning/',
        'https://x.com/Mindcentre7'
      ],
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Primary School Tuition (PSLE)',
            description: 'Tuition for English, Chinese, Mathematics, and Science for Primary 1 to 6 students preparing for PSLE.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Secondary School Tuition (GCE O-Level & N-Level)',
            description: 'Tuition for English, Mathematics, Sciences, Humanities, and Principles of Accounts for Secondary students.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Junior College Tuition (GCE A-Level & IB)',
            description: 'General Paper (GP), Economics, Mathematics, and Sciences tuition for JC students.'
          }
        }
      ]
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
      telephone: '+65 9740 2024',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className={inter.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '80px' }}>
        <SkipToContent />
        <GlobalSettingsLoader />
        <Header />
        <Navigation />
        <main id="main-content" style={{ flex: '1 0 auto' }}>
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
