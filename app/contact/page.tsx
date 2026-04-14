
import type { Metadata } from 'next'
import ContactForm from '../../components/contact-form'

// Revalidate every 10 seconds to ensure fresh content
export const revalidate = 10

export const metadata: Metadata = {
  title: 'Contact Us - Serangoon Tuition | Mind Centre',
  description: 'Contact Mind Centre for Learning in Serangoon. Call +65-6634-3411 or WhatsApp +65-9815-6827. Visit us at 265 Serangoon Central Drive, Singapore 550265.',
  keywords: [
    'contact mind centre',
    'serangoon tuition contact',
    'bedok tuition',
    'tuition centre enquiry',
    'singapore tuition',
  ],
  openGraph: {
    title: 'Contact Mind Centre for Learning - Serangoon Tuition',
    description: 'Get in touch with Mind Centre for Learning in Serangoon, Singapore.',
    url: 'https://www.mindcentre.com.sg/contact',
  },
  alternates: {
    canonical: 'https://www.mindcentre.com.sg/contact',
  },
}

import fs from 'fs/promises'
import path from 'path'

interface ContactData {
  branches: Array<{
    name: string
    address: string
    unit: string
    postalCode: string
    phone: string
    whatsapp: string
    color: string
    nearbyLandmarks: string[]
    image?: string
  }>
  operatingHours: {
    weekdays: string
    weekends: string
  }
  email: string
  description: string
}

async function getContactData(): Promise<ContactData> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'content', 'contact.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading contact data:', error)
    // Return default data if file doesn't exist
    return {
      branches: [
        {
          name: "Serangoon Centre",
          address: "265 Serangoon Central Drive",
          unit: "#04-267",
          postalCode: "Singapore 550265",
          phone: "+65-6634-3411",
          whatsapp: "+65-9815-6827",
          color: "purple",
          nearbyLandmarks: [
            "Near Serangoon MRT and NEX",
            "Convenient for Serangoon and Bishan residents",
            "Well-equipped classrooms",
            "Experienced teachers on-site",
            "Safe and conducive learning environment"
          ]
        },
        {
          name: "Bedok Centre",
          address: "209 New Upper Changi Road",
          unit: "#03-651",
          postalCode: "Singapore 460209",
          phone: "+65-6634-3411",
          whatsapp: "+65-9815-6827",
          color: "blue",
          nearbyLandmarks: [
            "Near Bedok MRT and Bedok Mall",
            "Convenient for Bedok and East Coast residents",
            "Modern facilities and resources",
            "Dedicated teaching staff",
            "Comfortable learning spaces"
          ]
        }
      ],
      operatingHours: {
        weekdays: "Monday - Friday: 2:00 PM - 9:00 PM",
        weekends: "Saturday - Sunday: 9:00 AM - 6:00 PM"
      },
      email: "info@mindcentre.com.sg",
      description: "Mind Centre for Learning has two convenient locations to serve students from Serangoon, Bedok, Bishan, and surrounding areas. Both centres are easily accessible by public transport."
    }
  }
}

export default async function ContactPage() {
  const contactData = await getContactData()

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <div className="space-y-6">
            {contactData.branches.map((branch, index) => (
              <div 
                key={index}
                className={`p-6 rounded-lg border ${
                  branch.color === 'purple' 
                    ? 'bg-purple-50 border-purple-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${
                  branch.color === 'purple' ? 'text-purple-900' : 'text-blue-900'
                }`}>
                  {branch.name}
                </h3>
                {branch.image && (
                  <img src={branch.image} alt={`${branch.name} photo`} className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
                <p className="text-gray-700">{branch.address}</p>
                <p className="text-gray-700">{branch.unit}</p>
                <p className="text-gray-700">{branch.postalCode}</p>
                <p className={`font-semibold mt-2 ${
                  branch.color === 'purple' ? 'text-purple-600' : 'text-blue-600'
                }`}>
                  Phone: {branch.phone}
                </p>
                <p className={`font-semibold ${
                  branch.color === 'purple' ? 'text-purple-600' : 'text-blue-600'
                }`}>
                  WhatsApp: {branch.whatsapp}
                </p>
              </div>
            ))}
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Operating Hours</h3>
              <p className="text-gray-700">{contactData.operatingHours.weekdays}</p>
              <p className="text-gray-700">{contactData.operatingHours.weekends}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-700">{contactData.email}</p>
            </div>
            <ContactForm />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Locations</h2>
          <p className="text-gray-700 mb-4">{contactData.description}</p>
          
          {contactData.branches.map((branch, index) => (
            <div 
              key={index}
              className={`p-6 rounded-lg ${index > 0 ? 'mt-6' : ''} ${
                branch.color === 'purple' ? 'bg-purple-50' : 'bg-blue-50'
              }`}
            >
              <h3 className={`text-xl font-semibold mb-3 ${
                branch.color === 'purple' ? 'text-purple-900' : 'text-blue-900'
              }`}>
                Why Choose Our {branch.name.replace(' Centre', '')} Centre?
              </h3>
              <ul className="space-y-2 text-gray-700">
                {branch.nearbyLandmarks.map((landmark, idx) => (
                  <li key={idx}>✓ {landmark}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Location Gallery & Video */}
      {(contactData as any).gallery && (
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{(contactData as any).gallery.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {(contactData as any).gallery.images?.map((img: any, i: number) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-lg">
                <img src={img.src} alt={img.alt} className="w-full h-48 object-cover" />
              </div>
            ))}
          </div>
          {(contactData as any).gallery.video && (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{(contactData as any).gallery.video.title}</h3>
              <div className="max-w-2xl mx-auto aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={(contactData as any).gallery.video.url.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
