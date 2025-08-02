"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Shuffle } from "lucide-react"

interface Avatar {
  id: string
  emoji: string
  color: string
  name: string
}

const AVATARS: Avatar[] = [
  { id: "cat", emoji: "🐱", color: "from-orange-400 to-red-500", name: "Cat" },
  { id: "dog", emoji: "🐶", color: "from-amber-400 to-orange-500", name: "Dog" },
  { id: "fox", emoji: "🦊", color: "from-orange-500 to-red-600", name: "Fox" },
  { id: "bear", emoji: "🐻", color: "from-amber-600 to-orange-700", name: "Bear" },
  { id: "panda", emoji: "🐼", color: "from-gray-400 to-gray-600", name: "Panda" },
  { id: "koala", emoji: "🐨", color: "from-gray-500 to-slate-600", name: "Koala" },
  { id: "lion", emoji: "🦁", color: "from-yellow-400 to-orange-500", name: "Lion" },
  { id: "tiger", emoji: "🐯", color: "from-orange-400 to-red-500", name: "Tiger" },
  { id: "monkey", emoji: "🐵", color: "from-amber-500 to-orange-600", name: "Monkey" },
  { id: "rabbit", emoji: "🐰", color: "from-pink-400 to-rose-500", name: "Rabbit" },
  { id: "hamster", emoji: "🐹", color: "from-yellow-300 to-amber-400", name: "Hamster" },
  { id: "mouse", emoji: "🐭", color: "from-gray-400 to-gray-500", name: "Mouse" },
  { id: "frog", emoji: "🐸", color: "from-green-400 to-emerald-500", name: "Frog" },
  { id: "pig", emoji: "🐷", color: "from-pink-400 to-pink-500", name: "Pig" },
  { id: "cow", emoji: "🐮", color: "from-slate-400 to-gray-500", name: "Cow" },
  { id: "chicken", emoji: "🐔", color: "from-yellow-400 to-orange-400", name: "Chicken" },
  { id: "penguin", emoji: "🐧", color: "from-slate-600 to-gray-700", name: "Penguin" },
  { id: "owl", emoji: "🦉", color: "from-amber-600 to-orange-700", name: "Owl" },
  { id: "eagle", emoji: "🦅", color: "from-amber-700 to-orange-800", name: "Eagle" },
  { id: "duck", emoji: "🦆", color: "from-yellow-400 to-amber-500", name: "Duck" },
  { id: "fish", emoji: "🐠", color: "from-blue-400 to-cyan-500", name: "Fish" },
  { id: "octopus", emoji: "🐙", color: "from-purple-400 to-indigo-500", name: "Octopus" },
  { id: "whale", emoji: "🐋", color: "from-blue-500 to-indigo-600", name: "Whale" },
  { id: "dolphin", emoji: "🐬", color: "from-cyan-400 to-blue-500", name: "Dolphin" },
  { id: "shark", emoji: "🦈", color: "from-slate-500 to-gray-600", name: "Shark" },
  { id: "turtle", emoji: "🐢", color: "from-green-500 to-emerald-600", name: "Turtle" },
  { id: "crab", emoji: "🦀", color: "from-red-400 to-orange-500", name: "Crab" },
  { id: "lobster", emoji: "🦞", color: "from-red-500 to-orange-600", name: "Lobster" },
  { id: "butterfly", emoji: "🦋", color: "from-purple-400 to-pink-500", name: "Butterfly" },
  { id: "bee", emoji: "🐝", color: "from-yellow-400 to-amber-500", name: "Bee" },
  { id: "ladybug", emoji: "🐞", color: "from-red-400 to-red-500", name: "Ladybug" },
  { id: "spider", emoji: "🕷️", color: "from-gray-600 to-slate-700", name: "Spider" },
  { id: "unicorn", emoji: "🦄", color: "from-pink-400 to-purple-500", name: "Unicorn" },
  { id: "dragon", emoji: "🐉", color: "from-green-500 to-teal-600", name: "Dragon" },
  { id: "alien", emoji: "👽", color: "from-green-400 to-lime-500", name: "Alien" },
  { id: "robot", emoji: "🤖", color: "from-blue-400 to-indigo-500", name: "Robot" },
]

interface AvatarSelectorProps {
  selectedAvatar: Avatar | null
  onSelectAvatar: (avatar: Avatar) => void
  onClose: () => void
}

export default function AvatarSelector({ selectedAvatar, onSelectAvatar, onClose }: AvatarSelectorProps) {
  const [currentSelection, setCurrentSelection] = useState<Avatar | null>(selectedAvatar)

  const handleRandomSelect = () => {
    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)]
    setCurrentSelection(randomAvatar)
  }

  const handleConfirm = () => {
    if (currentSelection) {
      onSelectAvatar(currentSelection)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
      <Card className="w-full max-w-2xl max-h-[80vh] bg-white border-2 border-slate-200 shadow-2xl">
        <CardContent className="p-4">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Choose Your Avatar</h2>
              <p className="text-slate-600">Select an avatar that represents you in the game</p>
            </div>

            {/* Current Selection Preview */}
            {currentSelection && (
              <div className="flex justify-center">
                <div className="text-center space-y-2">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentSelection.color} flex items-center justify-center text-3xl shadow-lg border-4 border-white`}
                  >
                    {currentSelection.emoji}
                  </div>
                  <p className="text-sm font-medium text-slate-700">{currentSelection.name}</p>
                </div>
              </div>
            )}

            {/* Avatar Grid */}
            <div className="max-h-60 overflow-y-auto">
              <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2 p-1">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setCurrentSelection(avatar)}
                    className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center text-lg hover:scale-110 transition-all duration-200 border-2 ${
                      currentSelection?.id === avatar.id
                        ? "border-blue-500 shadow-lg scale-110"
                        : "border-white hover:border-slate-300"
                    }`}
                    title={avatar.name}
                  >
                    {avatar.emoji}
                    {currentSelection?.id === avatar.id && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRandomSelect}
                variant="outline"
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Random
              </Button>

              <div className="flex gap-3 flex-1">
                <Button onClick={onClose} variant="outline" className="flex-1 border-slate-300 text-slate-700">
                  Cancel
                </Button>

                <Button
                  onClick={handleConfirm}
                  disabled={!currentSelection}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
