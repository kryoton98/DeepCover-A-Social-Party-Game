"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Waves, Fish } from "lucide-react"

type Screen = "main" | "mode" | "players"

export default function OceanGame() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("main")
  const [selectedPlayers, setSelectedPlayers] = useState<number | null>(null)

  const handlePlayClick = () => {
    setCurrentScreen("mode")
  }

  const handleOfflineClick = () => {
    setCurrentScreen("players")
  }

  const handlePlayerSelect = (playerCount: number) => {
    setSelectedPlayers(playerCount)
    // Here you would typically navigate to the game or handle the selection
    console.log(`Selected ${playerCount} players`)
  }

  const handleBack = () => {
    if (currentScreen === "players") {
      setCurrentScreen("mode")
    } else if (currentScreen === "mode") {
      setCurrentScreen("main")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-200 via-blue-400 to-blue-800 relative overflow-hidden">
      {/* Animated waves background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-900 to-transparent opacity-60"></div>
        <div className="absolute top-1/4 left-0 w-full">
          <div className="flex space-x-4 animate-pulse">
            <Waves className="text-blue-300 opacity-30 w-8 h-8" />
            <Fish className="text-blue-200 opacity-40 w-6 h-6" />
            <Waves className="text-blue-300 opacity-20 w-10 h-10" />
          </div>
        </div>
        <div className="absolute bottom-1/3 right-0 w-full">
          <div className="flex justify-end space-x-6 animate-pulse delay-1000">
            <Fish className="text-cyan-300 opacity-30 w-5 h-5" />
            <Waves className="text-blue-200 opacity-25 w-12 h-12" />
            <Fish className="text-blue-300 opacity-35 w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Floating bubbles animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 bg-white opacity-20 rounded-full animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Main Screen */}
        {currentScreen === "main" && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-white drop-shadow-lg">Ocean Quest</h1>
              <p className="text-xl text-cyan-100 drop-shadow-md">Dive into Adventure</p>
            </div>

            <div className="relative">
              <Button
                onClick={handlePlayClick}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-6 px-12 rounded-full text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/20"
              >
                <Waves className="mr-3 w-8 h-8" />
                PLAY
              </Button>
              <div className="absolute -inset-2 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Mode Selection Screen */}
        {currentScreen === "mode" && (
          <div className="text-center space-y-8 animate-fade-in w-full max-w-md">
            <div className="flex items-center justify-between mb-8">
              <Button onClick={handleBack} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">Choose Mode</h2>
              <div className="w-10"></div>
            </div>

            <div className="space-y-6">
              <Button
                onClick={() => console.log("Online mode selected")}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-6 px-8 rounded-2xl text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Fish className="mr-3 w-6 h-6" />
                Online
              </Button>

              <Button
                onClick={handleOfflineClick}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-6 px-8 rounded-2xl text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Waves className="mr-3 w-6 h-6" />
                Offline
              </Button>
            </div>
          </div>
        )}

        {/* Player Selection Screen */}
        {currentScreen === "players" && (
          <div className="text-center space-y-8 animate-fade-in w-full max-w-lg">
            <div className="flex items-center justify-between mb-8">
              <Button onClick={handleBack} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Select Players</h2>
              <div className="w-10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[4, 5, 6, 7, 8].map((playerCount) => (
                <Card
                  key={playerCount}
                  className={`cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                    selectedPlayers === playerCount
                      ? "ring-4 ring-cyan-400 bg-gradient-to-br from-cyan-100 to-blue-200"
                      : "bg-gradient-to-br from-white/90 to-blue-100/90 hover:from-white to-blue-50"
                  } shadow-xl`}
                  onClick={() => handlePlayerSelect(playerCount)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-blue-800 mb-2">{playerCount}</div>
                    <div className="text-sm text-blue-600 font-medium">{playerCount === 1 ? "Player" : "Players"}</div>
                    <div className="mt-3 flex justify-center space-x-1">
                      {[...Array(Math.min(playerCount, 4))].map((_, i) => (
                        <Fish key={i} className="w-4 h-4 text-blue-500" />
                      ))}
                      {playerCount > 4 && <span className="text-blue-500 text-sm font-bold">+</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedPlayers && (
              <Button
                onClick={() => console.log(`Starting game with ${selectedPlayers} players`)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Game
              </Button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
