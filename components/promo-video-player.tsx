'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'

interface PromoVideoPlayerProps {
  videoSrc: string
  videoPoster: string
}

export default function PromoVideoPlayer({ videoSrc, videoPoster }: PromoVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(false)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  // Handle video ending
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const handleEnded = () => setIsPlaying(false)
    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [])

  return (
    <div 
      className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      {/* Video Element */}
      <video 
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={videoPoster}
        playsInline
        preload="metadata"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Custom Play Button Overlay - Hidden when playing */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all duration-300">
          <div className="relative">
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 bg-white/30 rounded-full scale-150 animate-ping" />
            {/* Play button */}
            <div className="relative w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <Play className="w-10 h-10 text-purple-700 ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
      )}
      
      {/* Video Title Label - Shows on hover */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls || isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-white font-medium text-sm flex items-center gap-2">
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              Playing... (Click to pause)
            </>
          ) : (
            <>
              <Play className="w-5 h-5" fill="currentColor" />
              Watch Our Introduction Video
            </>
          )}
        </p>
      </div>
    </div>
  )
}
