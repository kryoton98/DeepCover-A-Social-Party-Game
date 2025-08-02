"use client"

import { useState } from "react"
import { GameProvider, useGame } from "./game-context"
import OnlineEntry from "./online-entry"
import CreateGame from "./create-game"
import JoinGame from "./join-game"

type OnlineScreen = "entry" | "create" | "join"

function OnlineModeContent() {
  const [currentScreen, setCurrentScreen] = useState<OnlineScreen>("entry")
  const { gameRoom, currentPlayer } = useGame()

  // Handle navigation
  const navigateToEntry = () => setCurrentScreen("entry")
  const navigateToCreate = () => setCurrentScreen("create")
  const navigateToJoin = () => setCurrentScreen("join")

  // Render the appropriate screen
  switch (currentScreen) {
    case "entry":
      return (
        <OnlineEntry
          onCreateGame={navigateToCreate}
          onJoinGame={navigateToJoin}
          onBack={() => {
            // This will be handled by the parent component
            window.history.back()
          }}
        />
      )
    case "create":
      return <CreateGame onBack={navigateToEntry} />
    case "join":
      return <JoinGame onBack={navigateToEntry} />
    default:
      return (
        <OnlineEntry
          onCreateGame={navigateToCreate}
          onJoinGame={navigateToJoin}
          onBack={() => {
            window.history.back()
          }}
        />
      )
  }
}

export default function OnlineMode() {
  return (
    <GameProvider>
      <OnlineModeContent />
    </GameProvider>
  )
}
