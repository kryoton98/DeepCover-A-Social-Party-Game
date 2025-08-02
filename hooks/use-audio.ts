"use client"

import { useCallback, useRef } from "react"

// Audio context for managing sounds
class AudioManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private isEnabled = true

  constructor() {
    if (typeof window !== "undefined") {
      this.initAudioContext()
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.warn("Audio not supported:", error)
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext()
    }

    if (this.audioContext?.state === "suspended") {
      await this.audioContext.resume()
    }
  }

  // Generate different types of sounds
  private createTone(frequency: number, duration: number, type: OscillatorType = "sine"): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      let value = 0

      switch (type) {
        case "sine":
          value = Math.sin(2 * Math.PI * frequency * t)
          break
        case "square":
          value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1
          break
        case "triangle":
          value = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t))
          break
        case "sawtooth":
          value = 2 * (t * frequency - Math.floor(t * frequency + 0.5))
          break
      }

      // Apply envelope (fade in/out)
      const envelope = Math.min(t * 10, 1) * Math.min((duration - t) * 10, 1)
      data[i] = value * envelope * 0.1 // Keep volume low
    }

    return buffer
  }

  private createClickSound(): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * 0.1 // 100ms
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      // Create a click sound with multiple frequencies
      const value =
        Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 20) + Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 30) * 0.5
      data[i] = value * 0.3
    }

    return buffer
  }

  private createSuccessSound(): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * 0.5 // 500ms
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      // Create an ascending chord
      const freq1 = 523.25 // C5
      const freq2 = 659.25 // E5
      const freq3 = 783.99 // G5

      const value =
        Math.sin(2 * Math.PI * freq1 * t) * Math.exp(-t * 2) +
        Math.sin(2 * Math.PI * freq2 * t) * Math.exp(-t * 2) * 0.7 +
        Math.sin(2 * Math.PI * freq3 * t) * Math.exp(-t * 2) * 0.5

      data[i] = value * 0.2
    }

    return buffer
  }

  private createErrorSound(): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * 0.3 // 300ms
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      // Create a descending dissonant sound
      const freq1 = 200 + Math.sin(t * 10) * 50 // Wobbling low frequency
      const freq2 = 150 + Math.sin(t * 15) * 30

      const value =
        Math.sin(2 * Math.PI * freq1 * t) * Math.exp(-t * 5) +
        Math.sin(2 * Math.PI * freq2 * t) * Math.exp(-t * 3) * 0.7

      data[i] = value * 0.25
    }

    return buffer
  }

  private createNotificationSound(): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * 0.4 // 400ms
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      // Create a gentle notification sound
      const freq = 880 // A5
      const value = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 3)

      // Add a slight echo
      if (t > 0.1) {
        const echoValue = Math.sin(2 * Math.PI * freq * (t - 0.1)) * Math.exp(-(t - 0.1) * 5) * 0.3
        data[i] = (value + echoValue) * 0.15
      } else {
        data[i] = value * 0.15
      }
    }

    return buffer
  }

  private createHoverSound(): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * 0.05 // 50ms
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      // Create a subtle hover sound
      const freq = 1000
      const value = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 20)
      data[i] = value * 0.05 // Very quiet
    }

    return buffer
  }

  // Initialize all sounds
  async initSounds() {
    if (!this.audioContext) return

    await this.ensureAudioContext()

    // Create and store all sound effects
    const clickBuffer = this.createClickSound()
    const successBuffer = this.createSuccessSound()
    const errorBuffer = this.createErrorSound()
    const notificationBuffer = this.createNotificationSound()
    const hoverBuffer = this.createHoverSound()

    if (clickBuffer) this.sounds.set("click", clickBuffer)
    if (successBuffer) this.sounds.set("success", successBuffer)
    if (errorBuffer) this.sounds.set("error", errorBuffer)
    if (notificationBuffer) this.sounds.set("notification", notificationBuffer)
    if (hoverBuffer) this.sounds.set("hover", hoverBuffer)

    // Create specific game sounds
    const buttonBuffer = this.createTone(600, 0.1, "sine")
    const selectBuffer = this.createTone(800, 0.15, "triangle")
    const startBuffer = this.createTone(440, 0.3, "sine")
    const joinBuffer = this.createTone(660, 0.2, "triangle")
    const copyBuffer = this.createTone(1000, 0.1, "square")

    if (buttonBuffer) this.sounds.set("button", buttonBuffer)
    if (selectBuffer) this.sounds.set("select", selectBuffer)
    if (startBuffer) this.sounds.set("start", startBuffer)
    if (joinBuffer) this.sounds.set("join", joinBuffer)
    if (copyBuffer) this.sounds.set("copy", copyBuffer)
  }

  async playSound(soundName: string, volume = 1) {
    if (!this.isEnabled || !this.audioContext) return

    await this.ensureAudioContext()

    const buffer = this.sounds.get(soundName)
    if (!buffer) return

    try {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()

      source.buffer = buffer
      gainNode.gain.value = Math.min(volume, 1)

      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      source.start()
    } catch (error) {
      console.warn("Error playing sound:", error)
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }

  isAudioEnabled() {
    return this.isEnabled
  }
}

// Global audio manager instance
let audioManager: AudioManager | null = null

export function useAudio() {
  const initPromiseRef = useRef<Promise<void> | null>(null)

  const getAudioManager = useCallback(() => {
    if (!audioManager) {
      audioManager = new AudioManager()
    }
    return audioManager
  }, [])

  const initAudio = useCallback(async () => {
    if (initPromiseRef.current) {
      return initPromiseRef.current
    }

    initPromiseRef.current = getAudioManager().initSounds()
    return initPromiseRef.current
  }, [getAudioManager])

  const playSound = useCallback(
    async (soundName: string, volume = 1) => {
      const manager = getAudioManager()
      await manager.playSound(soundName, volume)
    },
    [getAudioManager],
  )

  const setAudioEnabled = useCallback(
    (enabled: boolean) => {
      getAudioManager().setEnabled(enabled)
    },
    [getAudioManager],
  )

  const isAudioEnabled = useCallback(() => {
    return getAudioManager().isAudioEnabled()
  }, [getAudioManager])

  // Specific sound functions for common interactions
  const playClick = useCallback(() => playSound("click", 0.3), [playSound])
  const playButton = useCallback(() => playSound("button", 0.4), [playSound])
  const playSelect = useCallback(() => playSound("select", 0.3), [playSound])
  const playSuccess = useCallback(() => playSound("success", 0.5), [playSound])
  const playError = useCallback(() => playSound("error", 0.4), [playSound])
  const playNotification = useCallback(() => playSound("notification", 0.3), [playSound])
  const playHover = useCallback(() => playSound("hover", 0.1), [playSound])
  const playStart = useCallback(() => playSound("start", 0.6), [playSound])
  const playJoin = useCallback(() => playSound("join", 0.4), [playSound])
  const playCopy = useCallback(() => playSound("copy", 0.3), [playSound])

  return {
    initAudio,
    playSound,
    setAudioEnabled,
    isAudioEnabled,
    // Specific sounds
    playClick,
    playButton,
    playSelect,
    playSuccess,
    playError,
    playNotification,
    playHover,
    playStart,
    playJoin,
    playCopy,
  }
}
