"use client"

import { useState } from "react"
import AudioButton from "@/components/audio-button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, LogIn, Loader2, XCircle, Edit, Users } from "lucide-react"
import { useGame } from "./game-context"
import { useToast } from "@/hooks/use-toast"
import { useAudio } from "@/hooks/use-audio"
import AvatarSelector from "./avatar-selector"
import type { Avatar } from "./game-context"

export default function JoinGame({ onBack }: { onBack: () => void }) {
  const { joinRoom, isLoading, error } = useGame()
  const [roomCode, setRoomCode] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const { toast } = useToast()
  const { playSuccess, playError, playJoin } = useAudio()

  // Handle join room
  const handleJoinRoom = () => {
    setValidationError(null)

    if (!roomCode.trim()) {
      setValidationError("Room code is required")
      playError() // Play error sound
      return
    }

    if (!playerName.trim()) {
      setValidationError("Your name is required")
      playError() // Play error sound
      return
    }

    joinRoom(roomCode.trim().toUpperCase(), playerName.trim(), selectedAvatar || undefined)
    playJoin() // Play join sound
  }

  // Handle avatar selection
  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar)
    playSuccess() // Play success sound
  }

  return (
    <div className="w-full max-w-lg space-y-10 animate-slide-in-complex">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-violet-500/20 rounded-3xl blur-xl animate-pulse"></div>
        <Card className="relative bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-purple-950/95 border-2 border-cyan-400/40 backdrop-blur-md shadow-[0_0_15px_rgba(8,145,178,0.2)]">
          <CardContent className="p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <AudioButton
                onClick={onBack}
                soundType="click"
                variant="ghost"
                size="icon"
                className="touch-manipulation pointer-events-auto relative z-20 text-white hover:bg-white/20 rounded-full p-2 md:p-3 lg:p-4 border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
              >
                <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
              </AudioButton>

              <div className="text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                  Join Game
                </h2>
              </div>

              <div className="w-12 md:w-14 lg:w-16"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Join Form */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-indigo-500/20 rounded-3xl blur-xl animate-pulse"></div>
        <Card className="relative bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-950/95 border-4 border-blue-500/50 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-6 md:p-8 lg:p-10 text-center">
            <div className="space-y-8">
              <div className="relative">
                <div className="text-3xl md:text-3.5xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  Join a Friend's Game
                </div>
                <div className="flex justify-center">
                  <div className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-4 border-cyan-400/50">
                    <Users className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Avatar Selection */}
                <div className="space-y-3">
                  <label className="text-cyan-200 text-lg font-bold">Choose Avatar (Optional)</label>
                  <div className="flex justify-center">
                    <div className="relative">
                      {selectedAvatar ? (
                        <div
                          className={`w-20 h-20 rounded-full bg-gradient-to-br ${selectedAvatar.color} flex items-center justify-center text-3xl border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform`}
                          onClick={() => setShowAvatarSelector(true)}
                        >
                          {selectedAvatar.emoji}
                        </div>
                      ) : (
                        <div
                          className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setShowAvatarSelector(true)}
                        >
                          <Users className="w-8 h-8 text-white" />
                        </div>
                      )}

                      <AudioButton
                        onClick={() => setShowAvatarSelector(true)}
                        soundType="click"
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </AudioButton>
                    </div>
                  </div>
                  {selectedAvatar && <p className="text-center text-sm text-cyan-300">{selectedAvatar.name}</p>}
                </div>

                {/* Room Code Input */}
                <div className="space-y-3">
                  <label className="text-cyan-200 text-lg font-bold">Room Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={roomCode}
                      onChange={(e) => {
                        setRoomCode(
                          e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "")
                            .substring(0, 6),
                        )
                        setValidationError(null)
                      }}
                      className="w-full px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 bg-gradient-to-r from-white/95 to-cyan-50/95 border-4 border-cyan-400 rounded-2xl font-bold text-lg md:text-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-300 transition-all duration-300 uppercase tracking-widest font-mono text-center"
                      maxLength={6}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl pointer-events-none"></div>
                  </div>
                </div>

                {/* Player Name Input */}
                <div className="space-y-3">
                  <label className="text-cyan-200 text-lg font-bold">Your Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={playerName}
                      onChange={(e) => {
                        setPlayerName(e.target.value)
                        setValidationError(null)
                      }}
                      className="w-full px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 bg-gradient-to-r from-white/95 to-cyan-50/95 border-4 border-cyan-400 rounded-2xl font-bold text-lg md:text-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-300 transition-all duration-300"
                      maxLength={20}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl pointer-events-none"></div>
                  </div>
                </div>

                {/* Error Display */}
                {(validationError || error) && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl blur-sm animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-red-900/60 to-pink-900/60 rounded-xl p-3 md:p-3.5 lg:p-4 border-2 border-red-400/50">
                      <div className="flex items-center justify-center space-x-2">
                        <XCircle className="w-4 h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-red-400" />
                        <span className="text-red-300 font-semibold">{validationError || error}</span>
                      </div>
                    </div>
                  </div>
                )}

                <AudioButton
                  onClick={handleJoinRoom}
                  soundType="join"
                  disabled={isLoading || !roomCode.trim() || !playerName.trim()}
                  className="relative touch-manipulation pointer-events-auto z-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold py-4 md:py-5 lg:py-6 px-8 md:px-10 lg:px-12 rounded-2xl text-lg md:text-xl disabled:from-gray-500 disabled:to-gray-600 shadow-xl transform hover:scale-105 transition-all duration-300"
                  style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                >
                  <div className="flex items-center space-x-3">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                    ) : (
                      <LogIn className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                    <span>{isLoading ? "Joining Room..." : "Join Game"}</span>
                  </div>
                </AudioButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <AvatarSelector
          selectedAvatar={selectedAvatar}
          onSelectAvatar={handleAvatarSelect}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  )
}
