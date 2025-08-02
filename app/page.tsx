"use client"

import { useState, useEffect } from "react"
import AudioButton from "@/components/audio-button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Play,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
  Timer,
  Vote,
  Star,
  Zap,
  Shield,
  Users,
  Target,
  Sparkles,
  Trophy,
  Skull,
  Heart,
  XCircle,
} from "lucide-react"
import AnonymousVoting from "@/components/anonymous-voting"
import OnlineMode from "@/components/online-mode/online-mode"
import WordSelection from "@/components/word-selection"
import EliminationAnnouncement from "@/components/elimination-announcement"
import { useAudio } from "@/hooks/use-audio"

type GameScreen =
  | "welcome"
  | "mode-select"
  | "word-selection"
  | "player-count"
  | "role-assignment"
  | "discussion"
  | "voting"
  | "game-over"
  | "online-mode"

type Role = "cipher" | "echo" | "blank"

interface Player {
  id: number
  name: string
  role: Role
  word: string
  isEliminated: boolean
  votes: number
  isAlive: boolean
}

interface WordPair {
  civilian: string
  undercover: string
}

interface VoteResult {
  playerId: number
  playerName: string
  votes: number
}

const WORD_PAIRS: WordPair[] = [
  { civilian: "Cat", undercover: "Dog" },
  { civilian: "Apple", undercover: "Banana" },
  { civilian: "Car", undercover: "Bus" },
  { civilian: "Chair", undercover: "Table" },
  { civilian: "Sun", undercover: "Moon" },
  { civilian: "Fish", undercover: "Shark" },
  { civilian: "Pen", undercover: "Pencil" },
  { civilian: "Book", undercover: "Notebook" },
  { civilian: "Phone", undercover: "Tablet" },
  { civilian: "Shoe", undercover: "Boot" },
  { civilian: "Milk", undercover: "Juice" },
  { civilian: "Pizza", undercover: "Burger" },
  { civilian: "Ball", undercover: "Toy" },
  { civilian: "Rain", undercover: "Snow" },
  { civilian: "Dog", undercover: "Wolf" },
  { civilian: "Tree", undercover: "Plant" },
  { civilian: "Water", undercover: "Juice" },
  { civilian: "Cake", undercover: "Pie" },
  { civilian: "Egg", undercover: "Cheese" },
  { civilian: "Cup", undercover: "Mug" },
  { civilian: "School", undercover: "College" },
  { civilian: "Desk", undercover: "Table" },
  { civilian: "Window", undercover: "Door" },
  { civilian: "Flower", undercover: "Rose" },
  { civilian: "Bird", undercover: "Duck" },
  { civilian: "Cow", undercover: "Horse" },
  { civilian: "Hat", undercover: "Cap" },
  { civilian: "Bike", undercover: "Scooter" },
  { civilian: "Orange", undercover: "Grape" },
  { civilian: "Sleep", undercover: "Nap" },
  { civilian: "Walk", undercover: "Run" },
  { civilian: "Happy", undercover: "Glad" },
  { civilian: "Sad", undercover: "Crying" },
  { civilian: "Hot", undercover: "Warm" },
  { civilian: "Cold", undercover: "Cool" },
  { civilian: "Laugh", undercover: "Smile" },
  { civilian: "Cry", undercover: "Tears" },
  { civilian: "Big", undercover: "Large" },
  { civilian: "Small", undercover: "Tiny" },
  { civilian: "Fast", undercover: "Quick" },
  { civilian: "Slow", undercover: "Late" },
  { civilian: "House", undercover: "Home" },
  { civilian: "Boy", undercover: "Girl" },
  { civilian: "Man", undercover: "Woman" },
  { civilian: "Baby", undercover: "Kid" },
  { civilian: "Father", undercover: "Mother" },
  { civilian: "Brother", undercover: "Sister" },
  { civilian: "Hand", undercover: "Foot" },
  { civilian: "Eye", undercover: "Nose" },
  { civilian: "Mouth", undercover: "Ear" },
  { civilian: "Leg", undercover: "Arm" },
  { civilian: "City", undercover: "Town" },
  { civilian: "Street", undercover: "Road" },
  { civilian: "Bus", undercover: "Train" },
  { civilian: "Plane", undercover: "Helicopter" },
  { civilian: "Key", undercover: "Lock" },
  { civilian: "Door", undercover: "Gate" },
  { civilian: "T-shirt", undercover: "Shirt" },
  { civilian: "Socks", undercover: "Shoes" },
  { civilian: "Bag", undercover: "Backpack" },
  { civilian: "Clock", undercover: "Watch" },
  { civilian: "TV", undercover: "Radio" },
  { civilian: "Music", undercover: "Song" },
  { civilian: "Dance", undercover: "Sing" },
  { civilian: "Game", undercover: "Toy" },
  { civilian: "Light", undercover: "Lamp" },
  { civilian: "Dark", undercover: "Night" },
  { civilian: "Morning", undercover: "Evening" },
  { civilian: "Day", undercover: "Night" },
  { civilian: "Week", undercover: "Month" },
  { civilian: "Rainy", undercover: "Sunny" },
  { civilian: "Summer", undercover: "Winter" },
  { civilian: "Spring", undercover: "Autumn" },
  { civilian: "Food", undercover: "Meal" },
  { civilian: "Bread", undercover: "Toast" },
  { civilian: "Rice", undercover: "Pasta" },
  { civilian: "Meat", undercover: "Chicken" },
  { civilian: "Fruit", undercover: "Vegetable" },
  { civilian: "Salt", undercover: "Sugar" },
  { civilian: "Ice", undercover: "Snow" },
  { civilian: "Cupcake", undercover: "Muffin" },
  { civilian: "Cookie", undercover: "Biscuit" },
  { civilian: "Bed", undercover: "Pillow" },
  { civilian: "Blanket", undercover: "Quilt" },
  { civilian: "Window", undercover: "Curtain" },
  { civilian: "Wall", undercover: "Door" },
  { civilian: "Computer", undercover: "Laptop" },
  { civilian: "Mouse", undercover: "Keyboard" },
  { civilian: "Picture", undercover: "Photo" },
  { civilian: "Drawing", undercover: "Painting" },
  { civilian: "Zoo", undercover: "Farm" },
  { civilian: "Lion", undercover: "Tiger" },
  { civilian: "Elephant", undercover: "Rhino" },
  { civilian: "Monkey", undercover: "Gorilla" },
  { civilian: "Fox", undercover: "Wolf" },
  { civilian: "Bear", undercover: "Panda" },
  { civilian: "Snake", undercover: "Lizard" },
  { civilian: "Frog", undercover: "Toad" },
  { civilian: "Insect", undercover: "Bug" },
  { civilian: "Spider", undercover: "Ant" },
]

// Add AI-generated word pairs
const AI_WORD_PAIRS: WordPair[] = [
  { civilian: "Telescope", undercover: "Microscope" },
  { civilian: "Waterfall", undercover: "Fountain" },
  { civilian: "Skyscraper", undercover: "Lighthouse" },
  { civilian: "Volcano", undercover: "Geyser" },
  { civilian: "Symphony", undercover: "Melody" },
  { civilian: "Labyrinth", undercover: "Maze" },
  { civilian: "Avalanche", undercover: "Landslide" },
  { civilian: "Constellation", undercover: "Horoscope" },
  { civilian: "Tornado", undercover: "Hurricane" },
  { civilian: "Expedition", undercover: "Voyage" },
]

export default function UndercoverGame() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>("welcome")
  const [playerCount, setPlayerCount] = useState<number>(0)
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPlayerViewing, setCurrentPlayerViewing] = useState<number>(0)
  const [showRole, setShowRole] = useState<boolean>(false)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [round, setRound] = useState<number>(1)
  const [discussionTime, setDiscussionTime] = useState<number>(180) // 3 minutes
  const [isDiscussing, setIsDiscussing] = useState<boolean>(true)
  const [votingFor, setVotingFor] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState<boolean[]>([])
  const [winner, setWinner] = useState<string>("")
  const [currentWordPair, setCurrentWordPair] = useState<WordPair | null>(null)
  const [currentPlayerName, setCurrentPlayerName] = useState<string>("")
  const [hasEnteredName, setHasEnteredName] = useState<boolean>(false)
  const [nameError, setNameError] = useState<string>("")
  const [wordType, setWordType] = useState<"custom" | "ai" | null>(null)
  const [showEliminationAnnouncement, setShowEliminationAnnouncement] = useState<boolean>(false)
  const [eliminatedPlayerData, setEliminatedPlayerData] = useState<Player | null>(null)

  // Audio hook
  const { playNotification, playSuccess, playError, playStart, playSelect } = useAudio()

  // Timer effect
  useEffect(() => {
    if (isDiscussing && discussionTime > 0 && currentScreen === "discussion") {
      const timer = setTimeout(() => {
        setDiscussionTime(discussionTime - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (discussionTime === 0 && isDiscussing) {
      setIsDiscussing(false)
      setCurrentScreen("voting")
      playNotification() // Play sound when voting starts
    }
  }, [discussionTime, isDiscussing, currentScreen, playNotification])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Update the assignRoles function to use the selected word type
  const assignRoles = () => {
    // Choose word pair source based on wordType
    const wordPairSource = wordType === "ai" ? AI_WORD_PAIRS : WORD_PAIRS
    const wordPair = wordPairSource[Math.floor(Math.random() * wordPairSource.length)]
    setCurrentWordPair(wordPair)

    const newPlayers: Player[] = []

    // Create players with entered names
    for (let i = 0; i < playerCount; i++) {
      newPlayers.push({
        id: i,
        name: `Player ${i + 1}`,
        role: "cipher",
        word: wordPair.civilian,
        isEliminated: false,
        votes: 0,
        isAlive: true,
      })
    }

    // Rest of the role assignment logic remains the same...
    const echoIndex = Math.floor(Math.random() * playerCount)
    newPlayers[echoIndex].role = "echo"
    newPlayers[echoIndex].word = wordPair.undercover

    if (playerCount >= 6) {
      let blankIndex = Math.floor(Math.random() * playerCount)
      while (blankIndex === echoIndex) {
        blankIndex = Math.floor(Math.random() * playerCount)
      }
      newPlayers[blankIndex].role = "blank"
      newPlayers[blankIndex].word = "???"
    }

    setPlayers(newPlayers)
    setHasVoted(new Array(playerCount).fill(false))
    setCurrentScreen("role-assignment")
    playStart() // Play sound when game starts
  }

  const nextPlayer = () => {
    if (currentPlayerViewing < playerCount - 1) {
      setCurrentPlayerViewing(currentPlayerViewing + 1)
      setShowRole(false)
      setHasEnteredName(false)
      setCurrentPlayerName("")
      setNameError("")
    } else {
      setGameStarted(true)
      setCurrentScreen("discussion")
      playNotification() // Play sound when discussion starts
    }
  }

  // Update the handleVotingComplete function to show the elimination announcement
  const handleVotingComplete = (results: VoteResult[], eliminatedPlayer?: Player) => {
    if (eliminatedPlayer) {
      // Store the eliminated player data before updating the players array
      setEliminatedPlayerData(eliminatedPlayer)

      const newPlayers = players.map((p) =>
        p.id === eliminatedPlayer.id ? { ...p, isEliminated: true, isAlive: false } : p,
      )
      setPlayers(newPlayers)

      // Show the elimination announcement
      setShowEliminationAnnouncement(true)
      playError() // Play elimination sound

      // Check win conditions will be called after the announcement is dismissed
    } else {
      // No one was eliminated, still show the announcement
      setEliminatedPlayerData(null)
      setShowEliminationAnnouncement(true)
      playNotification() // Play neutral sound for no elimination
    }
  }

  // Add a function to handle continuing after the elimination announcement
  const handleContinueAfterElimination = () => {
    setShowEliminationAnnouncement(false)

    if (eliminatedPlayerData) {
      // Check win conditions with the updated players array
      checkWinConditions(players)
    } else {
      // No one was eliminated, continue to next round
      nextRound()
    }
  }

  const handleRevote = () => {
    // Stay on voting screen for revote
    console.log("Revoting...")
  }

  const handleSkipElimination = () => {
    // Skip elimination and go to next round
    nextRound()
  }

  const nextRound = () => {
    setRound(round + 1)
    setDiscussionTime(180)
    setIsDiscussing(true)
    setCurrentScreen("discussion")
    playNotification() // Play sound for new round
  }

  const checkWinConditions = (currentPlayers: Player[]) => {
    const alivePlayers = currentPlayers.filter((p) => !p.isEliminated)
    const aliveEcho = alivePlayers.filter((p) => p.role === "echo")
    const aliveBlank = alivePlayers.filter((p) => p.role === "blank")
    const aliveCiphers = alivePlayers.filter((p) => p.role === "cipher")

    // Echo wins if they survive until only 2 players remain
    if (alivePlayers.length <= 2 && aliveEcho.length > 0) {
      setWinner("Echo wins!")
      setCurrentScreen("game-over")
      playSuccess() // Play victory sound
      return
    }

    // Ciphers win if both Echo and Blank are eliminated
    if (aliveEcho.length === 0 && aliveBlank.length === 0) {
      setWinner("Ciphers win!")
      setCurrentScreen("game-over")
      playSuccess() // Play victory sound
      return
    }

    // Continue game if no win condition met
    nextRound()
  }

  const resetGame = () => {
    setCurrentScreen("welcome")
    setPlayerCount(0)
    setPlayers([])
    setCurrentPlayerViewing(0)
    setShowRole(false)
    setGameStarted(false)
    setRound(1)
    setDiscussionTime(180)
    setIsDiscussing(true)
    setVotingFor(null)
    setHasVoted([])
    setWinner("")
    setCurrentWordPair(null)
    setWordType(null) // Reset the word type
  }

  const savePlayerName = () => {
    if (currentPlayerName.trim()) {
      // Check if name already exists
      const nameExists = players.some(
        (player, index) =>
          index !== currentPlayerViewing && player.name.toLowerCase() === currentPlayerName.trim().toLowerCase(),
      )

      if (nameExists) {
        setNameError(`The name "${currentPlayerName.trim()}" is already taken!`)
        playError() // Play error sound for duplicate name
        return
      }

      setNameError("")
      const newPlayers = [...players]
      newPlayers[currentPlayerViewing].name = currentPlayerName.trim()
      setPlayers(newPlayers)
      setHasEnteredName(true)
      playSuccess() // Play success sound for valid name
    }
  }

  // Handle online mode navigation
  const handleOnlineMode = () => {
    setCurrentScreen("online-mode")
  }

  const handleBackFromOnline = () => {
    setCurrentScreen("mode-select")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden touch-manipulation">
      {/* Premium Animated Ocean Background */}
      <div className="absolute inset-0">
        {/* Refined gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-600/15 to-purple-700/20 animate-gradient-shift"></div>

        {/* Premium ocean waves */}
        <div className="absolute bottom-0 w-full h-96 bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent">
          <div className="absolute bottom-0 w-full h-48 bg-wave-pattern opacity-30 animate-wave-complex"></div>
          <div className="absolute bottom-0 w-full h-32 bg-wave-pattern opacity-15 animate-wave-complex-delayed"></div>
        </div>

        {/* Enhanced floating particles with glass effect */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-cyan-300/20 to-blue-400/20 animate-float-complex backdrop-blur-sm border border-white/10"
            style={{
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 6}s`,
            }}
          />
        ))}

        {/* Premium light rays */}
        <div className="absolute top-0 left-1/4 w-4 h-full bg-gradient-to-b from-cyan-200/30 via-cyan-300/15 to-transparent transform rotate-12 animate-pulse-slow blur-md"></div>
        <div className="absolute top-0 right-1/3 w-2 h-full bg-gradient-to-b from-blue-200/20 via-blue-300/10 to-transparent transform -rotate-6 animate-pulse-slow delay-1000 blur-md"></div>
        <div className="absolute top-0 left-2/3 w-3 h-full bg-gradient-to-b from-purple-200/15 via-purple-300/5 to-transparent transform rotate-3 animate-pulse-slow delay-2000 blur-md"></div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Enhanced Welcome Screen */}
        {currentScreen === "welcome" && (
          <div className="text-center space-y-16 animate-fade-in-complex">
            {/* Logo and title section */}
            <div className="relative space-y-8">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/30 to-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>

              <div className="relative space-y-6">
                {/* Premium title with multiple effects */}
                <div className="relative">
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl tracking-wider animate-title-glow">
                    Deepcover
                  </h1>
                  <div className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-black text-white/5 blur-md">
                    Deepcover
                  </div>
                  <div className="absolute -inset-1 text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-xl">
                    Deepcover
                  </div>
                </div>

                {/* Subtitle with animated elements */}
                <div className="relative">
                  <h2 className="text-3xl md:text-4xl font-light bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
                    Social Party Game
                  </h2>
                  <div className="flex justify-center space-x-3 mt-6">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-bounce-complex shadow-lg"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Floating icons around title */}
                <div className="absolute -top-8 -left-8 animate-float-icon">
                  <Shield className="w-8 h-8 text-cyan-400/60" />
                </div>
                <div className="absolute -top-4 -right-12 animate-float-icon-delayed">
                  <Star className="w-6 h-6 text-purple-400/60" />
                </div>
                <div className="absolute -bottom-6 left-4 animate-float-icon-slow">
                  <Zap className="w-7 h-7 text-blue-400/60" />
                </div>
              </div>
            </div>

            {/* Premium play button */}
            <div className="relative group">
              {/* Multiple premium glow layers */}
              <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/20 via-cyan-500/30 to-blue-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse-rainbow"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/15 to-cyan-400/15 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/5 to-cyan-400/5 rounded-full blur-md group-hover:blur-lg transition-all duration-200"></div>

              <AudioButton
                onClick={() => setCurrentScreen("mode-select")}
                soundType="start"
                enableHover={true}
                size="lg"
                className="relative touch-manipulation pointer-events-auto z-20 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-blue-500 text-white font-black py-6 md:py-8 lg:py-10 px-12 md:px-16 lg:px-20 rounded-full text-2xl md:text-3xl lg:text-4xl shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] transform hover:scale-105 transition-all duration-500 border-4 border-white/20 hover:border-white/40"
                style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Play className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 fill-current animate-pulse" />
                    <div className="absolute inset-0 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full animate-ping"></div>
                  </div>
                  <span className="tracking-wider text-lg md:text-xl lg:text-2xl">PLAY</span>
                  <div className="relative">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 animate-spin-slow" />
                  </div>
                </div>
              </AudioButton>
            </div>

            {/* Game features showcase */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-md mx-auto">
              {[
                { icon: Users, label: "4-8 Players", color: "from-blue-500 to-cyan-500" },
                { icon: Shield, label: "Anonymous", color: "from-purple-500 to-blue-500" },
                { icon: Zap, label: "Fast-Paced", color: "from-emerald-500 to-cyan-500" },
              ].map((feature, i) => (
                <div key={i} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <Card className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                      >
                        <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <p className="text-white/80 text-sm font-semibold">{feature.label}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Mode Selection Screen */}
        {currentScreen === "mode-select" && (
          <div className="w-full max-w-lg space-y-10 animate-slide-in-complex">
            {/* Enhanced header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/30 to-cyan-500/20 rounded-3xl blur-xl animate-pulse"></div>
              <Card className="relative bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-purple-950/95 border-2 border-cyan-400/40 backdrop-blur-md shadow-[0_0_15px_rgba(8,145,178,0.2)]">
                <CardContent className="p-4 md:p-6 lg:p-8">
                  <div className="flex items-center justify-between">
                    <AudioButton
                      onClick={() => setCurrentScreen("welcome")}
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
                        Game Mode
                      </h2>
                      <div className="flex justify-center space-x-2 mt-3">
                        <Target className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-cyan-400 animate-pulse" />
                        <Shield className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-400 animate-pulse delay-300" />
                        <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-400 animate-pulse delay-600" />
                      </div>
                    </div>

                    <div className="w-12 md:w-14 lg:w-16"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced mode buttons */}
            <div className="space-y-8">
              {/* Online Mode */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <AudioButton
                  onClick={handleOnlineMode}
                  soundType="select"
                  enableHover={true}
                  className="relative touch-manipulation pointer-events-auto z-20 w-full bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-blue-500 text-white font-bold py-6 md:py-8 lg:py-10 px-6 md:px-7 lg:px-8 rounded-3xl text-xl md:text-xl lg:text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-emerald-400/50"
                  style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                >
                  <div className="flex items-center justify-center space-x-4">
                    <div className="relative">
                      <Wifi className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                      <div className="absolute inset-0 bg-emerald-400/30 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-xl md:text-xl lg:text-2xl tracking-wide">Online</span>
                    <div className="bg-emerald-400/20 px-3 py-1 rounded-full">
                      <span className="text-emerald-300 text-sm font-semibold">Available</span>
                    </div>
                  </div>
                </AudioButton>
              </div>

              {/* Offline Mode */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <AudioButton
                  onClick={() => setCurrentScreen("word-selection")}
                  soundType="select"
                  enableHover={true}
                  className="relative touch-manipulation pointer-events-auto z-20 w-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-500 hover:via-red-500 hover:to-pink-500 text-white font-bold py-6 md:py-8 lg:py-10 px-6 md:px-7 lg:px-8 rounded-3xl text-xl md:text-xl lg:text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-orange-400/50"
                  style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                >
                  <div className="flex items-center justify-center space-x-4">
                    <div className="relative">
                      <WifiOff className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                      <div className="absolute inset-0 bg-green-400/30 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-xl md:text-xl lg:text-2xl tracking-wide">Offline</span>
                    <div className="bg-green-400/20 px-3 py-1 rounded-full">
                      <span className="text-green-300 text-sm font-semibold">Ready</span>
                    </div>
                  </div>
                </AudioButton>
              </div>
            </div>

            {/* Mode descriptions */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              <Card className="relative bg-gradient-to-br from-slate-900/90 via-blue-950/90 to-purple-950/90 border border-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20 pointer-events-none"></div>
                <CardContent className="p-6 md:p-8 lg:p-10 relative z-10">
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="w-5 h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">Choose Your Adventure</h3>
                  </div>
                  <p className="text-white/70">
                    Play online with friends anywhere, or gather around one device for the classic party experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Online Mode Screen */}
        {currentScreen === "online-mode" && (
          <div className="w-full max-w-lg space-y-10 animate-slide-in-complex">
            {/* Back button */}
            <div className="flex justify-start">
              <AudioButton
                onClick={handleBackFromOnline}
                soundType="click"
                variant="ghost"
                size="icon"
                className="touch-manipulation pointer-events-auto relative z-20 text-white hover:bg-white/20 rounded-full p-2 md:p-3 lg:p-4 border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
              >
                <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
              </AudioButton>
            </div>

            <OnlineMode />
          </div>
        )}

        {/* Word Selection Screen */}
        {currentScreen === "word-selection" && (
          <WordSelection
            onBack={() => setCurrentScreen("mode-select")}
            onSelectWordType={(type) => {
              setWordType(type)
              setCurrentScreen("player-count")
            }}
          />
        )}

        {/* Rest of the screens remain the same but with AudioButton replacements... */}
        {/* Enhanced Player Count Selection */}
        {currentScreen === "player-count" && (
          <div className="w-full max-w-2xl space-y-10 animate-slide-in-complex">
            {/* Enhanced header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/30 to-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
              <Card className="relative bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-emerald-900/90 border-2 border-emerald-400/50 backdrop-blur-sm">
                <CardContent className="p-4 md:p-6 lg:p-8">
                  <div className="flex items-center justify-between">
                    <AudioButton
                      onClick={() => setCurrentScreen("word-selection")}
                      soundType="click"
                      variant="ghost"
                      size="icon"
                      className="touch-manipulation pointer-events-auto relative z-20 text-white hover:bg-white/20 rounded-full p-2 md:p-3 lg:p-4 border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                      style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                    >
                      <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                    </AudioButton>

                    <div className="text-center">
                      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                        Select Players
                      </h2>
                      <p className="text-cyan-200 mt-2">Choose your party size</p>
                    </div>

                    <div className="w-12 md:w-14 lg:w-16"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced player count grid */}
            <div className="space-y-6">
              {/* Top row - 3 cards */}
              <div className="grid grid-cols-3 gap-6">
                {[4, 5, 6].map((count, index) => (
                  <div key={count} className="relative group">
                    {/* Glow effect */}
                    <div
                      className={`absolute -inset-2 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${
                        playerCount === count
                          ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                          : "bg-gradient-to-r from-slate-600 via-blue-600 to-purple-600"
                      }`}
                    ></div>

                    <Card
                      className={`relative touch-manipulation pointer-events-auto z-20 cursor-pointer transform hover:scale-110 transition-all duration-500 ${
                        playerCount === count
                          ? "bg-gradient-to-br from-cyan-100/95 via-blue-100/95 to-purple-100/95 border-4 border-cyan-400 shadow-2xl scale-105"
                          : "bg-gradient-to-br from-slate-800/90 via-blue-900/90 to-purple-900/90 border-2 border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl"
                      } rounded-3xl backdrop-blur-sm`}
                      onClick={() => {
                        setPlayerCount(count)
                        playSelect() // Play selection sound
                      }}
                      style={{
                        touchAction: "manipulation",
                        height: "160px",
                        animationDelay: `${index * 0.1}s`,
                        minWidth: "44px",
                        minHeight: "44px",
                      }}
                    >
                      <CardContent className="p-4 md:p-5 lg:p-6 text-center h-full flex flex-col justify-center">
                        <div
                          className={`text-4xl md:text-5xl font-black mb-2 md:mb-3 ${playerCount === count ? "text-blue-800" : "text-white"}`}
                        >
                          {count}
                        </div>
                        <div
                          className={`text-sm md:text-base font-bold mb-3 md:mb-4 ${
                            playerCount === count ? "text-blue-600" : "text-cyan-200"
                          }`}
                        >
                          Players
                        </div>
                        <div className="flex justify-center items-center mb-2 md:mb-3">
                          <div className="flex justify-center items-center gap-1">
                            {[...Array(count)].map((_, i) => (
                              <div key={i} className="relative group">
                                <div
                                  className={`absolute inset-0 rounded-full blur-sm ${
                                    playerCount === count ? "bg-blue-400 animate-pulse" : "bg-cyan-400/50"
                                  }`}
                                ></div>
                                <div
                                  className={`relative rounded-full ${
                                    count <= 5
                                      ? "w-2 h-2 md:w-3 md:h-3"
                                      : count === 6
                                        ? "w-1.75 h-1.75 md:w-2.5 md:h-2.5"
                                        : count === 7
                                          ? "w-1.5 h-1.5 md:w-2 md:h-2"
                                          : "w-1.25 h-1.25 md:w-1.5 md:h-1.5"
                                  } ${
                                    playerCount === count
                                      ? "bg-gradient-to-r from-blue-400 to-cyan-400 border border-blue-300 shadow-lg shadow-blue-400/30"
                                      : "bg-gradient-to-r from-cyan-500 to-blue-500 border border-cyan-400/50"
                                  } transform transition-all duration-300 ${
                                    playerCount === count ? "scale-125" : "group-hover:scale-110"
                                  }`}
                                  style={{ animationDelay: `${i * 0.1}s` }}
                                ></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className={`text-xs ${playerCount === count ? "text-blue-500" : "text-cyan-300"}`}>
                          {count >= 6 ? "Cipher • Echo • Blank" : "Cipher • Echo"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Bottom row - 2 cards centered */}
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-6 max-w-md">
                  {[7, 8].map((count, index) => (
                    <div key={count} className="relative group">
                      <div
                        className={`absolute -inset-2 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${
                          playerCount === count
                            ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                            : "bg-gradient-to-r from-slate-600 via-blue-600 to-purple-600"
                        }`}
                      ></div>

                      <Card
                        className={`relative touch-manipulation pointer-events-auto z-20 cursor-pointer transform hover:scale-110 transition-all duration-500 ${
                          playerCount === count
                            ? "bg-gradient-to-br from-cyan-100/95 via-blue-100/95 to-purple-100/95 border-4 border-cyan-400 shadow-2xl scale-105"
                            : "bg-gradient-to-br from-slate-800/90 via-blue-900/90 to-purple-900/90 border-2 border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl"
                        } rounded-3xl backdrop-blur-sm`}
                        onClick={() => {
                          setPlayerCount(count)
                          playSelect() // Play selection sound
                        }}
                        style={{
                          touchAction: "manipulation",
                          height: "160px",
                          width: "160px",
                          animationDelay: `${(index + 3) * 0.1}s`,
                          minWidth: "44px",
                          minHeight: "44px",
                        }}
                      >
                        <CardContent className="p-4 md:p-5 lg:p-6 text-center h-full flex flex-col justify-center">
                          <div
                            className={`text-4xl md:text-5xl font-black mb-2 md:mb-3 ${playerCount === count ? "text-blue-800" : "text-white"}`}
                          >
                            {count}
                          </div>
                          <div
                            className={`text-sm md:text-base font-bold mb-3 md:mb-4 ${
                              playerCount === count ? "text-blue-600" : "text-cyan-200"
                            }`}
                          >
                            Players
                          </div>
                          <div className="flex justify-center items-center mb-2 md:mb-3">
                            <div className="flex justify-center items-center gap-1">
                              {[...Array(count)].map((_, i) => (
                                <div key={i} className="relative group">
                                  <div
                                    className={`absolute inset-0 rounded-full blur-sm ${
                                      playerCount === count ? "bg-blue-400 animate-pulse" : "bg-cyan-400/50"
                                    }`}
                                  ></div>
                                  <div
                                    className={`relative rounded-full ${
                                      count <= 5
                                        ? "w-2 h-2 md:w-3 md:h-3"
                                        : count === 6
                                          ? "w-1.75 h-1.75 md:w-2.5 md:h-2.5"
                                          : count === 7
                                            ? "w-1.5 h-1.5 md:w-2 md:h-2"
                                            : "w-1.25 h-1.25 md:w-1.5 md:h-1.5"
                                    } ${
                                      playerCount === count
                                        ? "bg-gradient-to-r from-blue-400 to-cyan-400 border border-blue-300 shadow-lg shadow-blue-400/30"
                                        : "bg-gradient-to-r from-cyan-500 to-blue-500 border border-cyan-400/50"
                                    } transform transition-all duration-300 ${
                                      playerCount === count ? "scale-125" : "group-hover:scale-110"
                                    }`}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                  ></div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className={`text-xs ${playerCount === count ? "text-blue-500" : "text-cyan-300"}`}>
                            {count >= 6 ? "Cipher • Echo • Blank" : "Cipher • Echo"}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced start button */}
            {playerCount > 0 && (
              <div className="relative group pt-8">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500/30 via-emerald-500/40 to-cyan-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
                <AudioButton
                  onClick={assignRoles}
                  soundType="start"
                  className="relative touch-manipulation pointer-events-auto z-20 w-full bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 hover:from-green-500 hover:via-emerald-500 hover:to-cyan-500 text-white font-bold py-6 md:py-7 lg:py-8 px-8 md:px-10 lg:px-12 rounded-3xl text-2xl md:text-2.5xl lg:text-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-green-400/50"
                  style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                >
                  <div className="flex items-center justify-center space-x-4">
                    <Play className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 fill-current" />
                    <span className="tracking-wide text-lg md:text-xl lg:text-2xl">Start Game</span>
                    <Sparkles className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 animate-spin" />
                  </div>
                </AudioButton>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Role Assignment Screen */}
        {currentScreen === "role-assignment" && (
          <div className="w-full max-w-lg space-y-10 animate-slide-in-complex">
            {/* Enhanced header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-indigo-500/30 to-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
              <Card className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-indigo-900/90 border-2 border-purple-400/50 backdrop-blur-sm">
                <CardContent className="p-4 md:p-6 lg:p-8 text-center">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <Shield className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-purple-400 animate-pulse" />
                      <h2 className="text-3xl md:text-3.5xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                        Role Assignment
                      </h2>
                      <Shield className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-purple-400 animate-pulse" />
                    </div>
                    <p className="text-purple-200 text-lg">Pass the device to each player privately</p>

                    {/* Progress indicator */}
                    <div className="flex justify-center space-x-2 mt-4">
                      {[...Array(playerCount)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full transition-all duration-500 ${
                            i < currentPlayerViewing
                              ? "bg-green-400 scale-110"
                              : i === currentPlayerViewing
                                ? "bg-purple-400 scale-125 animate-pulse"
                                : "bg-gray-600"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced role assignment card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-indigo-500/20 rounded-3xl blur-xl animate-pulse"></div>
              <Card className="relative bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-950/95 border-4 border-blue-500/50 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6 md:p-8 lg:p-10 text-center">
                  <div className="space-y-8">
                    {/* Player indicator */}
                    <div className="relative">
                      <div className="text-3xl md:text-3.5xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                        Player {currentPlayerViewing + 1}
                      </div>
                      <div className="flex justify-center">
                        <div className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-4 border-cyan-400/50">
                          <Users className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-white" />
                        </div>
                      </div>
                    </div>

                    {!hasEnteredName ? (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-cyan-200 text-lg font-bold">Enter Your Name</label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Your Name"
                              value={currentPlayerName}
                              onChange={(e) => {
                                setCurrentPlayerName(e.target.value)
                                setNameError("")
                              }}
                              className="w-full px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 bg-gradient-to-r from-white/95 to-cyan-50/95 border-4 border-cyan-400 rounded-2xl font-bold text-lg md:text-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-300 transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl pointer-events-none"></div>
                          </div>
                        </div>
                        {nameError && (
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl blur-sm animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-red-900/60 to-pink-900/60 rounded-xl p-3 md:p-3.5 lg:p-4 border-2 border-red-400/50">
                              <div className="flex items-center justify-center space-x-2">
                                <XCircle className="w-4 h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-red-400" />
                                <span className="text-red-300 font-semibold">{nameError}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <AudioButton
                          onClick={savePlayerName}
                          soundType="success"
                          disabled={!currentPlayerName.trim()}
                          className="relative touch-manipulation pointer-events-auto z-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold py-4 md:py-5 lg:py-6 px-8 md:px-10 lg:px-12 rounded-2xl text-lg md:text-xl disabled:from-gray-500 disabled:to-gray-600 shadow-xl transform hover:scale-105 transition-all duration-300"
                          style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                        >
                          <div className="flex items-center space-x-3">
                            <Star className="w-5 h-5 md:w-6 md:h-6" />
                            <span>Save Name</span>
                          </div>
                        </AudioButton>
                      </div>
                    ) : !showRole ? (
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <div className="text-xl md:text-xl lg:text-2xl text-cyan-200 font-semibold">
                            Ready to reveal your secret role?
                          </div>
                          <div className="flex justify-center space-x-2">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 bg-cyan-400 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              ></div>
                            ))}
                          </div>
                        </div>

                        <AudioButton
                          onClick={() => {
                            setShowRole(true)
                            playNotification() // Play sound when role is revealed
                          }}
                          soundType="select"
                          className="relative touch-manipulation pointer-events-auto z-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold py-4 md:py-5 lg:py-6 px-8 md:px-10 lg:px-12 rounded-2xl text-lg md:text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                          style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                        >
                          <div className="flex items-center space-x-3">
                            <Eye className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                            <span>Reveal Role</span>
                            <Sparkles className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 animate-spin" />
                          </div>
                        </AudioButton>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Role reveal */}
                        <div className="space-y-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-sm animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-yellow-900/60 to-orange-900/60 rounded-2xl p-4 md:p-5 lg:p-6 border-2 border-yellow-400/50">
                              <div className="text-2xl md:text-2.5xl lg:text-3xl font-bold text-yellow-300 mb-3">
                                You are:{" "}
                                {players[currentPlayerViewing]?.role
                                  .toUpperCase()
                                  .replace("cipher", "CIPHER")
                                  .replace("echo", "ECHO")
                                  .replace("blank", "BLANK")}
                              </div>
                              <div className="text-lg md:text-xl text-white">
                                Your word:{" "}
                                <span className="font-bold text-cyan-300 text-2xl md:text-2.5xl lg:text-3xl">
                                  {players[currentPlayerViewing]?.word}
                                </span>
                              </div>
                            </div>

                            {players[currentPlayerViewing]?.role === "blank" && (
                              <div className="bg-gradient-to-br from-red-900/60 to-pink-900/60 rounded-2xl p-3 md:p-3.5 lg:p-4 border-2 border-red-400/50">
                                <div className="text-red-300 text-sm md:text-base font-semibold">
                                  ⚠️ You don't know the word! Listen carefully and try to blend in.
                                </div>
                              </div>
                            )}
                          </div>

                          <AudioButton
                            onClick={nextPlayer}
                            soundType="button"
                            className="relative touch-manipulation pointer-events-auto z-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 text-white font-bold py-4 md:py-5 lg:py-6 px-8 md:px-10 lg:px-12 rounded-2xl text-lg md:text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                            style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                          >
                            <div className="flex items-center space-x-3">
                              <EyeOff className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                              <span>{currentPlayerViewing < playerCount - 1 ? "Next Player" : "Start Game"}</span>
                              <Star className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 animate-spin" />
                            </div>
                          </AudioButton>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Enhanced Discussion Screen */}
        {currentScreen === "discussion" && (
          <div className="w-full max-w-lg space-y-10 animate-slide-in-complex">
            {/* Enhanced header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/30 to-pink-500/20 rounded-3xl blur-xl animate-pulse"></div>
              <Card className="relative bg-gradient-to-br from-slate-900/90 via-red-900/90 to-orange-900/90 border-2 border-orange-400/50 backdrop-blur-sm">
                <CardContent className="p-4 md:p-6 lg:p-8 text-center">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <Target className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-orange-400 animate-pulse" />
                      <h2 className="text-3xl md:text-3.5xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                        Round {round}
                      </h2>
                      <Target className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-orange-400 animate-pulse" />
                    </div>
                    <p className="text-orange-200 text-lg">Discuss and find the undercover agent!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced timer and discussion area */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-indigo-500/20 rounded-3xl blur-xl animate-pulse"></div>
              <Card className="relative bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-950/95 border-4 border-blue-500/50 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6 md:p-8 lg:p-10 text-center">
                  <div className="space-y-8">
                    {/* Enhanced timer */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative flex items-center justify-center space-x-4 bg-gradient-to-br from-cyan-900/60 to-blue-900/60 rounded-full p-6 md:p-7 lg:p-8 border-2 border-cyan-400/50">
                        <Timer className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 text-cyan-300 animate-pulse" />
                        <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                          {formatTime(discussionTime)}
                        </div>
                        <Timer className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 text-cyan-300 animate-pulse" />
                      </div>
                    </div>

                    <div className="text-xl md:text-xl lg:text-2xl text-cyan-200 font-semibold">Discussion Time</div>

                    {/* Enhanced player grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {players
                        .filter((p) => !p.isEliminated)
                        .map((player, index) => (
                          <div key={player.id} className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                            <div
                              className="relative bg-gradient-to-br from-blue-700/60 to-purple-700/60 rounded-xl p-3 md:p-3.5 lg:p-4 border border-blue-400/30 text-white text-lg font-semibold transform hover:scale-105 transition-all duration-300"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span>{player.name}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Enhanced vote button */}
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-red-500/30 via-orange-500/40 to-yellow-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
                      <AudioButton
                        onClick={() => {
                          setIsDiscussing(false)
                          setCurrentScreen("voting")
                        }}
                        soundType="select"
                        className="relative touch-manipulation pointer-events-auto z-20 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-500 hover:via-orange-500 hover:to-yellow-500 text-white font-bold py-4 md:py-5 lg:py-6 px-8 md:px-10 lg:px-12 rounded-2xl text-lg md:text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                        style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
                      >
                        <div className="flex items-center space-x-3">
                          <Vote className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                          <span>Start Voting</span>
                          <Zap className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 animate-pulse" />
                        </div>
                      </AudioButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Anonymous Voting Screen */}
        {currentScreen === "voting" && (
          <AnonymousVoting
            players={players}
            onVotingComplete={handleVotingComplete}
            onRevote={handleRevote}
            onSkipElimination={handleSkipElimination}
          />
        )}

        {/* Enhanced Game Over Screen */}
        {currentScreen === "game-over" && (
          <div className="w-full max-w-2xl space-y-10 animate-slide-in-complex">
            {/* Enhanced header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 via-orange-500/40 to-red-500/30 rounded-3xl blur-2xl animate-pulse"></div>
              <Card className="relative bg-gradient-to-br from-slate-900/90 via-yellow-900/90 to-orange-900/90 border-4 border-yellow-400/50 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6 md:p-8 lg:p-10 text-center">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center space-x-4">
                      <Trophy className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-yellow-400 animate-bounce" />
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                        Game Over!
                      </h2>
                      <Trophy className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-yellow-400 animate-bounce" />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-sm animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-yellow-900/60 to-orange-900/60 rounded-2xl p-4 md:p-5 lg:p-6 border-2 border-yellow-400/50">
                        <div className="text-3xl md:text-3.5xl lg:text-4xl font-bold text-yellow-300 mb-2">
                          {winner}
                        </div>
                        <div className="flex justify-center space-x-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-yellow-400 animate-pulse"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced final roles display */}
            <Card className="bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-purple-900/90 border-2 border-blue-400/50 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6 lg:p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl md:text-2.5xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
                      Final Roles Revealed
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {players.map((player, index) => (
                      <div key={player.id} className="relative group">
                        <div
                          className={`absolute inset-0 rounded-2xl blur opacity-25 transition-all duration-300 ${
                            player.isEliminated
                              ? "bg-gradient-to-r from-red-500 to-pink-500"
                              : "bg-gradient-to-r from-green-500 to-emerald-500"
                          }`}
                        ></div>

                        <div
                          className={`relative p-4 md:p-5 lg:p-6 rounded-2xl border-2 transition-all duration-500 ${
                            player.isEliminated
                              ? "bg-gradient-to-br from-red-900/60 to-pink-900/60 border-red-400/50"
                              : "bg-gradient-to-br from-green-900/60 to-emerald-900/60 border-green-400/50"
                          }`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:w-16 rounded-full flex items-center justify-center border-2 ${
                                  player.isEliminated
                                    ? "bg-gradient-to-br from-red-500 to-pink-500 border-red-400"
                                    : "bg-gradient-to-br from-green-500 to-emerald-500 border-green-400"
                                }`}
                              >
                                {player.isEliminated ? (
                                  <Skull className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                                ) : (
                                  <Heart className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white animate-pulse" />
                                )}
                              </div>

                              <div>
                                <div className="text-xl md:text-xl lg:text-2xl font-bold text-white">{player.name}</div>
                                <div className="text-sm md:text-base text-gray-300">
                                  {player.role
                                    .toUpperCase()
                                    .replace("cipher", "CIPHER")
                                    .replace("echo", "ECHO")
                                    .replace("blank", "BLANK")}{" "}
                                  - {player.word}
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div
                                className={`text-sm md:text-base font-semibold ${
                                  player.isEliminated ? "text-red-300" : "text-green-300"
                                }`}
                              >
                                {player.isEliminated ? "ELIMINATED" : "SURVIVED"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Word pair reveal */}
                  {currentWordPair && (
                    <div className="relative mt-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-blue-900/60 to-purple-900/60 rounded-2xl p-4 md:p-5 lg:p-6 border-2 border-blue-400/50">
                        <div className="text-center">
                          <div className="text-cyan-200 text-lg font-semibold mb-3">Words this round:</div>
                          <div className="text-white text-xl">
                            <span className="font-bold text-green-400">Cipher:</span> {currentWordPair.civilian} |{" "}
                            <span className="font-bold text-red-400">Echo:</span> {currentWordPair.undercover}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced play again button */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 via-cyan-500/40 to-blue-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse"></div>
              <AudioButton
                onClick={resetGame}
                soundType="start"
                className="relative touch-manipulation pointer-events-auto z-20 w-full bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-blue-500 text-white font-bold py-6 md:py-7 lg:py-8 px-12 md:px-14 lg:px-16 rounded-3xl text-2xl md:text-2.5xl lg:text-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-emerald-400/50"
                style={{ touchAction: "manipulation", minWidth: "44px", minHeight: "44px" }}
              >
                <div className="flex items-center justify-center space-x-4">
                  <Play className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 fill-current" />
                  <span className="tracking-wide text-lg md:text-xl lg:text-2xl">Play Again</span>
                  <Sparkles className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 animate-spin" />
                </div>
              </AudioButton>
            </div>
          </div>
        )}
      </div>
      {/* Add the EliminationAnnouncement component to the JSX, after all the other screens */}
      {showEliminationAnnouncement && (
        <EliminationAnnouncement eliminatedPlayer={eliminatedPlayerData} onContinue={handleContinueAfterElimination} />
      )}
      <style jsx>{`
        * {
          -webkit-tap-highlight-color: transparent;
        }

        button, .cursor-pointer {
          touch-action: manipulation;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }

        @keyframes fade-in-complex {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-in-complex {
          from {
            opacity: 0;
            transform: translateX(100px) rotateY(20deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotateY(0deg);
          }
        }

        @keyframes float-complex {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateY(-15px) rotate(240deg);
          }
        }

        @keyframes wave-complex {
          0%, 100% {
            transform: translateX(0px) scaleY(1);
          }
          50% {
            transform: translateX(-30px) scaleY(1.1);
          }
        }

        @keyframes wave-complex-delayed {
          0%, 100% {
            transform: translateX(0px) scaleY(1);
          }
          50% {
            transform: translateX(20px) scaleY(0.9);
          }
        }

        @keyframes bounce-complex {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-rainbow {
          0%, 100% {
            opacity: 0.3;
          }
          33% {
            opacity: 0.6;
          }
          66% {
            opacity: 0.9;
          }
        }

        @keyframes title-glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
          }
          50% {
            text-shadow: 0 0 40px rgba(34, 211, 238, 0.6), 0 0 60px rgba(59, 130, 246, 0.4);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes float-icon {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(10deg);
          }
        }

        @keyframes float-icon-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(-10deg);
          }
        }

        @keyframes float-icon-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in-complex {
          animation: fade-in-complex 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .animate-slide-in-complex {
          animation: slide-in-complex 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .animate-float-complex {
          animation: float-complex 6s ease-in-out infinite;
        }

        .animate-wave-complex {
          animation: wave-complex 4s ease-in-out infinite;
        }

        .animate-wave-complex-delayed {
          animation: wave-complex-delayed 3s ease-in-out infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-bounce-complex {
          animation: bounce-complex 2s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-pulse-rainbow {
          animation: pulse-rainbow 2s ease-in-out infinite;
        }

        .animate-title-glow {
          animation: title-glow 2s ease-in-out infinite;
        }

        .animate-gradient-shift {
          animation: gradient-shift 8s ease infinite;
          background-size: 200% 200%;
        }

        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }

        .animate-float-icon {
          animation: float-icon 4s ease-in-out infinite;
        }

        .animate-float-icon-delayed {
          animation: float-icon-delayed 5s ease-in-out infinite;
        }

        .animate-float-icon-slow {
          animation: float-icon-slow 6s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .bg-wave-pattern {
          background-image: radial-gradient(circle at 50% 100%, rgba(255,255,255,0.1) 0%, transparent 50%);
        }

        @keyframes premium-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes premium-glow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(8, 145, 178, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(8, 145, 178, 0.6);
          }
        }

        .animate-premium-pulse {
          animation: premium-pulse 3s ease-in-out infinite;
        }

        .animate-premium-glow {
          animation: premium-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
