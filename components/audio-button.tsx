"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useAudio } from "@/hooks/use-audio"
import { forwardRef, useEffect } from "react"
import type { ButtonProps } from "@/components/ui/button"

interface AudioButtonProps extends ButtonProps {
  soundType?: "click" | "button" | "select" | "success" | "error" | "start" | "join" | "copy"
  enableHover?: boolean
}

const AudioButton = forwardRef<HTMLButtonElement, AudioButtonProps>(
  ({ soundType = "button", enableHover = false, onClick, onMouseEnter, children, ...props }, ref) => {
    const { initAudio, playSound, playHover } = useAudio()

    // Initialize audio on first interaction
    useEffect(() => {
      const handleFirstInteraction = () => {
        initAudio()
        document.removeEventListener("click", handleFirstInteraction)
        document.removeEventListener("touchstart", handleFirstInteraction)
      }

      document.addEventListener("click", handleFirstInteraction)
      document.addEventListener("touchstart", handleFirstInteraction)

      return () => {
        document.removeEventListener("click", handleFirstInteraction)
        document.removeEventListener("touchstart", handleFirstInteraction)
      }
    }, [initAudio])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playSound(soundType, 0.4)
      onClick?.(e)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableHover) {
        playHover()
      }
      onMouseEnter?.(e)
    }

    return (
      <Button ref={ref} onClick={handleClick} onMouseEnter={handleMouseEnter} {...props}>
        {children}
      </Button>
    )
  },
)

AudioButton.displayName = "AudioButton"

export default AudioButton
