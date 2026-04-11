'use client'

import { useState } from 'react'

export default function EnrollForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')

    const formData = new FormData(e.currentTarget)
    const data = {
      parentName: formData.get('parentName'),
      whatsapp: formData.get('whatsapp'),
      studentName: formData.get('studentName'),
      email: formData.get('email'),
      level: formData.get('level'),
    }

    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setStatus('success')
        e.currentTarget.reset()
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus('error')
    }
  }

  const inputClass = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm border p-3 text-base focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"

  if (status === 'success') {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700 text-lg mb-6">
          We have received your enrollment inquiry for Buy 1 Get 1 Free trial classes.
        </p>
        <p className="text-gray-600">
          Our team will contact you via WhatsApp within 24 hours to confirm your child&apos;s trial class schedule.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="parentName" className="block text-sm font-semibold text-amber-900">
          Parent&apos;s Name *
        </label>
        <input
          required
          type="text"
          name="parentName"
          id="parentName"
          placeholder="Type Parent's name here"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-semibold text-amber-900">
          Parent&apos;s WhatsApp Number *
        </label>
        <input
          required
          type="tel"
          name="whatsapp"
          id="whatsapp"
          placeholder="e.g. 91234567"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="studentName" className="block text-sm font-semibold text-amber-900">
          Student&apos;s Name *
        </label>
        <input
          required
          type="text"
          name="studentName"
          id="studentName"
          placeholder="Type your child's name here"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-amber-900">
          Parent&apos;s Email *
        </label>
        <input
          required
          type="email"
          name="email"
          id="email"
          placeholder="Type email address here"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="level" className="block text-sm font-semibold text-amber-900">
          Current Level *
        </label>
        <select required name="level" id="level" className={inputClass}>
          <option value="">Select level...</option>
          <option value="P1">Primary 1</option>
          <option value="P2">Primary 2</option>
          <option value="P3">Primary 3</option>
          <option value="P4">Primary 4</option>
          <option value="P5">Primary 5</option>
          <option value="P6">Primary 6</option>
          <option value="S1">Secondary 1</option>
          <option value="S2">Secondary 2</option>
          <option value="S3">Secondary 3</option>
          <option value="S4">Secondary 4</option>
          <option value="S5">Secondary 5</option>
          <option value="JC1">JC 1</option>
          <option value="JC2">JC 2</option>
          <option value="IB">IB Programme</option>
          <option value="IP">Integrated Programme</option>
          <option value="AEIS">AEIS</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-amber-600 text-white py-3.5 px-6 rounded-lg font-bold text-lg hover:bg-amber-700 transition-colors disabled:opacity-50 shadow-lg hover:shadow-xl"
      >
        {status === 'submitting' ? 'Submitting...' : 'SECURE MY FREE TRIAL CLASSES'}
      </button>

      {status === 'error' && (
        <p className="text-red-600 text-sm text-center mt-2">
          Something went wrong. Please try again or WhatsApp us directly.
        </p>
      )}
    </form>
  )
}
