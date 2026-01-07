import { useEffect, useRef, useState } from 'react'
import { QueueItem } from '@/types'
import { PlayerControls } from './PlayerControls'

// YouTube IFrame API types
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface VideoPlayerProps {
  currentSong: QueueItem | null
  onSongEnd: () => void
  isHost: boolean
  volume?: number
  onVolumeChange?: (volume: number) => void
  keyAdjustment?: number
  onKeyChange?: (adjustment: number) => void
  vocalRemoval?: boolean
  onVocalRemovalToggle?: (enabled: boolean) => void
}

export function VideoPlayer({
  currentSong,
  onSongEnd,
  isHost,
  volume = 100,
  onVolumeChange,
  keyAdjustment = 0,
  onKeyChange,
  vocalRemoval = false,
  onVocalRemovalToggle,
}: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [currentVolume, setCurrentVolume] = useState(volume)

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initializePlayer()
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      initializePlayer()
    }
  }, [])

  // Note: YouTube IFrame API doesn't provide direct access to audio stream
  // For MVP, we implement basic volume control
  // Advanced features (pitch shifting, vocal removal) would require:
  // - Processing the actual audio stream (not available via IFrame API)
  // - Using a library like Tone.js or Web Audio API with audio capture
  // - Or integrating with a service that processes YouTube audio

  const initializePlayer = () => {
    if (!playerRef.current || playerInstanceRef.current) return

    playerInstanceRef.current = new window.YT.Player(playerRef.current, {
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          setIsReady(true)
          if (currentSong) {
            event.target.loadVideoById(currentSong.video_id)
          }
          // Setup audio context after player is ready
          const iframe = playerRef.current?.querySelector('iframe')
          if (iframe) {
            // YouTube player audio is handled through the iframe
            // We'll apply effects through the player's volume and playbackRate
          }
        },
        onStateChange: (event: any) => {
          // YT.PlayerState.PLAYING = 1
          // YT.PlayerState.PAUSED = 2
          // YT.PlayerState.ENDED = 0
          if (event.data === 1) {
            setIsPlaying(true)
            applyAudioEffects()
          } else if (event.data === 2) {
            setIsPlaying(false)
          } else if (event.data === 0) {
            // Video ended
            setIsPlaying(false)
            onSongEnd()
          }
        },
        onError: (event: any) => {
          console.error('YouTube player error:', event.data)
        },
      },
    })
  }

  const applyAudioEffects = () => {
    if (!playerInstanceRef.current || !isReady) return

    // Apply volume (YouTube IFrame API supports this)
    playerInstanceRef.current.setVolume(currentVolume)

    // Note: Key adjustment and vocal removal require audio stream processing
    // which isn't available through YouTube IFrame API
    // These features are UI-ready but would need backend audio processing
    // For MVP, we show the controls but note the limitation
  }

  // Load new video when currentSong changes
  useEffect(() => {
    if (playerInstanceRef.current && currentSong && isReady) {
      playerInstanceRef.current.loadVideoById(currentSong.video_id)
      setIsPlaying(true)
    }
  }, [currentSong?.id, isReady])

  // Apply volume changes
  useEffect(() => {
    if (playerInstanceRef.current && isReady) {
      playerInstanceRef.current.setVolume(currentVolume)
    }
  }, [currentVolume, isReady])

  // Apply effects when they change
  useEffect(() => {
    applyAudioEffects()
  }, [keyAdjustment, vocalRemoval, isReady])

  const handlePlay = () => {
    if (playerInstanceRef.current && isReady) {
      playerInstanceRef.current.playVideo()
    }
  }

  const handlePause = () => {
    if (playerInstanceRef.current && isReady) {
      playerInstanceRef.current.pauseVideo()
    }
  }

  const handleSkip = () => {
    onSongEnd()
  }

  const handleVolumeChange = (newVolume: number) => {
    setCurrentVolume(newVolume)
    onVolumeChange?.(newVolume)
  }

  const handleKeyChange = (adjustment: number) => {
    onKeyChange?.(adjustment)
  }

  const handleVocalRemovalToggle = (enabled: boolean) => {
    onVocalRemovalToggle?.(enabled)
  }

  if (!currentSong) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        <div className="text-center">
          <p className="text-2xl mb-4">No song playing</p>
          <p className="text-muted-foreground">Add songs to the queue to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      <div ref={playerRef} className="flex-1" />
      
      <PlayerControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onSkip={handleSkip}
        volume={currentVolume}
        onVolumeChange={handleVolumeChange}
        keyAdjustment={keyAdjustment}
        onKeyChange={handleKeyChange}
        vocalRemoval={vocalRemoval}
        onVocalRemovalToggle={handleVocalRemovalToggle}
        isHost={isHost}
      />
    </div>
  )
}

