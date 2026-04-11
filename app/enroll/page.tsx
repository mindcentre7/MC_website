import type { Metadata } from 'next'
import EnrollForm from '../../components/enroll-form'
import fs from 'fs'
import path from 'path'

export const metadata: Metadata = {
  title: 'Enroll Now - Buy 1 Get 1 Free Trial Classes | Mind Centre',
  description: 'Sign up for Buy 1 Get 1 Free trial Science or English/GP classes at Mind Centre. Experience our proven Fast & Systematic learning methodologies. Serangoon & Bedok centres.',
  keywords: [
    'mind centre trial class',
    'free tuition trial singapore',
    'serangoon tuition trial',
    'bedok tuition trial',
    'science tuition singapore',
    'english tuition singapore',
    'buy 1 get 1 free tuition',
  ],
  openGraph: {
    title: 'Enroll Now - Buy 1 Get 1 Free Trial Classes | Mind Centre',
    description: 'Sign up for Buy 1 Get 1 Free trial Science or English/GP classes at Mind Centre. Serangoon & Bedok centres.',
    url: 'https://www.mindcentre.com.sg/enroll',
  },
  alternates: {
    canonical: 'https://www.mindcentre.com.sg/enroll',
  },
}

export default function EnrollPage() {
  const filePath = path.join(process.cwd(), 'public', 'content', 'enroll.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(fileContents)

  const { hero, benefits, uniquePoints, form, page } = data

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${page?.colors?.gradientFrom || '#fffbeb'}, ${page?.colors?.gradientTo || '#fffbeb'})`
      }}
    >
      {/* Hero Banner */}
      <section
        className="py-12 px-4"
        style={{ backgroundColor: hero?.colors?.backgroundColor || '#78350f' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="font-semibold text-sm uppercase tracking-wider mb-3"
            style={{ color: hero?.colors?.badgeColor || '#fcd34d' }}
          >
            {hero?.badge || 'Limited Slots Available'}
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: hero?.colors?.textColor || '#ffffff',
              fontSize: hero?.styles?.titleFontSize ? `${hero.styles.titleFontSize}px` : undefined
            }}
          >
            {hero?.title || 'Secure Your 2 Free Trial Classes'}
          </h1>
          <p
            className="text-lg sm:text-xl leading-relaxed"
            style={{
              color: hero?.colors?.subtitleColor || '#fef3c7',
              fontSize: hero?.styles?.subtitleFontSize ? `${hero.styles.subtitleFontSize}px` : undefined
            }}
          >
            {hero?.subtitle || "Buy 1 Get 1 Free — Experience Mind Centre's proven Fast & Systematic learning methodologies for Science, English & GP"}
          </p>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-6 text-center mb-10">
          {benefits?.items?.map((item: any, i: number) => (
            <div
              key={i}
              className="rounded-xl shadow-lg p-6 border"
              style={{
                backgroundColor: benefits?.colors?.cardBackgroundColor || '#ffffff',
                borderColor: `${benefits?.colors?.accentColor || '#d97706'}30`
              }}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3
                className="font-bold mb-2"
                style={{ color: benefits?.colors?.titleColor || '#92400e' }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm"
                style={{ color: benefits?.colors?.textColor || '#4b5563' }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* What Makes Us Unique */}
        <div
          className="rounded-xl shadow-lg p-6 sm:p-8 border"
          style={{
            backgroundColor: uniquePoints?.colors?.backgroundColor || '#ffffff',
            borderColor: `${uniquePoints?.colors?.accentColor || '#d97706'}30`
          }}
        >
          <h2
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: uniquePoints?.colors?.titleColor || '#92400e' }}
          >
            {uniquePoints?.title || 'What Makes Us Unique?'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {uniquePoints?.items?.map((item: any, i: number) => (
              <div key={i} className="flex gap-3">
                <span
                  className="text-xl flex-shrink-0"
                  style={{ color: uniquePoints?.colors?.accentColor || '#d97706' }}
                >
                  ✓
                </span>
                <div>
                  <h4
                    className="font-semibold text-sm"
                    style={{ color: uniquePoints?.colors?.titleColor || '#92400e' }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-xs"
                    style={{ color: uniquePoints?.colors?.textColor || '#451a03' }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollment Form */}
        <div
          className="rounded-xl shadow-xl p-6 sm:p-8 border-2 mt-10"
          style={{
            backgroundColor: form?.colors?.backgroundColor || '#ffffff',
            borderColor: `${form?.colors?.buttonColor || '#d97706'}60`
          }}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold mb-2 text-center"
            style={{
              color: form?.colors?.titleColor || '#92400e',
              fontSize: form?.styles?.titleFontSize ? `${form.styles.titleFontSize}px` : undefined
            }}
          >
            {form?.title || '⚡ Limited Slots Available ⚡'}
          </h2>
          <p
            className="text-center mb-8 text-sm"
            style={{ color: form?.colors?.subtitleColor || '#4b5563' }}
          >
            {form?.subtitle || 'Fill in the form below and our team will contact you via WhatsApp within 24 hours.'}
          </p>
          <EnrollForm
            buttonText={form?.buttonText}
            successTitle={form?.successTitle}
            successMessage={form?.successMessage}
            successSubtext={form?.successSubtext}
            buttonColor={form?.colors?.buttonColor}
            buttonTextColor={form?.colors?.buttonTextColor}
          />
        </div>
      </section>
    </div>
  )
}
