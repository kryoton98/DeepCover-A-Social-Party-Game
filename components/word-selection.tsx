"use client"

import AudioButton from "@/components/audio-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Pencil, Sparkles, Brain, Zap } from "lucide-react"

interface WordSelectionProps {
  onBack: () => void
  onSelectWordType: (type: "custom" | "ai") => void
}

export default function WordSelection({ onBack, onSelectWordType }: WordSelectionProps) {
  return (
    <div className="w-full max-w-lg space-y-10 animate-slide-in-complex">
      {/* Enhanced header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/30 to-cyan-500/20 rounded-3xl blur-xl animate-pulse"></div>
        <Card className="relative bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-purple-950/95 border border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20 pointer-events-none"></div>
          <CardContent className="p-4 md:p-6 lg:p-8 relative z-10">
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
                  Word Selection
                </h2>
                <div className="flex justify-center space-x-2 mt-3">
                  <Pencil className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-cyan-400 animate-pulse" />
                  <Brain className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-400 animate-pulse delay-300" />
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-400 animate-pulse delay-600" />
                </div>
              </div>

              <div className="w-12 md:w-14 lg:w-16"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Word selection options */}
      <div className="space-y-8">
        {/* Custom Words */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <AudioButton
            onClick={() => onSelectWordType("custom")}
            soundType="select"
            enableHover={true}
            className="relative touch-manipulation pointer-events-auto z-20 w-full bg-gradient-to-r from-blue-700 via-cyan-700 to-teal-700 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white font-bold py-6 md:py-8 lg:py-10 px-6 md:px-7 lg:px-8 rounded-3xl text-xl md:text-xl lg:text-2xl shadow-[0_10px_25px_rgba(8,145,178,0.3)] hover:shadow-[0_15px_35px_rgba(8,145,178,0.5)] transform hover:scale-105 transition-all duration-300 border border-white/10"
            style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <Pencil className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                <div className="absolute inset-0 bg-blue-400/30 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl md:text-xl lg:text-2xl tracking-wide">Custom Words</span>
              <div className="bg-blue-400/20 px-3 py-1 rounded-full">
                <span className="text-blue-300 text-sm font-semibold">Classic</span>
              </div>
            </div>
          </AudioButton>
        </div>

        {/* AI Generated Words */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-gray-600 via-slate-600 to-gray-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <Button
            onClick={() => {}} // Disabled for now
            disabled={true}
            className="relative touch-manipulation pointer-events-auto z-20 w-full bg-gradient-to-r from-gray-700 via-slate-700 to-gray-800 text-white font-bold py-6 md:py-8 lg:py-10 px-6 md:px-7 lg:px-8 rounded-3xl text-xl md:text-xl lg:text-2xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] opacity-85 cursor-not-allowed border border-white/5 backdrop-blur-sm"
            style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <Brain className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl md:text-xl lg:text-2xl tracking-wide">AI Generated</span>
              <div className="bg-orange-400/20 px-3 py-1 rounded-full">
                <span className="text-orange-300 text-sm font-semibold">Coming Soon</span>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Option descriptions */}
      <div className="grid grid-cols-1 gap-4 mt-8">
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 md:p-5 lg:p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="w-5 h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Choose Your Word Source</h3>
            </div>
            <p className="text-white/70">
              Start with our classic word pairs, or stay tuned for AI-generated unique words coming soon!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
