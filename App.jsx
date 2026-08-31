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
  // POPUP PARTIDA A MEDIAS
  // -----------------------------------------

  const [showActiveGamePopup, setShowActiveGamePopup] =
    useState(false);

  // -----------------------------------------
  // GUARDAR AUTOMÁTICAMENTE
  // -----------------------------------------

  useEffect(() => {

    if (!game) {
      return;
    }

    // ---------------------------------------
    // PARTIDA TERMINADA
    // ---------------------------------------

    if (game.finished) {

      const finishedGame =
        saveFinishedGame(game);

      if (finishedGame) {

        setGameHistory(
          loadGameHistory()
        );
      }

      return;
    }

    // ---------------------------------------
    // PARTIDA TODAVÍA EN CURSO
    // ---------------------------------------

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
  // PULSAR "NUEVA PARTIDA"
  // -----------------------------------------

  function handleNewGame() {

    const activeGame = loadGame();

    // Si NO hay partida a medias,
    // vamos directamente a Nueva partida.

    if (!activeGame) {

      setGame(null);
      setScreen("new");

      return;
    }

    // Si existe una partida a medias,
    // mostramos el popup.

    setShowActiveGamePopup(true);
  }

  // -----------------------------------------
  // CONTINUAR PARTIDA ACTIVA
  // -----------------------------------------

  function handleContinueActiveGame() {

    const savedGame =
      loadGame();

    if (!savedGame) {

      setShowActiveGamePopup(false);

      alert(
        "No hay ninguna partida guardada."
      );

      return;
    }

    setShowActiveGamePopup(false);

    setGame(savedGame);
    setScreen("game");
  }

  // -----------------------------------------
  // CANCELAR PARTIDA ACTIVA
  // Y GUARDARLA EN HISTORIAL
  // -----------------------------------------

  function handleCancelActiveGame() {

    const activeGame =
      loadGame();

    if (!activeGame) {

      setShowActiveGamePopup(false);

      setGame(null);
      setScreen("new");

      return;
    }

    // Nos aseguramos de que tenga un ID.
    // Las partidas antiguas pueden no tenerlo.

    const gameToArchive = {
      ...structuredClone(activeGame),
      id:
        activeGame.id ||
        activeGame.createdAt ||
        `${Date.now()}`
    };

    // Guardamos la partida en el historial.

    const savedHistoryGame =
      saveFinishedGame(gameToArchive);

    if (savedHistoryGame) {

      setGameHistory(
        loadGameHistory()
      );

      setGame(null);

      setShowActiveGamePopup(false);

      setScreen("new");

    } else {

      alert(
        "No se ha podido guardar la partida en el historial."
      );
    }
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
        (item) =>
          item.id !== gameId
      );

    localStorage.setItem(
      "mahjong-madrid-game-history",
      JSON.stringify(newHistory)
    );

    setGameHistory(
      newHistory
    );
  }

  // -----------------------------------------
  // PANTALLA HOME
  // -----------------------------------------

  if (screen === "home") {

    return (
      <div className="App">

        <HomePage
          hasActiveGame={Boolean(game)}

          onNewGame={
            handleNewGame
          }

          onContinueGame={
            continueGame
          }

          onHistory={
            openHistory
          }
        />

        {/* ---------------------------------- */}
        {/* POPUP PARTIDA A MEDIAS */}
        {/* ---------------------------------- */}

        {showActiveGamePopup && (

          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.70)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
              boxSizing: "border-box"
            }}
          >

            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                background: "#ffffff",
                color: "#222",
                borderRadius: "16px",
                padding: "25px",
                boxSizing: "border-box",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.35)",
                textAlign: "center"
              }}
            >

              {/* ICONO */}

              <div
                style={{
                  fontSize: "42px",
                  marginBottom: "8px"
                }}
              >
                🀄
              </div>

              {/* TITULO */}

              <h2
                style={{
                  margin:
                    "0 0 10px 0",
                  fontSize: "24px"
                }}
              >
                TIENES UNA PARTIDA A MEDIAS
              </h2>

              {/* MENSAJE */}

              <p
                style={{
                  margin:
                    "0 0 25px 0",
                  fontSize: "17px",
                  lineHeight: "1.5"
                }}
              >
                Ya tienes una partida guardada.
                <br />
                ¿Qué quieres hacer?
              </p>

              {/* CONTINUAR */}

              <button
                onClick={
                  handleContinueActiveGame
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  marginBottom: "10px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#D4AF37",
                  color: "#222",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                ▶️ CONTINUAR PARTIDA
              </button>

              {/* CANCELAR */}

              <button
                onClick={
                  handleCancelActiveGame
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#eeeeee",
                  color: "#333",
                  fontSize: "17px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                🗑️ CANCELAR Y EMPEZAR NUEVA
              </button>

              {/* CERRAR */}

              <button
                onClick={() =>
                  setShowActiveGamePopup(false)
                }
                style={{
                  width: "100%",
                  marginTop: "12px",
                  padding: "10px",
                  border: "none",
                  background:
                    "transparent",
                  color: "#777",
                  fontSize: "15px",
                  cursor: "pointer"
                }}
              >
                Volver
              </button>

            </div>

          </div>
        )}

      </div>
    );
  }

  // -----------------------------------------
  // NUEVA PARTIDA
  // -----------------------------------------

  if (screen === "new") {

    return (
      <div className="App">

        <NewGamePage
          onStartGame={
            startGame
          }

          onBack={
            goHome
          }
        />

      </div>
    );
  }

  // -----------------------------------------
  // PARTIDA EN CURSO
  // -----------------------------------------

  if (
    screen === "game" &&
    game
  ) {

    return (
      <div className="App">

        <GamePage
          game={game}
          updateGame={
            updateGame
          }
          onHome={
            goHome
          }
        />

      </div>
    );
  }

  // -----------------------------------------
  // RESULTADOS
  // -----------------------------------------

  if (
    screen === "results" &&
    game
  ) {

    return (
      <div className="App">

        <ResultsPage
          game={game}

          onNewGame={() => {

            setGame(null);
            setScreen("new");

          }}

          onHistory={
            openHistory
          }

          onHome={
            goHome
          }
        />

      </div>
    );
  }

  // -----------------------------------------
  // HISTORIAL
  // -----------------------------------------

  if (
    screen === "history"
  ) {

    return (
      <div className="App">

        <HistoryPage
          history={
            gameHistory
          }

          onBack={
            goHome
          }

          onViewGame={
            showFinishedGame
          }

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
