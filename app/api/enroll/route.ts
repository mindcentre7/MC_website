import { NextResponse } from 'next/server'

const STORE_NAME = 'site-content'
const ENROLLMENTS_KEY = 'enrollments.json'
const MAX_STORED = 500

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
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

    return NextResponse.json({
      success: true,
      message: 'Enrollment inquiry received',
      stored,
    })
  } catch (error) {
    console.error('Enrollment API error:', error)
    return NextResponse.json(
      { error: 'Failed to process enrollment inquiry' },
      { status: 500 }
    )
  }
}
