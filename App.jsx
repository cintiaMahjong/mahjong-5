import { useEffect, useState } from "react";

import "./App.css";

import HomePage from "./pages/HomePage";
import NewGamePage from "./pages/NewGamePage";
import GamePage from "./pages/GamePage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";

import { createGame } from "./models/Game";

import {
  saveGame,
  loadGame,
  deleteGame,
  loadGameHistory,
  saveFinishedGame
} from "./services/storageService";


function App() {

  // -----------------------------------------
  // PARTIDA ACTIVA
  // -----------------------------------------

  const [game, setGame] = useState(
    () => loadGame()
  );

  // -----------------------------------------
  // HISTORIAL
  // -----------------------------------------

  const [gameHistory, setGameHistory] =
    useState(
      () => loadGameHistory()
    );

  // -----------------------------------------
  // PANTALLA ACTUAL
  // -----------------------------------------

  const [screen, setScreen] = useState(
    () => {
      const savedGame = loadGame();

      return savedGame
        ? "game"
        : "home";
    }
  );


  // -----------------------------------------
  // GUARDAR AUTOMÁTICAMENTE
  // -----------------------------------------

  useEffect(() => {

    if (!game) {
      return;
    }

    // Si la partida ha terminado,
    // la archivamos en el historial.
    if (game.finished) {

      const alreadyArchived =
        gameHistory.some(
          (item) =>
            item.createdAt === game.createdAt &&
            item.history?.length === game.history?.length
        );

      if (!alreadyArchived) {

        const finishedGame =
          saveFinishedGame(game);

        if (finishedGame) {

          setGameHistory(
            loadGameHistory()
          );

        }
      }

      return;
    }

    // Partida todavía en curso
    saveGame(game);

  }, [game]);


  // -----------------------------------------
  // NUEVA PARTIDA
  // -----------------------------------------

  function startGame(playerNames) {

    const newGame =
      createGame(playerNames);

    setGame(newGame);
    setScreen("game");
  }


  // -----------------------------------------
  // ACTUALIZAR PARTIDA
  // -----------------------------------------

  function updateGame(updatedGame) {

    setGame(updatedGame);
  }


  // -----------------------------------------
  // VOLVER A INICIO
  // -----------------------------------------

  function goHome() {

    setGame(
      loadGame()
    );

    setGameHistory(
      loadGameHistory()
    );

    setScreen("home");
  }


  // -----------------------------------------
  // NUEVA PARTIDA DESDE CERO
  // -----------------------------------------

  function newGame() {

    const confirmed =
      window.confirm(
        "¿Quieres abandonar la partida actual y comenzar una nueva?"
      );

    if (!confirmed) {
      return;
    }

    deleteGame();

    setGame(null);
    setScreen("new");
  }


  // -----------------------------------------
  // CONTINUAR PARTIDA
  // -----------------------------------------

  function continueGame() {

    const savedGame =
      loadGame();

    if (!savedGame) {

      alert(
        "No hay ninguna partida guardada."
      );

      return;
    }

    setGame(savedGame);
    setScreen("game");
  }


  // -----------------------------------------
  // ABRIR HISTORIAL
  // -----------------------------------------

  function openHistory() {

    setGameHistory(
      loadGameHistory()
    );

    setScreen("history");
  }


  // -----------------------------------------
  // MOSTRAR PARTIDA TERMINADA
  // -----------------------------------------

  function showFinishedGame(
    selectedGame
  ) {

    setGame(selectedGame);
    setScreen("results");
  }


  // -----------------------------------------
  // ELIMINAR PARTIDA DEL HISTORIAL
  // -----------------------------------------

  function handleDeleteHistory(
    gameId
  ) {

    const confirmed =
      window.confirm(
        "¿Seguro que quieres eliminar esta partida del historial?"
      );

    if (!confirmed) {
      return;
    }

    const newHistory =
      gameHistory.filter(
        (item) => item.id !== gameId
      );

    localStorage.setItem(
      "mahjong-madrid-game-history",
      JSON.stringify(newHistory)
    );

    setGameHistory(newHistory);
  }


  // -----------------------------------------
  // PANTALLAS
  // -----------------------------------------

  if (screen === "home") {

    return (
      <div className="App">
        <HomePage
          hasActiveGame={Boolean(game)}
          onNewGame={() =>
            setScreen("new")
          }
          onContinueGame={continueGame}
          onHistory={openHistory}
        />
      </div>
    );
  }


  if (screen === "new") {

    return (
      <div className="App">
        <NewGamePage
          onStartGame={startGame}
          onBack={goHome}
        />
      </div>
    );
  }


  if (screen === "game" && game) {

    return (
      <div className="App">
        <GamePage
          game={game}
          updateGame={updateGame}
          onHome={goHome}
        />
      </div>
    );
  }


  if (screen === "results" && game) {

    return (
      <div className="App">
        <ResultsPage
          game={game}
          onNewGame={() => {
            setGame(null);
            setScreen("new");
          }}
          onHistory={openHistory}
          onHome={goHome}
        />
      </div>
    );
  }


  if (screen === "history") {

    return (
      <div className="App">
        <HistoryPage
          history={gameHistory}
          onBack={goHome}
          onViewGame={showFinishedGame}
          onDeleteGame={
            handleDeleteHistory
          }
        />
      </div>
    );
  }


  return null;
}

export default App;