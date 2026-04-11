import type { Metadata } from 'next'
import EnrollForm from '../../components/enroll-form'

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-amber-700 to-amber-900 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-200 font-semibold text-sm uppercase tracking-wider mb-3">
            Limited Slots Available
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Secure Your 2 Free Trial Classes
          </h1>
          <p className="text-lg sm:text-xl text-amber-100 leading-relaxed">
            Buy 1 Get 1 Free — Experience Mind Centre&apos;s proven{' '}
            <strong className="text-white">Fast &amp; Systematic</strong> learning methodologies
            for Science, English &amp; GP
          </p>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-6 text-center mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="font-bold text-amber-900 mb-2">Mind-focused Methods</h3>
            <p className="text-sm text-gray-600">
              Story memory, mind-mapping &amp; brain research techniques for faster learning
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-bold text-amber-900 mb-2">Proven Results</h3>
            <p className="text-sm text-gray-600">
              18+ years experience, 18,000+ students coached, 5 past students in Medical faculty
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-amber-900 mb-2">Exam-ready Skills</h3>
            <p className="text-sm text-gray-600">
              FAST methodologies for Science, English &amp; GP — Primary, Secondary &amp; JC
            </p>
          </div>
        </div>

        {/* What Makes Us Unique - condensed from landing page */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-amber-100 mb-10">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">What Makes Us Unique?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Tailored to Latest Syllabus', desc: 'Master core topics and study techniques for tests and main exams.' },
              { title: 'Live & Recorded Classes', desc: 'Missed a class? Makeup lessons and recordings available.' },
              { title: 'Fast & Systematic Methodologies', desc: 'Proven advantage over slower school methods. 5 past students entered Medical faculty.' },
              { title: 'Teacher Violet & Expert Team', desc: '20+ years teaching experience, 1,800+ students coached with consistent A\'s.' },
              { title: 'Affordable Education', desc: 'Quality education accessible to all at competitive rates.' },
              { title: 'Motivational Methods', desc: 'Goal setting, peer motivation & championship prizes to inspire students.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-amber-500 text-xl flex-shrink-0">✓</span>
                <div>
                  <h4 className="font-semibold text-amber-800 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollment Form */}
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 border-2 border-amber-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2 text-center">
            ⚡ Limited Slots Available ⚡
          </h2>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Fill in the form below and our team will contact you via WhatsApp within 24 hours.
          </p>
          <EnrollForm />
        </div>
      </section>
    </div>
  )
}
