"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skull, ArrowRight, Shield } from "lucide-react"

interface EliminationAnnouncementProps {
  eliminatedPlayer: {
    id: number
    name: string
    role: string
    word: string
  } | null
  onContinue: () => void
}

export default function EliminationAnnouncement({ eliminatedPlayer, onContinue }: EliminationAnnouncementProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  // Start animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg">
        <div
          className={`transform transition-all duration-1000 ${showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        >
          {eliminatedPlayer ? (
            <div className="space-y-8">
              {/* Elimination announcement */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-orange-500/40 to-red-500/30 rounded-3xl blur-2xl animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 via-orange-500/15 to-red-500/10 rounded-3xl blur-md animate-pulse-slow"></div>
                <Card className="relative bg-gradient-to-br from-slate-900/95 via-red-950/95 to-orange-950/95 border-4 border-red-400/30 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20 pointer-events-none"></div>
                  <CardContent className="p-6 md:p-8 lg:p-10 text-center relative z-10">
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-ping opacity-75"></div>
                        <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center border-4 border-red-400 shadow-2xl">
                          <Skull className="w-12 h-12 text-white animate-pulse" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                          Player Eliminated!
                        </h2>

                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-sm animate-pulse"></div>
                          <div className="relative bg-gradient-to-br from-red-900/60 to-orange-900/60 rounded-2xl p-6 border-2 border-red-400/50">
                            <div className="text-3xl font-bold text-white mb-2">{eliminatedPlayer.name}</div>
                            <div className="text-lg text-red-200">was eliminated from the game</div>
                          </div>
                        </div>

                        <div className="text-lg text-red-200 mt-2">The game continues with the remaining players</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Continue button */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <Button
                  onClick={onContinue}
                  className="relative touch-manipulation pointer-events-auto z-20 w-full bg-gradient-to-r from-blue-700 via-cyan-700 to-blue-700 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-600 text-white font-bold py-4 md:py-5 lg:py-6 px-8 md:px-10 lg:px-12 rounded-2xl text-lg md:text-xl shadow-[0_5px_20px_rgba(8,145,178,0.3)] hover:shadow-[0_8px_30px_rgba(8,145,178,0.5)] transform hover:scale-105 transition-all duration-300 border border-white/10"
                  style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <ArrowRight className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                    <span>Continue to Next Round</span>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* No elimination announcement */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-cyan-500/40 to-blue-500/30 rounded-3xl blur-2xl animate-pulse"></div>
                <Card className="relative bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-cyan-900/95 border-4 border-blue-400/30 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20 pointer-events-none"></div>
                  <CardContent className="p-6 md:p-8 lg:p-10 text-center relative z-10">
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-ping opacity-75"></div>
                        <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center border-4 border-blue-400 shadow-2xl">
                          <Shield className="w-12 h-12 text-white animate-pulse" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          No Elimination
                        </h2>

                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-sm animate-pulse"></div>
                          <div className="relative bg-gradient-to-br from-blue-900/60 to-cyan-900/60 rounded-2xl p-6 border-2 border-blue-400/50">
                            <div className="text-xl text-blue-200">
                              The vote resulted in a tie or no votes were cast.
                            </div>
                            <div className="text-lg text-cyan-200 mt-2">Everyone survives this round!</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Continue button */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <Button
                  onClick={onContinue}
                  className="relative touch-manipulation pointer-events-auto z-20 w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-500 hover:via-emerald-500 hover:to-green-500 text-white font-bold py-4 md:py-5 lg:py-6 px-8 md:px-10 lg:px-12 rounded-2xl text-lg md:text-xl shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-green-400/50"
                  style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <ArrowRight className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                    <span>Continue to Next Round</span>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
