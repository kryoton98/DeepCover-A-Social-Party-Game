"use client"

import { useState } from "react"
import AudioButton from "@/components/audio-button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Copy, Users, Crown, Shield, Check, Loader2, Edit } from "lucide-react"
import { useGame } from "./game-context"
import { useToast } from "@/hooks/use-toast"
import { useAudio } from "@/hooks/use-audio"
import AvatarSelector from "./avatar-selector"
import type { Avatar } from "./game-context"

export default function CreateGame({ onBack }: { onBack: () => void }) {
  const { gameRoom, currentPlayer, isLoading, createRoom, startGame, updatePlayerAvatar } = useGame()
  const [playerName, setPlayerName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [copied, setCopied] = useState(false)
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const { toast } = useToast()
  const { playCopy, playSuccess, playError } = useAudio()

  // If no player name is set, show the name input
  const [showNameInput, setShowNameInput] = useState(true)

  // Handle copy room code
  const copyRoomCode = () => {
    if (gameRoom?.roomCode) {
      navigator.clipboard.writeText(gameRoom.roomCode)
      setCopied(true)
      playCopy() // Play copy sound
      toast({
        title: "Room code copied!",
        description: "Share this with your friends to join.",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Handle create room
  const handleCreateRoom = () => {
    if (playerName.trim()) {
      createRoom(playerName.trim(), selectedAvatar || undefined)
      setShowNameInput(false)
      playSuccess() // Play success sound
    } else {
      playError() // Play error sound
      toast({
        title: "Name required",
        description: "Please enter your name to create a room.",
        variant: "destructive",
      })
    }
  }

  // Handle start game
  const handleStartGame = () => {
    if (gameRoom && gameRoom.players.length >= gameRoom.minPlayers) {
      startGame()
      playSuccess() // Play success sound
    } else {
      playError() // Play error sound
      toast({
        title: "Not enough players",
        description: `You need at least ${gameRoom?.minPlayers} players to start.`,
        variant: "destructive",
      })
    }
  }

  // Handle avatar selection
  const handleAvatarSelect = (avatar: Avatar) => {
    if (showNameInput) {
      setSelectedAvatar(avatar)
    } else {
      updatePlayerAvatar(avatar)
      toast({
        title: "Avatar updated!",
        description: `You are now ${avatar.name}`,
      })
    }
    playSuccess() // Play success sound for avatar selection
  }

  // Check if all players are ready
  const allPlayersReady = gameRoom?.players.every((player) => player.isReady) || false

  return (
    <div className="w-full max-w-lg space-y-10 animate-slide-in-complex">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/30 to-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
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
                  Create Game
                </h2>
              </div>

              <div className="w-12 md:w-14 lg:w-16"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showNameInput ? (
        /* Name Input Screen */
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-indigo-500/20 rounded-3xl blur-xl animate-pulse"></div>
          <Card className="relative bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-950/95 border-4 border-blue-500/50 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6 md:p-8 lg:p-10 text-center">
              <div className="space-y-8">
                <div className="relative">
                  <div className="text-3xl md:text-3.5xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    Set Up Your Profile
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

                  {/* Name Input */}
                  <div className="space-y-3">
                    <label className="text-cyan-200 text-lg font-bold">Your Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 bg-gradient-to-r from-white/95 to-cyan-50/95 border-4 border-cyan-400 rounded-2xl font-bold text-lg md:text-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-300 transition-all duration-300"
                        maxLength={20}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl pointer-events-none"></div>
                    </div>
                  </div>

                  <AudioButton
                    onClick={handleCreateRoom}
                    soundType="success"
                    disabled={isLoading || !playerName.trim()}
                    className="relative touch-manipulation pointer-events-auto z-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold py-4 md:py-5 lg:py-6 px-8 md:px-10 lg:px-12 rounded-2xl text-lg md:text-xl disabled:from-gray-500 disabled:to-gray-600 shadow-xl transform hover:scale-105 transition-all duration-300"
                    style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                  >
                    <div className="flex items-center space-x-3">
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                      ) : (
                        <Shield className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                      <span>{isLoading ? "Creating Room..." : "Create Room"}</span>
                    </div>
                  </AudioButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Lobby Screen */
        <div className="space-y-8">
          {/* Room Code Display */}
          {gameRoom && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl animate-pulse"></div>
              <Card className="relative bg-gradient-to-br from-green-900/95 via-emerald-900/95 to-teal-900/95 border-2 border-green-400/50 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6 md:p-8 lg:p-10 text-center">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center space-x-3">
                      <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Room Created!
                      </h3>
                      <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
                      <p className="text-sm opacity-90 mb-2">Share this code with friends</p>
                      <div className="text-4xl font-mono font-bold tracking-widest">{gameRoom.roomCode}</div>
                    </div>

                    <AudioButton
                      onClick={copyRoomCode}
                      soundType="copy"
                      variant="outline"
                      className="w-full bg-white/90 hover:bg-white border-slate-300 text-slate-700 hover:text-slate-900 py-3 font-semibold"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Room Code
                        </>
                      )}
                    </AudioButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Players List */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-indigo-500/20 rounded-3xl blur-xl animate-pulse"></div>
            <Card className="relative bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-950/95 border-4 border-blue-500/50 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-6 md:p-8 lg:p-10">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      Players ({gameRoom?.players.length || 0}/{gameRoom?.maxPlayers || 8})
                    </h3>
                    <p className="text-cyan-200">Waiting for players to join...</p>
                  </div>

                  <div className="space-y-3">
                    {gameRoom?.players.map((player, index) => (
                      <div
                        key={player.id}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-500 ${
                          player.id === currentPlayer?.id
                            ? "bg-gradient-to-br from-cyan-100/95 via-blue-100/95 to-purple-100/95 border-4 border-cyan-400 shadow-2xl scale-105"
                            : "bg-gradient-to-br from-slate-800/90 via-blue-900/90 to-purple-900/90 border-2 border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl"
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              {player.avatar ? (
                                <div
                                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${player.avatar.color} flex items-center justify-center text-xl border-2 border-white shadow-md`}
                                >
                                  {player.avatar.emoji}
                                </div>
                              ) : (
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md ${
                                    player.isHost
                                      ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                                      : "bg-gradient-to-br from-gray-400 to-gray-500"
                                  }`}
                                >
                                  {player.isHost ? <Crown className="w-6 h-6" /> : player.name.charAt(0).toUpperCase()}
                                </div>
                              )}

                              {player.isHost && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <Crown className="w-3 h-3 text-yellow-800" />
                                </div>
                              )}

                              {player.id === currentPlayer?.id && (
                                <AudioButton
                                  onClick={() => setShowAvatarSelector(true)}
                                  soundType="click"
                                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                                >
                                  <Edit className="w-3 h-3" />
                                </AudioButton>
                              )}
                            </div>

                            <div>
                              <span
                                className={`font-bold text-xl ${player.id === currentPlayer?.id ? "text-blue-800" : "text-white"}`}
                              >
                                {player.name}
                                {player.id === currentPlayer?.id && " (You)"}
                              </span>
                              {player.avatar && (
                                <p
                                  className={`text-sm ${player.id === currentPlayer?.id ? "text-blue-600" : "text-cyan-200"}`}
                                >
                                  {player.avatar.name}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            {player.isHost ? (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                                Host
                              </span>
                            ) : player.isReady ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                Ready
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                                Not Ready
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Start Game Button */}
                  {gameRoom && currentPlayer?.isHost && (
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-500/30 via-emerald-500/40 to-cyan-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
                      <AudioButton
                        onClick={handleStartGame}
                        soundType="start"
                        disabled={
                          isLoading ||
                          gameRoom.players.length < gameRoom.minPlayers ||
                          !allPlayersReady ||
                          gameRoom.status !== "waiting"
                        }
                        className="relative touch-manipulation pointer-events-auto z-20 w-full bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 hover:from-green-500 hover:via-emerald-500 hover:to-cyan-500 text-white font-bold py-4 md:py-5 lg:py-6 px-8 md:px-10 lg:px-12 rounded-2xl text-lg md:text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-green-400/50 disabled:opacity-50"
                        style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                      >
                        <div className="flex items-center justify-center space-x-3">
                          {isLoading || gameRoom.status === "starting" ? (
                            <Loader2 className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 animate-spin" />
                          ) : (
                            <Shield className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                          )}
                          <span className="tracking-wide text-lg md:text-xl lg:text-2xl">
                            {isLoading || gameRoom.status === "starting" ? "Starting Game..." : "Start Game"}
                          </span>
                        </div>
                      </AudioButton>
                    </div>
                  )}

                  {/* Status Messages */}
                  {gameRoom && gameRoom.players.length < gameRoom.minPlayers && (
                    <div className="text-center">
                      <p className="text-orange-200 bg-orange-900/60 px-4 py-2 rounded-lg border border-orange-400/50">
                        Need {gameRoom.minPlayers - gameRoom.players.length} more player
                        {gameRoom.minPlayers - gameRoom.players.length !== 1 ? "s" : ""} to start
                      </p>
                    </div>
                  )}

                  {gameRoom && gameRoom.players.length >= gameRoom.minPlayers && !allPlayersReady && (
                    <div className="text-center">
                      <p className="text-blue-200 bg-blue-900/60 px-4 py-2 rounded-lg border border-blue-400/50">
                        Waiting for all players to be ready
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <AvatarSelector
          selectedAvatar={showNameInput ? selectedAvatar : currentPlayer?.avatar || null}
          onSelectAvatar={handleAvatarSelect}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  )
}
