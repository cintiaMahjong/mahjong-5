import { useEffect, useState } from "react";

import "./App.css";

import HomePage from "./pages/HomePage";
import NewGamePage from "./pages/NewGamePage";
import GamePage from "./pages/GamePage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import StatisticsPage from "./pages/StatisticsPage";
import RiichiGamePage from "./pages/RiichiGamePage";
import RiichiResultsPage from "./pages/RiichiResultsPage";

import { createGame } from "./models/Game";
import { createRiichiGame } from "./models/RiichiGame";

import {
  saveGame,
  loadGame,
  loadGameHistory,
  saveFinishedGame,
  saveUnfinishedGameToHistory,
  saveUser,
  loadUser
} from "./services/storageService";

import es from "./translations/es";
import en from "./translations/en";
import ch from "./translations/ch";
import zh from "./translations/zh";

// =====================================================
// IDIOMAS
// =====================================================

const LANGUAGE_KEY = "mahjong-madrid-language";

const translations = {
  es,
  en,
  ch,
  zh
};

// =====================================================
// USUARIO
// =====================================================

function createUserId() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

// =====================================================
// COMPROBAR SI ES RIICHI
// =====================================================

function isRiichiGame(game) {
  return (
    game &&
    (
      game.gameType === "RIICHI" ||
      game.type === "RIICHI"
    )
  );
}

// =====================================================
// APP
// =====================================================

function App() {

  // ===================================================
  // IDIOMA
  // ===================================================

  const [language, setLanguage] = useState(() => {
    const savedLanguage =
      localStorage.getItem(LANGUAGE_KEY);

    return translations[savedLanguage]
      ? savedLanguage
      : "es";
  });

  // ===================================================
  // GUARDAR IDIOMA
  // ===================================================

  useEffect(() => {
    localStorage.setItem(
      LANGUAGE_KEY,
      language
    );
  }, [language]);

  // ===================================================
  // TRADUCCIONES
  // ===================================================

  const t =
    translations[language] || translations.es;

  // ===================================================
  // USUARIO LOCAL
  // ===================================================

  const [currentUser, setCurrentUser] =
    useState(() => loadUser());

  // ===================================================
  // POPUP CREAR USUARIO
  // ===================================================

  const [
    showUserPopup,
    setShowUserPopup
  ] = useState(() => !loadUser());

  const [
    userNameInput,
    setUserNameInput
  ] = useState(() => {
    const savedUser = loadUser();

    return savedUser
      ? savedUser.name
      : "";
  });

  // ===================================================
  // PARTIDA ACTIVA
  // ===================================================

  const [game, setGame] = useState(
    () => loadGame()
  );

  // ===================================================
  // HISTORIAL
  // ===================================================

  const [gameHistory, setGameHistory] =
    useState(() => loadGameHistory());

  // ===================================================
  // PANTALLA ACTUAL
  // ===================================================

  const [screen, setScreen] = useState(() => {
    const savedGame = loadGame();

    if (!savedGame) {
      return "home";
    }

    if (isRiichiGame(savedGame)) {
      return "riichi-game";
    }

    return "game";
  });

  // ===================================================
  // POPUP PARTIDA A MEDIAS
  // ===================================================

  const [
    showActiveGamePopup,
    setShowActiveGamePopup
  ] = useState(false);

  // ===================================================
  // GUARDADO AUTOMÁTICO
  // ===================================================

  useEffect(() => {
    if (!game) {
      return;
    }

    // -----------------------------------------------
    // PARTIDA TERMINADA
    // -----------------------------------------------

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

    // -----------------------------------------------
    // PARTIDA EN CURSO
    // -----------------------------------------------

    saveGame(game);

  }, [game]);

  // =====================================================
  // USUARIO
  // =====================================================

  function handleSaveUser() {
    const name =
      userNameInput.trim();

    if (!name) {
      return;
    }

    const existingUser =
      currentUser;

    const user = existingUser
      ? {
          ...existingUser,
          name
        }
      : {
          id: createUserId(),
          name
        };

    saveUser(user);

    setCurrentUser(user);
    setShowUserPopup(false);
  }

  // =====================================================
  // NUEVA PARTIDA
  // =====================================================
  //
  // Aquí se decide si la partida es:
  //
  // - Mahjong MCR
  // - Riichi
  //
  // NewGamePage llama a esta función con:
  //
  // onStartGame(playerNames)
  //
  // para MCR
  //
  // o:
  //
  // onStartGame(playerNames, "riichi")
  //
  // para Riichi.
  //
  // =====================================================

  function startGame(playerNames, gameMode) {

    // =================================================
    // CREAR PARTIDA
    // =================================================

    const newGame =
      gameMode === "riichi"
        ? createRiichiGame(playerNames)
        : createGame(playerNames);

    // =================================================
    // IDENTIFICAR USUARIO LOCAL
    // =================================================

    if (currentUser) {

      const normalizedUserName =
        currentUser.name
          .trim()
          .toLowerCase();

      const matchingPlayerIndex =
        newGame.players.findIndex(
          (player) =>
            player.name
              .trim()
              .toLowerCase() ===
            normalizedUserName
        );

      if (matchingPlayerIndex !== -1) {

        newGame.players =
          newGame.players.map(
            (player, index) => {

              if (
                index ===
                matchingPlayerIndex
              ) {
                return {
                  ...player,
                  userId:
                    currentUser.id
                };
              }

              return {
                ...player,
                userId: null
              };
            }
          );

        newGame.createdBy =
          currentUser.id;

      } else {

        newGame.createdBy =
          currentUser.id;

        newGame.players =
          newGame.players.map(
            (player) => ({
              ...player,
              userId: null
            })
          );
      }

    } else {

      newGame.createdBy = null;

      newGame.players =
        newGame.players.map(
          (player) => ({
            ...player,
            userId: null
          })
        );
    }

    // =================================================
    // GUARDAR PARTIDA
    // =================================================

    setGame(newGame);

    // =================================================
    // ELEGIR PANTALLA
    // =================================================

    if (gameMode === "riichi") {

      setScreen("riichi-game");

    } else {

      setScreen("game");
    }
  }

  // =====================================================
  // ACTUALIZAR PARTIDA
  // =====================================================

  function updateGame(updatedGame) {
    setGame(updatedGame);
  }

  // =====================================================
  // TERMINAR PARTIDA
  // =====================================================

  function finishGame() {

    if (!game) {
      return;
    }

    const gameToFinish = {
      ...structuredClone(game),
      finished: true,
      id:
        game.id ||
        game.createdAt ||
        `${Date.now()}`
    };

    const finishedGame =
      saveFinishedGame(
        gameToFinish
      );

    if (!finishedGame) {
      alert(
        t.cannotSaveHistory
      );
      return;
    }

    setGameHistory(
      loadGameHistory()
    );

    setGame(finishedGame);

    // -----------------------------------------------
    // RESULTADOS RIICHI
    // -----------------------------------------------

    if (isRiichiGame(game)) {
      setScreen(
        "riichi-results"
      );
      return;
    }

    // -----------------------------------------------
    // RESULTADOS MCR
    // -----------------------------------------------

    setScreen("results");
  }

  // =====================================================
  // VOLVER A INICIO
  // =====================================================

  function goHome() {

    setGame(
      loadGame()
    );

    setGameHistory(
      loadGameHistory()
    );

    setScreen("home");
  }

  // =====================================================
  // NUEVA PARTIDA
  // =====================================================

  function handleNewGame() {

    const activeGame =
      loadGame();

    if (!activeGame) {

      setGame(null);
      setScreen("new");

      return;
    }

    setShowActiveGamePopup(true);
  }

  // =====================================================
  // NUEVA PARTIDA DESDE HISTORIAL
  // =====================================================

  function handleNewGameFromHistory() {

    const activeGame =
      loadGame();

    if (!activeGame) {

      setGame(null);
      setScreen("new");

      return;
    }

    setScreen("home");
    setShowActiveGamePopup(true);
  }

  // =====================================================
  // CONTINUAR PARTIDA ACTIVA
  // =====================================================

  function handleContinueActiveGame() {

    const savedGame =
      loadGame();

    if (!savedGame) {

      setShowActiveGamePopup(false);

      alert(
        t.noSavedGame
      );

      return;
    }

    setShowActiveGamePopup(false);

    setGame(savedGame);

    if (isRiichiGame(savedGame)) {

      setScreen(
        "riichi-game"
      );

    } else {

      setScreen("game");
    }
  }

  // =====================================================
  // CANCELAR PARTIDA ACTIVA
  // =====================================================

  function handleCancelActiveGame() {

    const activeGame =
      loadGame();

    if (!activeGame) {

      setShowActiveGamePopup(false);
      setGame(null);
      setScreen("new");

      return;
    }

    const gameToArchive = {
      ...structuredClone(activeGame),
      id:
        activeGame.id ||
        activeGame.createdAt ||
        `${Date.now()}`
    };

    const savedHistoryGame =
      saveUnfinishedGameToHistory(
        gameToArchive
      );

    if (savedHistoryGame) {

      setGameHistory(
        loadGameHistory()
      );

      setGame(null);
      setShowActiveGamePopup(false);

      // Después de cancelar la partida,
      // volvemos siempre a NUEVA PARTIDA.
      setScreen("new");

    } else {

      alert(
        t.cannotSaveHistory
      );
    }
  }

  // =====================================================
  // CONTINUAR PARTIDA
  // =====================================================

  function continueGame() {

    const savedGame =
      loadGame();

    if (!savedGame) {

      alert(
        t.noSavedGame
      );

      return;
    }

    setGame(savedGame);

    if (isRiichiGame(savedGame)) {

      setScreen(
        "riichi-game"
      );

    } else {

      setScreen("game");
    }
  }

  // =====================================================
  // HISTORIAL
  // =====================================================

  function openHistory() {

    setGameHistory(
      loadGameHistory()
    );

    setScreen("history");
  }

  // =====================================================
  // ESTADÍSTICAS
  // =====================================================

  function openStatistics() {

    setGameHistory(
      loadGameHistory()
    );

    setScreen("statistics");
  }

  // =====================================================
  // MOSTRAR PARTIDA TERMINADA
  // =====================================================

  function showFinishedGame(
    selectedGame
  ) {

    setGame(selectedGame);

    if (isRiichiGame(selectedGame)) {

      setScreen(
        "riichi-results"
      );

    } else {

      setScreen("results");
    }
  }

  // =====================================================
  // ELIMINAR PARTIDA DEL HISTORIAL
  // =====================================================

  function handleDeleteHistory(
    gameId
  ) {

    const confirmed =
      window.confirm(
        t.deleteGameConfirmation
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

  // =====================================================
  // HOME
  // =====================================================

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

          onStatistics={
            openStatistics
          }

          language={language}

          setLanguage={
            setLanguage
          }

          t={t}
        />

        {/* =========================================
            POPUP PARTIDA A MEDIAS
        ========================================= */}

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

              <div
                style={{
                  fontSize: "42px",
                  marginBottom: "8px"
                }}
              >
                🀄
              </div>

              <h2
                style={{
                  margin:
                    "0 0 10px 0",
                  fontSize: "24px"
                }}
              >
                {t.activeGameTitle}
              </h2>

              <p
                style={{
                  margin:
                    "0 0 25px 0",
                  fontSize: "17px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-line"
                }}
              >
                {t.activeGameMessage}
              </p>

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
                ▶️ {t.continueGame}
              </button>

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
                🗑️ {t.cancelAndNewGame}
              </button>

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
                {t.back}
              </button>

            </div>
          </div>
        )}

        {/* =========================================
            POPUP USUARIO
        ========================================= */}

        {showUserPopup && (

          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.70)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
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

              <div
                style={{
                  fontSize: "42px",
                  marginBottom: "8px"
                }}
              >
                👤
              </div>

              <h2
                style={{
                  margin:
                    "0 0 10px 0",
                  fontSize: "24px"
                }}
              >
                {t.userWelcomeTitle ||
                  "Tu usuario"}
              </h2>

              <p
                style={{
                  margin:
                    "0 0 20px 0",
                  fontSize: "16px",
                  lineHeight: "1.5"
                }}
              >
                {t.userWelcomeMessage ||
                  "Introduce tu nombre para poder guardar tus estadísticas personales en este dispositivo."}
              </p>

              <input
                type="text"
                value={userNameInput}
                onChange={(event) =>
                  setUserNameInput(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {

                  if (
                    event.key ===
                    "Enter"
                  ) {
                    handleSaveUser();
                  }

                }}
                placeholder={
                  t.userNamePlaceholder ||
                  "Tu nombre"
                }
                autoFocus
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px",
                  border:
                    "1px solid #cccccc",
                  borderRadius: "10px",
                  fontSize: "17px",
                  marginBottom: "15px",
                  outline: "none"
                }}
              />

              <button
                onClick={
                  handleSaveUser
                }
                disabled={
                  !userNameInput.trim()
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",
                  background:
                    userNameInput.trim()
                      ? "#D4AF37"
                      : "#cccccc",
                  color: "#222",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor:
                    userNameInput.trim()
                      ? "pointer"
                      : "default"
                }}
              >
                ✓{" "}
                {t.saveUser ||
                  "Guardar"}
              </button>

            </div>
          </div>
        )}

      </div>
    );
  }

  // =====================================================
  // NUEVA PARTIDA
  // =====================================================

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

          t={t}
        />

      </div>
    );
  }

  // =====================================================
  // PARTIDA RIICHI
  // =====================================================

  if (
    screen === "riichi-game" &&
    game &&
    isRiichiGame(game)
  ) {

    return (
      <div className="App">

        <RiichiGamePage
          game={game}

          updateGame={
            updateGame
          }

          onHome={
            goHome
          }

          onFinish={
            finishGame
          }

          t={t}
        />

      </div>
    );
  }

  // =====================================================
  // PARTIDA MCR
  // =====================================================

  if (
    screen === "game" &&
    game &&
    !isRiichiGame(game)
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

          onFinish={
            finishGame
          }

          t={t}
        />

      </div>
    );
  }

  // =====================================================
  // RESULTADOS RIICHI
  // =====================================================

  if (
  screen === "riichi-results" &&
  game
) {
  return (
    <div className="App">
      <RiichiResultsPage
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
        t={t}
      />
    </div>
  );
}

  // =====================================================
  // RESULTADOS MCR
  // =====================================================

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

          t={t}
        />

      </div>
    );
  }

  // =====================================================
  // HISTORIAL
  // =====================================================

  if (
    screen === "history"
  ) {

    return (
      <div className="App">

        <HistoryPage
          history={gameHistory}

          onBack={
            goHome
          }

          onNewGame={
            handleNewGameFromHistory
          }

          onViewGame={
            showFinishedGame
          }

          onDeleteGame={
            handleDeleteHistory
          }

          t={t}
        />

      </div>
    );
  }

  // =====================================================
  // ESTADÍSTICAS
  // =====================================================

  if (
    screen === "statistics"
  ) {

    return (
      <div className="App">

        <StatisticsPage
          history={
            gameHistory
          }

          currentUser={
            currentUser
          }

          onBack={
            goHome
          }

          t={t}
        />

      </div>
    );
  }

  return null;
}

export default App;
