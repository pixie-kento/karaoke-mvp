import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipForward, Volume2, VolumeX, Music, MicOff } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

interface PlayerControlsProps {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onSkip: () => void
  volume: number
  onVolumeChange: (volume: number) => void
  keyAdjustment: number
  onKeyChange: (adjustment: number) => void
  vocalRemoval: boolean
  onVocalRemovalToggle: (enabled: boolean) => void
  isHost: boolean
}

export function PlayerControls({
  isPlaying,
  onPlay,
  onPause,
  onSkip,
  volume,
  onVolumeChange,
  keyAdjustment,
  onKeyChange,
  vocalRemoval,
  onVocalRemovalToggle,
  isHost,
}: PlayerControlsProps) {
  const [isMuted, setIsMuted] = useState(volume === 0)

  const handleMute = () => {
    if (isMuted) {
      onVolumeChange(50) // Restore to 50% if muted
      setIsMuted(false)
    } else {
      onVolumeChange(0)
      setIsMuted(true)
    }
  }

  const handleKeyAdjust = (delta: number) => {
    const newAdjustment = Math.max(-6, Math.min(6, keyAdjustment + delta))
    onKeyChange(newAdjustment)
  }

  if (!isHost) {
    return (
      <div className="text-center text-sm text-muted-foreground p-4">
        Host controls are available on the TV screen
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 bg-background/95 backdrop-blur border-t">
      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={isPlaying ? onPause : onPlay}
          className="h-12 w-12"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={onSkip} className="h-12 w-12">
          <SkipForward className="h-6 w-6" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleMute}>
          {isMuted || volume === 0 ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
        <Slider
          value={[volume]}
          onValueChange={([value]) => {
            onVolumeChange(value)
            setIsMuted(value === 0)
          }}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-12 text-right">{volume}%</span>
      </div>

      {/* Key Adjustment */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-20">Key:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleKeyAdjust(-1)}
          disabled={keyAdjustment <= -6}
        >
          -
        </Button>
        <div className="flex-1 text-center">
          <span className="text-lg font-mono font-bold">
            {keyAdjustment === 0 ? '0' : keyAdjustment > 0 ? `+${keyAdjustment}` : keyAdjustment}
          </span>
          <span className="text-xs text-muted-foreground ml-1">semitones</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleKeyAdjust(1)}
          disabled={keyAdjustment >= 6}
        >
          +
        </Button>
        {keyAdjustment !== 0 && (
          <Button variant="ghost" size="sm" onClick={() => onKeyChange(0)}>
            Reset
          </Button>
        )}
      </div>

      {/* Vocal Removal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {vocalRemoval ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Music className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">Vocal Removal</span>
        </div>
        <Button
          variant={vocalRemoval ? 'default' : 'outline'}
          size="sm"
          onClick={() => onVocalRemovalToggle(!vocalRemoval)}
        >
          {vocalRemoval ? 'On' : 'Off'}
        </Button>
      </div>

      {vocalRemoval && (
        <p className="text-xs text-muted-foreground text-center">
          ⚠️ Vocal removal requires audio processing (coming soon)
        </p>
      )}
      {keyAdjustment !== 0 && (
        <p className="text-xs text-muted-foreground text-center">
          ⚠️ Key adjustment requires audio processing (coming soon)
        </p>
      )}
    </div>
  )
}

