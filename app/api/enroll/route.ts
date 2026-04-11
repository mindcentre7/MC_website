import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { parentName, whatsapp, studentName, email, level } = body

    // Validate required fields
    if (!parentName || !whatsapp || !studentName || !email || !level) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Log the enrollment inquiry
    console.log('=== NEW ENROLLMENT INQUIRY ===')
    console.log(`Parent Name: ${parentName}`)
    console.log(`WhatsApp: ${whatsapp}`)
    console.log(`Student Name: ${studentName}`)
    console.log(`Email: ${email}`)
    console.log(`Level: ${level}`)
    console.log(`Timestamp: ${new Date().toISOString()}`)
    console.log('==============================')

    // TODO: Add your preferred backend integration here
    // Examples: send to WhatsApp, email, Google Sheets, database, etc.

    return NextResponse.json({ success: true, message: 'Enrollment inquiry received' })
  } catch (error) {
    console.error('Enrollment API error:', error)
    return NextResponse.json(
      { error: 'Failed to process enrollment inquiry' },
      { status: 500 }
    )
  }
}
