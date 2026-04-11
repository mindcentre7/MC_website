import Image from 'next/image'
import { BookOpen, Brain, Target, TrendingUp, Users, Award, Lightbulb, CheckCircle, Mic } from 'lucide-react'
import TestimonialCard from '@/components/testimonial-card'
import PromoVideoPlayer from '@/components/promo-video-player'
import fs from 'fs'
import path from 'path'

// Icon mapping
const iconMap: Record<string, any> = {
  'book-open': BookOpen,
  'brain': Brain,
  'trending-up': TrendingUp,
  'target': Target,
  'lightbulb': Lightbulb,
  'mic': Mic,
  'award': Award
}

export default function Home() {
  // Read content from JSON files
  const filePath = path.join(process.cwd(), 'public', 'content', 'home.json')
  const globalSettingsPath = path.join(process.cwd(), 'public', 'content', 'global-settings.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const globalSettingsContents = fs.readFileSync(globalSettingsPath, 'utf8')
  const data = JSON.parse(fileContents)
  const globalSettings = JSON.parse(globalSettingsContents)

  const { trackRecord, subjectsOffered, methodology, testimonials, howYourChildWillLearn } = data

  // Use global master background if set, otherwise use section colors
  const masterBg = globalSettings.masterBackground || '#ffffff'
  
  // Get colors with fallback defaults
  const trackRecordColors = trackRecord?.colors || {}
  const trackRecordStyles = trackRecord?.styles || {}
  const subjectsColors = subjectsOffered?.colors || {}
  const subjectsStyles = subjectsOffered?.styles || {}
  const methodologyColors = methodology?.colors || {}
  const methodologyStyles = methodology?.styles || {}
  const testimonialsColors = testimonials?.colors || {}
  const testimonialsStyles = testimonials?.styles || {}
  const whyChooseUsColors = data?.whyChooseUs?.colors || {}
  const whyChooseUsStyles = data?.whyChooseUs?.styles || {}
  const howLearnColors = howYourChildWillLearn?.colors || {}
  const howLearnStyles = howYourChildWillLearn?.styles || {}

  // Helper to get padding value
  const getPadding = (padding: string) => {
    const map: Record<string, string> = {
      none: '0',
      small: '1rem',
      medium: '2rem',
      large: '3rem',
      xlarge: '4rem'
    }
    return map[padding] || '2rem'
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Track Record Section */}
      <section 
        className="max-w-container px-4"
        style={{ 
          backgroundColor: trackRecordColors.useMasterBackground === true ? masterBg : (trackRecordColors.backgroundColor || masterBg),
          minHeight: trackRecordStyles.minHeight ? `${trackRecordStyles.minHeight}px` : 'auto',
          paddingTop: getPadding(trackRecordStyles.padding || 'medium'),
          paddingBottom: getPadding(trackRecordStyles.padding || 'medium')
        }}
      >
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 text-center">
          <div className="flex flex-col items-center gap-4 mb-6">
            <Award className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 animate-pulse" style={{ color: trackRecordColors.accentColor || '#7c3aed' }} />
            <div>
              <h2 
                className="mb-4"
                style={{ 
                  color: trackRecordColors.titleColor || '#1f2937',
                  fontSize: trackRecordStyles.titleFontSize ? `${trackRecordStyles.titleFontSize}px` : '2rem',
                  fontWeight: trackRecordStyles.titleFontWeight || 'bold'
                }}
              >
                {trackRecord?.title}
              </h2>
              <p 
                className="leading-relaxed w-full px-4"
                style={{ 
                  color: trackRecordColors.textColor || '#4b5563',
                  fontSize: trackRecordStyles.textFontSize ? `${trackRecordStyles.textFontSize}px` : '1rem',
                  fontStyle: trackRecordStyles.textFontStyle || 'normal'
                }}
              >
                The founders of Mind Centre, <strong style={{ color: trackRecordColors.accentColor || '#7c3aed' }}>David Lim & Violet Lim</strong>, along with their expert teacher team, have consistently helped <strong style={{ color: trackRecordColors.accentColor || '#7c3aed' }}>Primary, Secondary & JC students in Serangoon and Bedok</strong> achieve AL1-3 for PSLE, A grades for GCE O-Level, A-Level, and multiple grade improvements over the past 15 years.
              </p>
              <p 
                className="leading-relaxed mt-4 w-full px-4"
                style={{ 
                  color: trackRecordColors.textColor || '#4b5563',
                  fontSize: trackRecordStyles.textFontSize ? `${trackRecordStyles.textFontSize}px` : '1rem',
                  fontStyle: trackRecordStyles.textFontStyle || 'normal'
                }}
              >
                Using our <span className="font-bold" style={{ color: trackRecordColors.accentColor || '#7c3aed' }}>Fast & Systematic Learning Methodologies</span>, we've had the joy of helping <span className="font-bold" style={{ color: trackRecordColors.accentColor || '#7c3aed' }}>5 of our past students enter Medical faculty</span> and others enter Law, Pharmacology, Engineering, Accounting, Dentistry, Veterinary Medicine, Science and other University faculties!
              </p>
            </div>
          </div>

          {/* Hero Image and Video */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <Image
                src={trackRecord?.certificateImage ?? '/images/cert.jpg'}
                alt={trackRecord?.certificateAlt ?? 'Mind Centre Certificate'}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <PromoVideoPlayer 
                videoSrc={trackRecord?.videoSrc ?? '/videos/intro.mp4'}
                videoPoster={trackRecord?.videoPoster ?? '/images/logo.jpg'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How Your Child Will Learn Section */}
      {howYourChildWillLearn && (
        <section
          className="max-w-container px-4"
          style={{
            backgroundColor: howLearnColors.backgroundColor || '#fef3c7',
            paddingTop: getPadding(howLearnStyles.padding || 'large'),
            paddingBottom: getPadding(howLearnStyles.padding || 'large')
          }}
        >
          <div className="text-center mb-8 md:mb-10">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{
                color: howLearnColors.titleColor || '#92400e',
                fontSize: howLearnStyles.titleFontSize ? `${howLearnStyles.titleFontSize}px` : '2.25rem'
              }}
            >
              {howYourChildWillLearn.title}
            </h2>
            <h3
              className="text-xl sm:text-2xl font-bold mb-4"
              style={{ color: howLearnColors.subtitleColor || '#78350f' }}
            >
              {howYourChildWillLearn.subtitle}
            </h3>
            <p
              className="text-base sm:text-lg max-w-4xl mx-auto leading-relaxed"
              style={{
                color: howLearnColors.textColor || '#451a03',
                fontSize: howLearnStyles.textFontSize ? `${howLearnStyles.textFontSize}px` : '1rem'
              }}
            >
              {howYourChildWillLearn.intro}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {howYourChildWillLearn.methods?.map((method: any, index: number) => {
              const IconComponent = iconMap[method?.icon] || Brain
              return (
                <div
                  key={index}
                  className="rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 p-5 hover:-translate-y-1"
                  style={{
                    backgroundColor: howLearnColors.cardBackgroundColor || '#ffffff',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: `${howLearnColors.accentColor || '#d97706'}40`
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="p-2.5 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${howLearnColors.accentColor || '#d97706'}20`, color: howLearnColors.accentColor || '#d97706' }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4
                        className="font-bold text-base mb-1.5"
                        style={{ color: howLearnColors.titleColor || '#92400e' }}
                      >
                        {method?.title}
                      </h4>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: howLearnColors.textColor || '#451a03', fontSize: `${howLearnStyles.textFontSize || 16}px` }}
                      >
                        {method?.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Subjects Offered Section */}
      <section 
        className="max-w-container px-4 py-8 md:py-12"
        style={{ backgroundColor: subjectsColors.useMasterBackground === true ? masterBg : (subjectsColors.backgroundColor || masterBg) }}
      >
        <div 
          className="rounded-xl shadow-xl p-4 sm:p-6 md:p-8 text-white hover:shadow-2xl transition-all duration-300"
          style={{ 
            backgroundColor: subjectsColors.buttonColor || '#2563eb',
            background: `linear-gradient(135deg, ${subjectsColors.buttonColor || '#2563eb'}, ${subjectsColors.buttonColor ? adjustColorBrightness(subjectsColors.buttonColor, -20) : '#1d4ed8'})`
          }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-6">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 animate-bounce" />
            <h2 
              className="text-2xl sm:text-3xl font-bold text-center sm:text-left"
              style={{ 
                color: subjectsColors.titleColor || '#ffffff',
                fontSize: subjectsStyles.titleFontSize ? `${subjectsStyles.titleFontSize}px` : '2rem',
                fontFamily: subjectsStyles.fontFamily && subjectsStyles.fontFamily !== 'inherit' ? subjectsStyles.fontFamily : 'inherit'
              }}
            >
              {subjectsOffered?.title}
            </h2>
          </div>
          <p 
            className="text-base sm:text-lg leading-relaxed"
            style={{ 
              color: subjectsColors.textColor || '#ffffff',
              fontSize: subjectsStyles.textFontSize ? `${subjectsStyles.textFontSize}px` : '1rem',
              fontFamily: subjectsStyles.fontFamily && subjectsStyles.fontFamily !== 'inherit' ? subjectsStyles.fontFamily : 'inherit',
              fontStyle: subjectsStyles.textFontStyle || 'normal'
            }}
          >
            We offer <span className="font-bold text-yellow-300">Primary, Secondary & JC classes</span> teaching our superior mind-focused techniques for <span className="font-bold">English, Chinese & General Paper</span> covering Composition, Comprehension & Summary writing skills. In addition, we teach <span className="font-bold text-yellow-300">'Fast & Systematic'</span> learning and exam preparation methodologies for <span className="font-bold">Science, Math, Economics & Humanities</span> which help students achieve A's & multiple-grade improvement! (Coverage includes AEIS)
          </p>
        </div>
      </section>

      {/* Our Methodology Section */}
      <section 
        className="max-w-container px-4 py-8 md:py-12"
        style={{ backgroundColor: methodologyColors.useMasterBackground === true ? masterBg : (methodologyColors.backgroundColor || masterBg) }}
      >
        <div className="text-center mb-8 md:mb-10">
          <h2 
            className="text-3xl sm:text-4xl font-bold mb-4 flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ 
              color: methodologyColors.titleColor || '#166534',
              fontSize: methodologyStyles.titleFontSize ? `${methodologyStyles.titleFontSize}px` : '2.25rem',
              fontFamily: methodologyStyles.fontFamily && methodologyStyles.fontFamily !== 'inherit' ? methodologyStyles.fontFamily : 'inherit'
            }}
          >
            <Brain className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" style={{ color: methodologyColors.buttonColor || '#16a34a' }} />
            <span>{methodology?.title}</span>
          </h2>
          <p 
            className="text-base sm:text-lg max-w-4xl mx-auto leading-relaxed"
            style={{ 
              color: methodologyColors.textColor || '#15803d',
              fontSize: methodologyStyles.textFontSize ? `${methodologyStyles.textFontSize}px` : '1rem',
              fontFamily: methodologyStyles.fontFamily && methodologyStyles.fontFamily !== 'inherit' ? methodologyStyles.fontFamily : 'inherit',
              fontStyle: methodologyStyles.textFontStyle || 'normal'
            }}
          >
            {methodology?.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methodology?.methods?.map((method: any, index: number) => {
            const IconComponent = iconMap[method?.icon] || Brain
            return (
              <div 
                key={index}
                className="rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 p-6 hover:-translate-y-1"
                style={{ 
                  backgroundColor: methodologyColors.cardBackgroundColor || '#ffffff',
                  borderColor: methodologyColors.buttonColor || '#16a34a',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${methodologyColors.buttonColor || '#16a34a'}20`, color: methodologyColors.buttonColor || '#16a34a' }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="font-bold text-lg mb-2"
                      style={{ color: methodologyColors.titleColor || '#166534' }}
                    >
                      {method?.title}
                    </h3>
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ color: methodologyColors.textColor || '#15803d' }}
                    >
                      {method?.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        className="max-w-container px-4 py-12"
        style={{ 
          backgroundColor: testimonialsColors.useMasterBackground === true ? masterBg : (testimonialsColors.backgroundColor || masterBg),
          paddingTop: getPadding(testimonialsStyles.padding || 'large'),
          paddingBottom: getPadding(testimonialsStyles.padding || 'large')
        }}
      >
        <div className="text-center mb-10">
          <h2 
            className="text-4xl font-bold mb-4 flex items-center justify-center gap-3"
            style={{ 
              color: testimonialsColors.titleColor || '#1f2937',
              fontSize: testimonialsStyles.titleFontSize ? `${testimonialsStyles.titleFontSize}px` : '2.25rem',
              fontFamily: testimonialsStyles.fontFamily && testimonialsStyles.fontFamily !== 'inherit' ? testimonialsStyles.fontFamily : 'inherit'
            }}
          >
            <Award className="w-10 h-10 animate-pulse" style={{ color: testimonialsColors.buttonColor || '#7c3aed' }} />
            {testimonials?.title}
          </h2>
          <p 
            className="text-lg"
            style={{ 
              color: testimonialsColors.subtitleColor || '#6b7280',
              fontSize: testimonialsStyles.textFontSize ? `${testimonialsStyles.textFontSize}px` : '1rem',
              fontFamily: testimonialsStyles.fontFamily && testimonialsStyles.fontFamily !== 'inherit' ? testimonialsStyles.fontFamily : 'inherit',
              fontStyle: testimonialsStyles.textFontStyle || 'normal'
            }}
          >
            {testimonials?.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials?.items?.map((testimonial: any, index: number) => (
            <div 
              key={index}
              className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <TestimonialCard
                name={testimonial?.name ?? ''}
                title={testimonial?.title ?? ''}
                content={testimonial?.content ?? ''}
                image={testimonial?.image ?? ''}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a 
            href={testimonials?.ctaButton?.link ?? '/results'}
            className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
            style={{ 
              backgroundColor: testimonialsColors.buttonColor || '#7c3aed',
              color: testimonialsColors.buttonTextColor || '#ffffff'
            }}
          >
            <CheckCircle className="w-5 h-5" />
            {testimonials?.ctaButton?.text ?? 'View More Testimonials'}
          </a>
        </div>
      </section>

      {/* Why Choose Us Section */}
      {data?.whyChooseUs && (
        <section 
          className="max-w-container px-4 py-12"
          style={{ 
            backgroundColor: whyChooseUsColors.useMasterBackground === true ? masterBg : (whyChooseUsColors.backgroundColor || masterBg),
            paddingTop: getPadding(whyChooseUsStyles.padding || 'large'),
            paddingBottom: getPadding(whyChooseUsStyles.padding || 'large')
          }}
        >
          <div className="text-center mb-10">
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-6 flex items-center justify-center gap-3"
              style={{ 
                color: whyChooseUsColors.titleColor || '#1f2937',
                fontSize: whyChooseUsStyles.titleFontSize ? `${whyChooseUsStyles.titleFontSize}px` : '2.25rem',
                fontFamily: whyChooseUsStyles.fontFamily && whyChooseUsStyles.fontFamily !== 'inherit' ? whyChooseUsStyles.fontFamily : 'inherit',
                fontWeight: whyChooseUsStyles.titleFontWeight || 'bold'
              }}
            >
              {data.whyChooseUs?.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {data.whyChooseUs?.items?.map((item: any, index: number) => {
              const IconComponent = iconMap[item?.icon] || CheckCircle
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 hover:-translate-y-1 flex flex-col items-center"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${whyChooseUsColors.iconColor || '#7c3aed'}20`, color: whyChooseUsColors.iconColor || '#7c3aed' }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 
                    className="font-bold text-lg mb-2"
                    style={{ 
                      color: whyChooseUsColors.titleColor || '#1f2937',
                      fontFamily: whyChooseUsStyles.fontFamily && whyChooseUsStyles.fontFamily !== 'inherit' ? whyChooseUsStyles.fontFamily : 'inherit'
                    }}
                  >
                    {item?.title}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ 
                      color: whyChooseUsColors.textColor || '#4b5563',
                      fontSize: whyChooseUsStyles.textFontSize ? `${whyChooseUsStyles.textFontSize}px` : '1rem',
                      fontFamily: whyChooseUsStyles.fontFamily && whyChooseUsStyles.fontFamily !== 'inherit' ? whyChooseUsStyles.fontFamily : 'inherit',
                      fontStyle: whyChooseUsStyles.textFontStyle || 'normal'
                    }}
                  >
                    {item?.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}
