"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

// Avatar interface
export interface Avatar {
  id: string
  emoji: string
  color: string
  name: string
}

// Types
export type Player = {
  id: string
  name: string
  isHost: boolean
  isReady: boolean
  avatar?: Avatar
}

export type GameRoom = {
  roomCode: string
  players: Player[]
  status: "waiting" | "starting" | "playing" | "ended"
  minPlayers: number
  maxPlayers: number
}

type GameContextType = {
  currentPlayer: Player | null
  gameRoom: GameRoom | null
  isLoading: boolean
  error: string | null
  createRoom: (playerName: string, avatar?: Avatar) => void
  joinRoom: (roomCode: string, playerName: string, avatar?: Avatar) => void
  leaveRoom: () => void
  startGame: () => void
  setPlayerReady: (isReady: boolean) => void
  updatePlayerAvatar: (avatar: Avatar) => void
}

// Default avatars for demo players
const DEFAULT_AVATARS: Avatar[] = [
  { id: "cat", emoji: "🐱", color: "from-orange-400 to-red-500", name: "Cat" },
  { id: "dog", emoji: "🐶", color: "from-amber-400 to-orange-500", name: "Dog" },
  { id: "fox", emoji: "🦊", color: "from-orange-500 to-red-600", name: "Fox" },
  { id: "bear", emoji: "🐻", color: "from-amber-600 to-orange-700", name: "Bear" },
  { id: "frog", emoji: "🐸", color: "from-green-400 to-emerald-500", name: "Frog" },
  { id: "fish", emoji: "🐠", color: "from-blue-400 to-cyan-500", name: "Fish" },
]

// Generate a random 6-character room code
const generateRoomCode = (): string => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined)

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [gameRoom, setGameRoom] = useState<GameRoom | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Simulate WebSocket connection
  useEffect(() => {
    if (gameRoom) {
      // Simulate other players joining randomly (for demo purposes)
      const simulatePlayerJoin = setTimeout(
        () => {
          if (gameRoom.players.length < 6 && gameRoom.status === "waiting") {
            const randomNames = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Quinn"]
            const randomName = randomNames[Math.floor(Math.random() * randomNames.length)]

            setGameRoom((prev) => {
              if (!prev) return null

              // Check if name already exists
              const nameExists = prev.players.some((p) => p.name === randomName)
              if (nameExists) return prev

              // Get a random avatar for the demo player
              const randomAvatar = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)]

              return {
                ...prev,
                players: [
                  ...prev.players,
                  {
                    id: uuidv4(),
                    name: randomName,
                    isHost: false,
                    isReady: Math.random() > 0.3, // 70% chance of being ready
                    avatar: randomAvatar,
                  },
                ],
              }
            })
          }
        },
        Math.random() * 10000 + 5000,
      ) // Random time between 5-15 seconds

      return () => clearTimeout(simulatePlayerJoin)
    }
  }, [gameRoom])

  // Create a new room
  const createRoom = (playerName: string, avatar?: Avatar) => {
    setIsLoading(true)
    setError(null)

    // Simulate network delay
    setTimeout(() => {
      try {
        const playerId = uuidv4()
        const roomCode = generateRoomCode()

        const newPlayer: Player = {
          id: playerId,
          name: playerName,
          isHost: true,
          isReady: true,
          avatar,
        }

        const newRoom: GameRoom = {
          roomCode,
          players: [newPlayer],
          status: "waiting",
          minPlayers: 4,
          maxPlayers: 8,
        }

        setCurrentPlayer(newPlayer)
        setGameRoom(newRoom)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to create room. Please try again.")
        setIsLoading(false)
      }
    }, 1500)
  }

  // Join an existing room
  const joinRoom = (roomCode: string, playerName: string, avatar?: Avatar) => {
    setIsLoading(true)
    setError(null)

    // Simulate network delay
    setTimeout(() => {
      try {
        // In a real app, we would validate the room code against the server
        if (roomCode.length !== 6) {
          throw new Error("Invalid room code")
        }

        // Simulate finding the room (in a real app, this would be a server request)
        // For demo, we'll create a mock room if the code format is valid
        const playerId = uuidv4()

        const newPlayer: Player = {
          id: playerId,
          name: playerName,
          isHost: false,
          isReady: true,
          avatar,
        }

        // Create a mock room with some players
        const mockPlayers: Player[] = [
          {
            id: uuidv4(),
            name: "Host Player",
            isHost: true,
            isReady: true,
            avatar: DEFAULT_AVATARS[0],
          },
          newPlayer,
        ]

        // Add some random players with avatars
        const randomNames = ["Alex", "Jordan", "Taylor"]
        randomNames.forEach((name, index) => {
          mockPlayers.push({
            id: uuidv4(),
            name,
            isHost: false,
            isReady: Math.random() > 0.5,
            avatar: DEFAULT_AVATARS[index + 1],
          })
        })

        const mockRoom: GameRoom = {
          roomCode,
          players: mockPlayers,
          status: "waiting",
          minPlayers: 4,
          maxPlayers: 8,
        }

        setCurrentPlayer(newPlayer)
        setGameRoom(mockRoom)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to join room. Please try again.")
        setIsLoading(false)
      }
    }, 1500)
  }

  // Leave the current room
  const leaveRoom = () => {
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      if (gameRoom && currentPlayer) {
        // If the current player is the host, the room is disbanded
        if (currentPlayer.isHost) {
          setGameRoom(null)
          setCurrentPlayer(null)
        } else {
          // Otherwise, just remove the player from the room
          setGameRoom({
            ...gameRoom,
            players: gameRoom.players.filter((p) => p.id !== currentPlayer.id),
          })
          setCurrentPlayer(null)
        }
      }
      setIsLoading(false)
    }, 1000)
  }

  // Start the game (host only)
  const startGame = () => {
    if (!gameRoom || !currentPlayer?.isHost) return

    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      setGameRoom({
        ...gameRoom,
        status: "starting",
      })
      setIsLoading(false)
    }, 1500)
  }

  // Set player ready status
  const setPlayerReady = (isReady: boolean) => {
    if (!gameRoom || !currentPlayer) return

    setGameRoom({
      ...gameRoom,
      players: gameRoom.players.map((p) => (p.id === currentPlayer.id ? { ...p, isReady } : p)),
    })

    setCurrentPlayer({
      ...currentPlayer,
      isReady,
    })
  }

  // Update player avatar
  const updatePlayerAvatar = (avatar: Avatar) => {
    if (!gameRoom || !currentPlayer) return

    const updatedPlayer = { ...currentPlayer, avatar }

    setGameRoom({
      ...gameRoom,
      players: gameRoom.players.map((p) => (p.id === currentPlayer.id ? updatedPlayer : p)),
    })

    setCurrentPlayer(updatedPlayer)
  }

  const value = {
    currentPlayer,
    gameRoom,
    isLoading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    setPlayerReady,
    updatePlayerAvatar,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
