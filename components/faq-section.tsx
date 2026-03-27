'use client'

import { useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
  keywords: string[]
}

const faqData: FAQItem[] = [
  {
    category: 'Classes & Schedule',
    question: 'When are the classes held?',
    keywords: ['class', 'timing', 'schedule', 'when', 'timeslot', 'group', 'wed', 'sat', 'sun'],
    answer: `Our group classes are held on:
    <ul class="list-disc list-inside space-y-2 mt-2">
      <li><strong>Wednesday 7:30 PM</strong></li>
      <li><strong>Saturday 9:00 AM</strong></li>
      <li><strong>Sunday 3:00 PM</strong></li>
    </ul>
    <p class="mt-3">If these times don't work for you, we also offer <strong>1-to-1 sessions</strong> at special rates. Our tutors check with students each week what their school is covering and focus on those topics.</p>`
  },
  {
    category: 'Fees & Pricing',
    question: 'What are your tuition fees?',
    keywords: ['fee', 'price', 'cost', 'how much', 'expensive', 'cheap', 'affordable', 'payment'],
    answer: `<div class="space-y-4">
      <div>
        <h4 class="font-semibold text-purple-700">Primary (K1-K2, P1-P6):</h4>
        <ul class="list-disc list-inside mt-1 space-y-1">
          <li>K1/K2, P1-P4: $170 for 4 lessons (1.5h each) = <strong>$28/hr</strong></li>
          <li>P5: $175 (standard), $230 (extended)</li>
          <li>P6: $175 (standard), $230 (extended)</li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-purple-700">Secondary (S1-S4):</h4>
        <ul class="list-disc list-inside mt-1 space-y-1">
          <li>S1: $185 (standard), $245 (extended)</li>
          <li>S2: $190 (standard), $250 (extended)</li>
          <li>S3: $210 (standard), $280 (extended)</li>
          <li>S4: $255-290 (standard), $290-365 (extended)</li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-purple-700">JC (J1-J2):</h4>
        <ul class="list-disc list-inside mt-1 space-y-1">
          <li>J1: $275 (standard), $350 (extended)</li>
          <li>J2: $285 (standard), $365 (extended)</li>
        </ul>
      </div>
      <div class="mt-4 p-3 bg-purple-50 rounded-lg">
        <p class="font-semibold">Other Fees:</p>
        <ul class="list-disc list-inside mt-1">
          <li>Registration: $10 (one-time)</li>
          <li>Materials: $25/subject/half year</li>
        </ul>
      </div>
      <div class="mt-3">
        <p class="font-semibold">Payment Methods:</p>
        <p>Bank transfer, PayNow, Cheque</p>
      </div>
    </div>`
  },
  {
    category: 'Results & Track Record',
    question: 'What results have your students achieved?',
    keywords: ['result', 'improve', 'achievement', 'grade', 'improvement', 'success', 'track record', 'evidence', 'A'],
    answer: `<p>We have a <strong>proven track record</strong>! Many students have achieved A's and multiple grade improvements:</p>
    <ul class="list-disc list-inside space-y-2 mt-3">
      <li>Students attained <strong>AL1, 2, 3 for PSLE</strong></li>
      <li><strong>A's for IP, GCE 'N', 'O', & 'A' level</strong> exams</li>
      <li><strong>5 past students entered Medical faculty</strong></li>
      <li>Others entered Law, Dentistry, Veterinary, Engineering, Accounting</li>
    </ul>
    <div class="mt-4 p-3 bg-purple-50 rounded-lg">
      <p class="font-semibold">Success Stories:</p>
      <ul class="list-disc list-inside mt-1 space-y-1">
        <li>James (O Level): C6 → A2 in English</li>
        <li>Bei Bei (PSLE): D7 (49%) → A</li>
        <li>Frank Li: AL2 for English (2021)</li>
      </ul>
    </div>`
  },
  {
    category: 'Teaching Method',
    question: 'What makes your teaching method different?',
    keywords: ['method', 'technique', 'approach', 'teach', 'learn', 'different', 'why choose'],
    answer: `<p>Our <strong>Fast & Systematic Learning Methodology</strong> includes:</p>
    <ul class="list-disc list-inside space-y-2 mt-3">
      <li><strong>Concept Clarification</strong> - Using exam point study guides (not thick textbooks)</li>
      <li><strong>Application Questions</strong> - With full solutions provided (Fast Method vs slow homework method)</li>
      <li><strong>Topical Tests</strong> - Monthly tests to ensure mastery, scores updated on our system</li>
      <li><strong>Motivation System</strong> - Goal-setting, weekly points, prizes</li>
      <li><strong>School-Aligned</strong> - Tutors follow what your child's school is doing each week</li>
    </ul>
    <p class="mt-3 font-semibold text-purple-700">Research shows: Reading good model compositions floods the brain with good English!</p>`
  },
  {
    category: 'English Tuition',
    question: 'How do you teach English and Composition?',
    keywords: ['english', 'composition', 'writing', 'paper 1', 'paper 2', 'essay', 'language'],
    answer: `<div class="space-y-4">
      <div>
        <h4 class="font-semibold text-purple-700">Paper 1 (Composition):</h4>
        <ul class="list-disc list-inside mt-1 space-y-1">
          <li>Proprietary <strong>Descriptive Phrases sheets</strong> with good sentences</li>
          <li>Students <strong>PLAN</strong> using our key plot techniques (Injury, Anger, Surprise plots)</li>
          <li>We teach <strong>writer's secrets</strong> to create exciting storylines with high climax</li>
          <li>Examples: "Blood oozed out of her wound", "Acute pain ripped through her body"</li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-purple-700">Paper 2 (Comprehension):</h4>
        <ul class="list-disc list-inside mt-1 space-y-1">
          <li><strong>Mind-focus techniques</strong> similar to Brain Research organisations</li>
          <li>Students <strong>underline key words</strong> in questions for better interpretation</li>
          <li>Search for similar key words in passage for answers</li>
          <li>This method ensures students include <strong>ALL content points</strong></li>
        </ul>
      </div>
    </div>`
  },
  {
    category: 'Chinese Tuition',
    question: 'How do you teach Chinese (华文)?',
    keywords: ['chinese', '华文', 'composition', '作文', 'comprehension', '阅读'],
    answer: `<div class="space-y-4">
      <div>
        <h4 class="font-semibold text-purple-700">Paper 1 (Composition 作文):</h4>
        <ul class="list-disc list-inside mt-1 space-y-1">
          <li>Proprietary <strong>Descriptive Phrases sheets</strong> with good sentences</li>
          <li><strong>Simple mind-map planning</strong> before writing</li>
          <li>Writer's methods to create exciting stories with high climax</li>
          <li>Use of <strong>direct speeches</strong> to enhance plots</li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-purple-700">Paper 2 (Comprehension & Vocabulary 阅读与词汇):</h4>
        <ul class="list-disc list-inside mt-1 space-y-1">
          <li><strong>Mind-focus techniques</strong> for comprehension</li>
          <li>Underline key words in questions, search for answers in passage</li>
          <li><strong>MOE vocabulary handbooks</strong> with Hanyu Pinyin & English explanations</li>
          <li>Practice writing sentences with new vocabulary</li>
        </ul>
      </div>
    </div>`
  },
  {
    category: 'Science & Math',
    question: 'How do you teach Science and Math?',
    keywords: ['science', 'math', 'mathematics', 'physics', 'chemistry', 'biology'],
    answer: `<p>Our <strong>Fast & Systematic method</strong> for Science/Math:</p>
    <ol class="list-decimal list-inside space-y-2 mt-3">
      <li><strong>Concept Clarification</strong> - Using exam point study guides</li>
      <li><strong>Application Questions</strong> - With full solutions provided</li>
      <li><strong>Topical Tests</strong> - Monthly tests to ensure mastery</li>
      <li><strong>Motivation System</strong> - Goal-setting, weekly points, prizes</li>
    </ol>
    <p class="mt-3">We also teach <strong>memory techniques including mind-mapping</strong> for remembering facts. Our tutors follow what your child's school is doing - we don't just teach random topics.</p>`
  },
  {
    category: 'Location',
    question: 'Where is Mind Centre located?',
    keywords: ['location', 'address', 'where', 'serangoon', 'bedok', 'bishan', 'nearest mrt'],
    answer: `<div class="space-y-3">
      <p class="font-semibold text-lg">📍 Our Location:</p>
      <p class="bg-purple-50 p-3 rounded-lg"><strong>Block 265, Serangoon Central Drive, #04-267 (Lift C), Singapore 550265</strong></p>
      <div>
        <p class="font-semibold">Areas Served:</p>
        <p>Serangoon, Bedok, Bishan, Hougang</p>
      </div>
      <div>
        <p class="font-semibold">Nearest MRT:</p>
        <p>Serangoon MRT (CC13/NE12) - 5 min walk</p>
      </div>
    </div>`
  },
  {
    category: 'Registration',
    question: 'How do I sign up for classes?',
    keywords: ['join', 'sign up', 'register', 'start', 'come', 'can', 'try', 'enroll'],
    answer: `<p>Great! We'd love to have your child join us!</p>
    <div class="mt-3 space-y-2">
      <p class="font-semibold">What we need:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Your child's name</li>
        <li>Current school & level</li>
        <li>Subjects needed</li>
        <li>Preferred timeslot (Wed 7:30pm, Sat 9am, or Sun 3pm)</li>
      </ul>
    </div>
    <div class="mt-4 p-4 bg-purple-100 rounded-lg text-center">
      <p class="font-semibold text-lg mb-2">Ready to get started?</p>
      <p class="text-purple-700">
        <strong>📞 Call us:</strong> +65 9740 2024<br/>
        <strong>💬 WhatsApp:</strong> +65 9740 2024
      </p>
    </div>`
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFAQs = faqData.filter(faq => 
    searchTerm === '' || 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50" id="faq">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="w-10 h-10 text-purple-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            Everything you need to know about Mind Centre tuition
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search questions... (e.g., fees, schedule, English)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none text-lg"
          />
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-purple-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:bg-purple-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <div className="flex-1">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    {faq.category}
                  </span>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mt-1">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-purple-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5 pt-2">
                  <div 
                    className="text-gray-700 leading-relaxed prose prose-purple max-w-none"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No questions found. Try different keywords or contact us directly!
            </p>
            <a
              href="https://wa.me/6597402024"
              className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6597402024"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
            <a
              href="tel:+6597402024"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              📞 Call +65 9740 2024
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
