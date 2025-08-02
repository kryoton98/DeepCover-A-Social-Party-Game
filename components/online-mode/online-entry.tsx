"use client"

import AudioButton from "@/components/audio-button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Wifi, Users, Shield } from "lucide-react"

export default function OnlineEntry({
  onCreateGame,
  onJoinGame,
  onBack,
}: {
  onCreateGame: () => void
  onJoinGame: () => void
  onBack: () => void
}) {
  return (
    <div className="w-full max-w-lg space-y-10 animate-slide-in-complex">
      {/* Enhanced header */}
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
                  Online Mode
                </h2>
                <div className="flex justify-center space-x-2 mt-3">
                  <Wifi className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-cyan-400 animate-pulse" />
                  <Shield className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-400 animate-pulse delay-300" />
                  <Users className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-400 animate-pulse delay-600" />
                </div>
              </div>

              <div className="w-12 md:w-14 lg:w-16"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced mode buttons */}
      <div className="space-y-8">
        {/* Create Game Button */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <AudioButton
            onClick={onCreateGame}
            soundType="select"
            enableHover={true}
            className="relative touch-manipulation pointer-events-auto z-20 w-full bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-blue-500 text-white font-bold py-6 md:py-8 lg:py-10 px-6 md:px-7 lg:px-8 rounded-3xl text-xl md:text-xl lg:text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-emerald-400/50"
            style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <Shield className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl md:text-xl lg:text-2xl tracking-wide">Create Game</span>
            </div>
          </AudioButton>
        </div>

        {/* Join Game Button */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <AudioButton
            onClick={onJoinGame}
            soundType="select"
            enableHover={true}
            className="relative touch-manipulation pointer-events-auto z-20 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 hover:from-blue-500 hover:via-purple-500 hover:to-violet-500 text-white font-bold py-6 md:py-8 lg:py-10 px-6 md:px-7 lg:px-8 rounded-3xl text-xl md:text-xl lg:text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-400/50"
            style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <Users className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl md:text-xl lg:text-2xl tracking-wide">Join Game</span>
            </div>
          </AudioButton>
        </div>
      </div>

      {/* Simple description */}
      <div className="grid grid-cols-1 gap-4 mt-8">
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 md:p-5 lg:p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Wifi className="w-5 h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Play with Friends Online</h3>
            </div>
            <p className="text-white/70">
              Create a room and share the code, or join a friend's game with their room code.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
