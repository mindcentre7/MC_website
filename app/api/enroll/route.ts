import { NextResponse } from 'next/server'

const STORE_NAME = 'site-content'
const ENROLLMENTS_KEY = 'enrollments.json'
const MAX_STORED = 500
const ENROLL_FORM_NAME = 'enrollment'
const ENROLL_NOTIFY_TO = 'all@mindcentre.sg'

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function siteOrigin(request: Request): string {
  const envUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl) return envUrl.replace(/\/$/, '')
  try {
    return new URL(request.url).origin
  } catch {
    return 'https://mindcentre.sg'
  }
}

async function notifyNetlifyForms(
  origin: string,
  inquiry: {
    parentName: string
    whatsapp: string
    studentName: string
    email: string
    level: string
    timestamp: string
  }
): Promise<boolean> {
  const body = new URLSearchParams({
    'form-name': ENROLL_FORM_NAME,
    parentName: inquiry.parentName,
    whatsapp: inquiry.whatsapp,
    studentName: inquiry.studentName,
    email: inquiry.email,
    level: inquiry.level,
    timestamp: inquiry.timestamp,
    notifyTo: ENROLL_NOTIFY_TO,
  })

  const targets = [`${origin}/__forms.html`, `${origin}/`]
  for (const url of targets) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        redirect: 'manual',
      })
      // Netlify Forms typically 200/302/303; treat those as accepted.
      if (res.status >= 200 && res.status < 400) return true
      console.error(`Enrollment Forms POST ${url} status ${res.status}`)
    } catch (err) {
      console.error(`Enrollment Forms POST ${url} failed:`, err)
    }
  }
  return false
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parentName = asTrimmedString(body.parentName)
    const whatsapp = asTrimmedString(body.whatsapp)
    const studentName = asTrimmedString(body.studentName)
    const email = asTrimmedString(body.email)
    const level = asTrimmedString(body.level)

    if (!parentName || !whatsapp || !studentName || !email || !level) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const inquiry = {
      parentName,
      whatsapp,
      studentName,
      email,
      level,
      timestamp: new Date().toISOString(),
    }

    console.log('=== NEW ENROLLMENT INQUIRY ===')
    console.log(`Parent Name: ${parentName}`)
    console.log(`WhatsApp: ${whatsapp}`)
    console.log(`Student Name: ${studentName}`)
    console.log(`Email: ${email}`)
    console.log(`Level: ${level}`)
    console.log(`Timestamp: ${inquiry.timestamp}`)
    console.log(`Notify: ${ENROLL_NOTIFY_TO}`)
    console.log('==============================')

    let stored = false
    try {
      const { getStore } = await import('@netlify/blobs')
      const store = getStore(STORE_NAME)
      let existing: unknown[] = []
      try {
        const blob = await store.get(ENROLLMENTS_KEY, { type: 'json' })
        if (Array.isArray(blob)) existing = blob
      } catch {
        existing = []
      }
      existing.unshift(inquiry)
      if (existing.length > MAX_STORED) existing = existing.slice(0, MAX_STORED)
      await store.setJSON(ENROLLMENTS_KEY, existing)
      stored = true
    } catch (storeError) {
      console.error('Enrollment Blobs persist failed:', storeError)
    }

    const emailed = await notifyNetlifyForms(siteOrigin(request), inquiry)
    if (!emailed) {
      console.error(`Enrollment email to ${ENROLL_NOTIFY_TO} was not accepted by Netlify Forms`)
    }

    return NextResponse.json({
      success: true,
      message: 'Enrollment inquiry received',
      stored,
      emailed,
    })
  } catch (error) {
    console.error('Enrollment API error:', error)
    return NextResponse.json(
      { error: 'Failed to process enrollment inquiry' },
      { status: 500 }
    )
  }
}
