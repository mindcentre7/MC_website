
import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const file = searchParams.get('file')
    
    if (!file) {
      return new NextResponse('File parameter is required', { status: 400 })
    }

    // Security: Only allow PDF files from specific directories
    if (!file.startsWith('schedules/') && !file.startsWith('results/')) {
      return new NextResponse('Invalid file path', { status: 403 })
    }

    if (!file.endsWith('.pdf')) {
      return new NextResponse('Only PDF files are allowed', { status: 403 })
    }

    const filePath = join(process.cwd(), 'public', 'pdfs', file)
    const fileBuffer = await readFile(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
      },
    })
  } catch (error) {
    console.error('Error serving PDF:', error)
    return new NextResponse('PDF not found', { status: 404 })
  }
}
