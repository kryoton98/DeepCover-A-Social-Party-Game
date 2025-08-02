"use client"

import { useState, useEffect } from "react"
import AudioButton from "@/components/audio-button"
import { Card, CardContent } from "@/components/ui/card"
import { Vote, Users, Crown, Shield, Zap, Star, Target, CheckCircle, XCircle } from "lucide-react"
import { useAudio } from "@/hooks/use-audio"

interface Player {
  id: number
  name: string
  isAlive: boolean
}

interface VoteResult {
  playerId: number
  playerName: string
  votes: number
}

interface AnonymousVotingProps {
  players: Player[]
  onVotingComplete: (results: VoteResult[], eliminatedPlayer?: Player) => void
  onRevote: () => void
  onSkipElimination: () => void
}

type VotingState = "voting" | "pass-device" | "results" | "tie-breaker"

export default function AnonymousVoting({
  players,
  onVotingComplete,
  onRevote,
  onSkipElimination,
}: AnonymousVotingProps) {
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0)
  const [votingState, setVotingState] = useState<VotingState>("voting")
  const [votes, setVotes] = useState<{ [playerId: number]: number }>({})
  const [voteResults, setVoteResults] = useState<VoteResult[]>([])
  const [tiedPlayers, setTiedPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  // Audio hooks
  const { playClick, playSelect, playSuccess, playError } = useAudio()

  const alivePlayers = players.filter((p) => p.isAlive)
  const totalVoters = alivePlayers.length
  const progressPercentage = ((currentVoterIndex + 1) / totalVoters) * 100

  // Initialize vote counts
  useEffect(() => {
    const initialVotes: { [playerId: number]: number } = {}
    alivePlayers.forEach((player) => {
      initialVotes[player.id] = 0
    })
    setVotes(initialVotes)
  }, [players])

  const castVote = async (targetPlayerId: number) => {
    setSelectedPlayer(targetPlayerId)
    setIsVoting(true)
    playSelect() // Play selection sound

    // Dramatic pause for effect
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Record the vote
    const newVotes = { ...votes }
    newVotes[targetPlayerId] += 1
    setVotes(newVotes)

    // Check if this was the last vote
    if (currentVoterIndex >= totalVoters - 1) {
      // All votes are in, calculate results
      calculateResults(newVotes)
    } else {
      // Move to pass device screen
      setVotingState("pass-device")
      setIsVoting(false)
      setSelectedPlayer(null)
      playSuccess() // Play success sound for vote cast
    }
  }

  const calculateResults = (finalVotes: { [playerId: number]: number }) => {
    const results: VoteResult[] = alivePlayers.map((player) => ({
      playerId: player.id,
      playerName: player.name,
      votes: finalVotes[player.id] || 0,
    }))

    // Sort by votes (highest first)
    results.sort((a, b) => b.votes - a.votes)
    setVoteResults(results)

    // Check for ties
    const maxVotes = results[0]?.votes || 0
    const playersWithMaxVotes = results.filter((r) => r.votes === maxVotes)

    if (playersWithMaxVotes.length > 1 && maxVotes > 0) {
      // There's a tie
      const tiedPlayerObjects = playersWithMaxVotes
        .map((result) => alivePlayers.find((p) => p.id === result.playerId))
        .filter(Boolean) as Player[]

      setTiedPlayers(tiedPlayerObjects)
      setVotingState("tie-breaker")
      playError() // Play error sound for tie
    } else {
      // No tie, determine eliminated player
      const eliminatedPlayer = maxVotes > 0 ? alivePlayers.find((p) => p.id === results[0].playerId) : undefined

      setVotingState("results")
      onVotingComplete(results, eliminatedPlayer)
    }
    setIsVoting(false)
    setSelectedPlayer(null)
  }

  const nextVoter = () => {
    setCurrentVoterIndex(currentVoterIndex + 1)
    setVotingState("voting")
    playClick() // Play click sound for next voter
  }

  const handleRevote = () => {
    // Reset voting state
    setCurrentVoterIndex(0)
    setVotingState("voting")
    const resetVotes: { [playerId: number]: number } = {}
    alivePlayers.forEach((player) => {
      resetVotes[player.id] = 0
    })
    setVotes(resetVotes)
    setVoteResults([])
    setTiedPlayers([])
    setSelectedPlayer(null)
    setIsVoting(false)
    onRevote()
    playClick() // Play click sound for revote
  }

  const handleSkipElimination = () => {
    onSkipElimination()
    playClick() // Play click sound for skip
  }

  return (
    <div className="w-full max-w-lg space-y-8 animate-slide-in-complex">
      {/* Voting Screen */}
      {votingState === "voting" && (
        <>
          {/* Enhanced Header with Progress */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl"></div>
            <Card className="relative bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-purple-950/95 border-2 border-cyan-400/30 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20 pointer-events-none"></div>
              <CardContent className="p-8 relative z-10">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Anonymous Voting
                    </h2>
                    <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>

                  {/* Fancy Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-cyan-300 font-semibold">Voter Progress</span>
                      <span className="text-purple-300 font-bold">
                        {currentVoterIndex + 1} / {totalVoters}
                      </span>
                    </div>
                    <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                    </div>
                  </div>

                  {/* Voting Instructions */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-2xl blur-sm"></div>
                    <div className="relative bg-gradient-to-br from-red-900/40 via-orange-900/40 to-yellow-900/40 rounded-2xl p-6 border border-orange-400/30">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Target className="w-6 h-6 text-orange-400 animate-bounce" />
                        <p className="text-xl text-orange-100 font-bold">It's Your Turn to Vote</p>
                        <Target className="w-6 h-6 text-orange-400 animate-bounce" />
                      </div>
                      <p className="text-orange-200 text-lg">Select the player you want to eliminate</p>
                      <div className="flex justify-center mt-3">
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Player Selection */}
          <div className="space-y-4">
            {alivePlayers.map((player, index) => (
              <div key={player.id} className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

                <AudioButton
                  onClick={() => castVote(player.id)}
                  soundType="select"
                  disabled={isVoting}
                  className={`relative w-full py-6 px-8 rounded-2xl text-left font-bold text-lg transform transition-all duration-300 ${
                    selectedPlayer === player.id
                      ? "bg-gradient-to-r from-green-700 to-emerald-800 scale-105 shadow-[0_5px_20px_rgba(16,185,129,0.4)]"
                      : isVoting
                        ? "bg-gradient-to-r from-gray-700 to-gray-800 opacity-50"
                        : "bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:via-red-600 hover:to-red-700 hover:scale-105 shadow-[0_5px_15px_rgba(239,68,68,0.2)] hover:shadow-[0_8px_25px_rgba(239,68,68,0.4)]"
                  } border ${selectedPlayer === player.id ? "border-green-400/50" : "border-red-400/30"}`}
                  style={{
                    touchAction: "manipulation",
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedPlayer === player.id
                            ? "bg-green-500/30 border-2 border-green-400"
                            : "bg-red-500/30 border-2 border-red-400"
                        }`}
                      >
                        {selectedPlayer === player.id ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <Target className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                      <span className="text-white text-xl">{player.name}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {selectedPlayer === player.id ? (
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            ></div>
                          ))}
                        </div>
                      ) : (
                        <Vote className="w-6 h-6 text-red-300 group-hover:text-red-100 transition-colors" />
                      )}
                    </div>
                  </div>

                  {/* Animated border */}
                  <div
                    className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    style={{
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "exclude",
                    }}
                  ></div>
                </AudioButton>
              </div>
            ))}
          </div>

          {/* Voting in progress overlay */}
          {isVoting && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
              <Card className="bg-gradient-to-br from-blue-950 to-purple-950 border-2 border-cyan-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20 pointer-events-none"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="space-y-4">
                    <Zap className="w-16 h-16 text-yellow-400 mx-auto animate-spin" />
                    <h3 className="text-2xl font-bold text-white">Casting Vote...</h3>
                    <div className="flex justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Enhanced Pass Device Screen */}
      {votingState === "pass-device" && (
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl animate-pulse"></div>
            <Card className="relative bg-gradient-to-br from-green-900/95 via-emerald-900/95 to-teal-900/95 border-2 border-green-400/50 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-10 text-center">
                <div className="space-y-8">
                  {/* Animated success icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
                    <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                      <CheckCircle className="w-12 h-12 text-white animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Vote Secured!
                    </h3>
                    <p className="text-green-200 text-xl font-semibold">Your vote has been recorded anonymously</p>
                  </div>

                  {/* Pass device instruction */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
                    <div className="relative bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl p-6 border border-blue-400/30">
                      <div className="flex items-center justify-center space-x-3 mb-3">
                        <Users className="w-8 h-8 text-blue-400 animate-pulse" />
                        <p className="text-2xl text-blue-100 font-bold">Pass the Device</p>
                        <Users className="w-8 h-8 text-blue-400 animate-pulse" />
                      </div>
                      <p className="text-blue-200 text-lg">Hand the device to the next player</p>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="space-y-3">
                    <div className="text-sm text-green-300 font-semibold">
                      {totalVoters - currentVoterIndex - 1} votes remaining
                    </div>
                    <div className="flex justify-center space-x-2">
                      {[...Array(totalVoters)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full transition-all duration-500 ${
                            i <= currentVoterIndex ? "bg-green-400 scale-110" : "bg-gray-600"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <AudioButton
            onClick={nextVoter}
            soundType="button"
            className="touch-manipulation pointer-events-auto relative z-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold py-6 px-12 rounded-2xl text-2xl shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-emerald-400/50"
            style={{ touchAction: "manipulation" }}
          >
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8" />
              <span>Next Voter</span>
              <Star className="w-8 h-8 animate-spin" />
            </div>
          </AudioButton>
        </div>
      )}

      {/* Enhanced Results Screen */}
      {votingState === "results" && (
        <div className="space-y-8">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl animate-pulse"></div>
              <Card className="relative bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-purple-900/95 border-2 border-yellow-400/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Crown className="w-10 h-10 text-yellow-400 animate-bounce" />
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                      Voting Results
                    </h2>
                    <Crown className="w-10 h-10 text-yellow-400 animate-bounce" />
                  </div>
                  <p className="text-cyan-200 text-lg">All votes have been tallied</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {voteResults.map((result, index) => (
              <div key={result.playerId} className="relative group">
                {/* Special glow for eliminated player */}
                {index === 0 && result.votes > 0 && (
                  <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl blur opacity-50 animate-pulse"></div>
                )}

                <Card
                  className={`relative transform transition-all duration-500 ${
                    index === 0 && result.votes > 0
                      ? "bg-gradient-to-br from-red-900/90 via-orange-900/90 to-yellow-900/90 border-2 border-red-400 scale-105 shadow-2xl"
                      : "bg-gradient-to-br from-blue-900/70 to-purple-900/70 border border-blue-400/30 hover:scale-102"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {/* Player avatar */}
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                            index === 0 && result.votes > 0
                              ? "bg-gradient-to-br from-red-500 to-orange-500 border-yellow-400"
                              : "bg-gradient-to-br from-blue-500 to-purple-500 border-cyan-400"
                          }`}
                        >
                          {index === 0 && result.votes > 0 ? (
                            <Crown className="w-8 h-8 text-yellow-200 animate-pulse" />
                          ) : (
                            <Users className="w-8 h-8 text-cyan-200" />
                          )}
                        </div>

                        <div>
                          <span className="font-bold text-white text-xl">{result.playerName}</span>
                          {index === 0 && result.votes > 0 && (
                            <div className="text-red-300 text-sm font-semibold">ELIMINATED</div>
                          )}
                        </div>
                      </div>

                      {/* Vote count with fancy styling */}
                      <div className="text-right">
                        <div
                          className={`text-3xl font-bold ${
                            index === 0 && result.votes > 0 ? "text-yellow-400" : "text-cyan-300"
                          }`}
                        >
                          {result.votes}
                        </div>
                        <div className="text-sm text-gray-300">vote{result.votes !== 1 ? "s" : ""}</div>
                      </div>
                    </div>

                    {/* Vote visualization */}
                    <div className="mt-4">
                      <div className="flex space-x-1">
                        {[...Array(Math.max(result.votes, 1))].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                              i < result.votes
                                ? index === 0 && result.votes > 0
                                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                                  : "bg-gradient-to-r from-blue-500 to-purple-500"
                                : "bg-gray-700"
                            }`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {voteResults[0]?.votes === 0 && (
              <Card className="bg-gradient-to-br from-yellow-900/70 to-orange-900/70 border-2 border-yellow-400/50">
                <CardContent className="p-6 text-center">
                  <XCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3 animate-pulse" />
                  <p className="text-yellow-200 text-lg font-semibold">No votes were cast!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Tie Breaker Screen */}
      {votingState === "tie-breaker" && (
        <div className="space-y-8">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl animate-pulse"></div>
              <Card className="relative bg-gradient-to-br from-yellow-900/95 via-orange-900/95 to-red-900/95 border-2 border-yellow-400/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Zap className="w-10 h-10 text-yellow-400 animate-spin" />
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                      It's a Tie!
                    </h2>
                    <Zap className="w-10 h-10 text-yellow-400 animate-spin" />
                  </div>
                  <p className="text-orange-200 text-lg">Multiple players received the most votes</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-yellow-800/80 to-orange-900/80 border-2 border-yellow-600/50">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-yellow-100 font-bold text-xl mb-4">Tied Players:</p>
                  <div className="space-y-3">
                    {tiedPlayers.map((player, index) => (
                      <div key={player.id} className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-sm"></div>
                        <div className="relative bg-gradient-to-br from-yellow-900/60 to-orange-900/60 rounded-xl p-4 border border-yellow-400/30">
                          <div className="flex items-center justify-center space-x-3">
                            <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
                            <span className="text-yellow-100 font-bold text-lg">{player.name}</span>
                            <span className="text-yellow-200 text-sm">
                              ({voteResults.find((r) => r.playerId === player.id)?.votes} votes)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  <AudioButton
                    onClick={handleRevote}
                    soundType="button"
                    className="touch-manipulation pointer-events-auto relative z-20 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-400 hover:via-purple-400 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-400/50"
                    style={{ touchAction: "manipulation" }}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Vote className="w-6 h-6" />
                      <span>Vote Again</span>
                      <Star className="w-6 h-6 animate-spin" />
                    </div>
                  </AudioButton>

                  <AudioButton
                    onClick={handleSkipElimination}
                    soundType="button"
                    className="touch-manipulation pointer-events-auto relative z-20 w-full bg-gradient-to-r from-gray-500 via-slate-600 to-gray-700 hover:from-\
