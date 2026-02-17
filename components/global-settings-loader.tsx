'use client'

import { useEffect, useState, useRef } from 'react'

interface GlobalSettings {
  masterBackground?: string
  masterFont?: string
  masterFontSize?: number
  masterFontColor?: string
  theme?: string
  accentColor?: string
  lineHeight?: number
  sectionPadding?: string
}

// Function to apply settings to the DOM
function applySettings(data: GlobalSettings) {
  // Apply master background to body
  if (data.masterBackground) {
    document.body.style.backgroundColor = data.masterBackground
  }
  
  // Apply master font
  if (data.masterFont) {
    // Use CSS variable for dynamic font family
    document.documentElement.style.setProperty('--master-font-family', data.masterFont)
  }
  
  // Apply master font size
  if (data.masterFontSize) {
    document.documentElement.style.setProperty('--master-font-size', `${data.masterFontSize}px`)
  }
  
  // Apply master font color
  if (data.masterFontColor) {
    document.documentElement.style.setProperty('--master-font-color', data.masterFontColor)
  }
  
  // Apply accent color
  if (data.accentColor) {
    document.documentElement.style.setProperty('--accent-color', data.accentColor)
  }
  
  // Apply line height
  if (data.lineHeight) {
    document.body.style.lineHeight = data.lineHeight.toString()
  }
  
  // Apply section padding
  if (data.sectionPadding) {
    const paddingMap: Record<string, string> = {
      small: '1rem',
      medium: '2rem', 
      large: '4rem',
      xl: '6rem'
    }
    document.documentElement.style.setProperty('--section-padding', paddingMap[data.sectionPadding] || '2rem')
  }
}

export default function GlobalSettingsLoader() {
  const [settings, setSettings] = useState<GlobalSettings>({})
  const lastDataRef = useRef<string>('')

  useEffect(() => {
    // Initial load
    const loadSettings = async () => {
      try {
        const response = await fetch('/content/global-settings.json')
        const data = await response.json()
        
        // Convert to string for comparison
        const dataString = JSON.stringify(data)
        
        // Only update if data changed
        if (dataString !== lastDataRef.current) {
          lastDataRef.current = dataString
          setSettings(data)
          applySettings(data)
        }
      } catch (error) {
        console.error('Failed to load global settings:', error)
      }
    }

    // Load settings
    // (already defined above)
    
    // Load initially
    loadSettings()

    // Poll every 2 seconds for live updates (from visual editor changes)
    const intervalId = setInterval(loadSettings, 2000)

    return () => clearInterval(intervalId)
  }, [])

  return null
}
