
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Mind Centre for Learning - Serangoon Tuition & Bedok Tuition'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to right, #7c3aed, #9333ea)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>
          Mind Centre for Learning
        </div>
        <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 20 }}>
          Serangoon Tuition | Bedok Tuition | Bishan Tuition
        </div>
        <div style={{ fontSize: 32, textAlign: 'center', opacity: 0.9 }}>
          Go for A's and Multiple Grade Improvements
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
