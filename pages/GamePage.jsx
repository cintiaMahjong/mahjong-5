import { useEffect, useState } from "react";

import PlayerCard from "../components/PlayerCard";
import RegisterHandModal from "../components/RegisterHandModal";
import History from "../components/History";
import Ranking from "../components/Ranking";

import { undoLastHand } from "../services/gameService";

function GamePage({
  game,
  updateGame,
  onHome,
  onFinish,
  t
}) {
  const [showModal, setShowModal] = useState(false);

  // -----------------------------------------
  // POPUP CAMBIO DE VIENTO
  // -----------------------------------------
  const [showWindChange, setShowWindChange] = useState(false);
  const [windChangeRound, setWindChangeRound] = useState(null);

  // -----------------------------------------
  // POPUP GUARDAR Y SALIR
  // -----------------------------------------
  const [showSavePopup, setShowSavePopup] = useState(false);

  // -----------------------------------------
  // POPUP DESHACER MANO
  // -----------------------------------------
  const [showUndoPopup, setShowUndoPopup] = useState(false);

  // -----------------------------------------
  // POPUP TERMINAR PARTIDA
  // -----------------------------------------
  const [showFinishPopup, setShowFinishPopup] = useState(false);

  // -----------------------------------------
  // NUMERO DE JUGADORES Y MANOS
  // -----------------------------------------
  const playerCount = game?.players?.length || 5;
  const maxHands = playerCount === 4 ? 16 : 20;
  const maxRounds = playerCount === 4 ? 4 : 5;

  // -----------------------------------------
  // VIENTO CORRESPONDIENTE A CADA RONDA
  // -----------------------------------------
  const roundWind = {
    2: "SUR",
    3: "OESTE",
    4: "NORTE",
    5: "ESTE"
  };

  // -----------------------------------------
  // FICHAS CORRESPONDIENTES A CADA VIENTO
  // -----------------------------------------
  const windTile = {
    ESTE: "🀀",
    SUR: "🀁",
    OESTE: "🀂",
    NORTE: "🀃"
  };

  // -----------------------------------------
  // NOMBRE TRADUCIDO DEL VIENTO
  // -----------------------------------------
  const getWindName = (wind) => {
    if (wind === "ESTE") return t.windEast;
    if (wind === "SUR") return t.windSouth;
    if (wind === "OESTE") return t.windWest;
    if (wind === "NORTE") return t.windNorth;

    return t.na;
  };

  // -----------------------------------------
  // DETECTAR CAMBIO DE RONDA
  // -----------------------------------------
  useEffect(() => {
    if (!game) {
      return;
    }

    if (
      game.round >= 2 &&
      game.round <= maxRounds &&
      game.hand !== maxHands &&
      !game.finished
    ) {
      const previousRound = sessionStorage.getItem(
        "mahjong-last-round"
      );

      if (previousRound !== String(game.round)) {
        setWindChangeRound(game.round);
        setShowWindChange(true);

        sessionStorage.setItem(
          "mahjong-last-round",
          String(game.round)
        );
      }
    } else if (game.round === 1) {
      sessionStorage.setItem(
        "mahjong-last-round",
        "1"
      );
    }
  }, [
    game?.round,
    game?.hand,
    game?.finished,
    maxHands,
    maxRounds
  ]);

  // -----------------------------------------
  // DESHACER ULTIMA MANO
  // -----------------------------------------
  function handleUndo() {
    if (game.history.length === 0) {
      alert(t.noHandsToUndo);
      return;
    }

    setShowUndoPopup(true);
  }

  // -----------------------------------------
  // CONFIRMAR DESHACER
  // -----------------------------------------
  function handleConfirmUndo() {
    const updatedGame = undoLastHand(game);

    updateGame(updatedGame);

    sessionStorage.setItem(
      "mahjong-last-round",
      String(updatedGame.round)
    );

    setShowUndoPopup(false);
    setShowWindChange(false);
  }

  // -----------------------------------------
  // CANCELAR DESHACER
  // -----------------------------------------
  function handleCancelUndo() {
    setShowUndoPopup(false);
  }

  // -----------------------------------------
  // GUARDAR Y SALIR
  // -----------------------------------------
  function handleSaveAndExit() {
    setShowSavePopup(true);
  }

  // -----------------------------------------
  // CONFIRMAR GUARDAR Y SALIR
  // -----------------------------------------
  function handleConfirmSaveAndExit() {
    setShowSavePopup(false);

    if (game.finished) {
      if (onFinish) {
        onFinish();
      }

      return;
    }

    if (onHome) {
      onHome();
    }
  }

  // -----------------------------------------
  // CANCELAR GUARDAR Y SALIR
  // -----------------------------------------
  function handleCancelSaveAndExit() {
    setShowSavePopup(false);
  }

  // -----------------------------------------
  // TERMINAR PARTIDA
  // -----------------------------------------
  function handleFinishGame() {
    if (game.finished || showWindChange) {
      return;
    }

    setShowFinishPopup(true);
  }

  // -----------------------------------------
  // CONFIRMAR TERMINAR PARTIDA
  // -----------------------------------------
  function handleConfirmFinishGame() {
    setShowFinishPopup(false);

    if (onFinish) {
      onFinish();
    }
  }

  // -----------------------------------------
  // CANCELAR TERMINAR PARTIDA
  // -----------------------------------------
  function handleCancelFinishGame() {
    setShowFinishPopup(false);
  }

  // -----------------------------------------
  // CERRAR POPUP CAMBIO DE VIENTO
  // -----------------------------------------
  function handleContinueAfterWindChange() {
    setShowWindChange(false);
    setWindChangeRound(null);
  }

  // -----------------------------------------
  // SI NO HAY PARTIDA
  // -----------------------------------------
  if (!game) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "16px",
        boxSizing: "border-box"
      }}
    >
      {/* ---------------------------------- */}
      {/* CABECERA */}
      {/* ---------------------------------- */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "18px"
        }}
      >
        <h1
          style={{
            margin: "0 0 5px 0",
            fontSize: "27px"
          }}
        >
          🀄 Mahjong Madrid
        </h1>

        <div
          style={{
            fontSize: "19px",
            fontWeight: "bold"
          }}
        >
          {t.round} {game.round} · {t.hand}{" "}
          {game.hand}/{maxHands}
        </div>

        {game.finished && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              borderRadius: "10px",
              background: "#eee",
              fontSize: "17px",
              fontWeight: "bold"
            }}
          >
            🏁 {t.gameFinished}
          </div>
        )}
      </div>

      {/* ---------------------------------- */}
      {/* GUARDAR Y SALIR */}
      {/* ---------------------------------- */}

      <button
        onClick={handleSaveAndExit}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          background: "transparent",
          color: "inherit",
          border: "1px solid currentColor",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        💾 {t.saveAndExit}
      </button>

      {/* ---------------------------------- */}
      {/* TERMINAR PARTIDA */}
      {/* ---------------------------------- */}

      <button
        onClick={handleFinishGame}
        disabled={game.finished || showWindChange}
        style={{
          width: "100%",
          padding: "13px",
          marginBottom: "16px",
          fontSize: "17px",
          fontWeight: "bold",
          background:
            game.finished || showWindChange
              ? "#cccccc"
              : "#0f3d2e",
          color:
            game.finished || showWindChange
              ? "#777"
              : "#ffffff",
          border: "none",
          borderRadius: "10px",
          cursor:
            game.finished || showWindChange
              ? "not-allowed"
              : "pointer",
          boxShadow:
            game.finished || showWindChange
              ? "none"
              : "0 2px 6px rgba(0,0,0,.25)"
        }}
      >
        🏁 {t.finishGame}
      </button>

      {/* ---------------------------------- */}
      {/* CLASIFICACIÓN */}
      {/* ---------------------------------- */}

      <Ranking
        players={game.players}
        t={t}
      />

      {/* ---------------------------------- */}
      {/* REGISTRAR MANO */}
      {/* ---------------------------------- */}

      <button
        onClick={() => {
          if (
            !game.finished &&
            !showWindChange
          ) {
            setShowModal(true);
          }
        }}
        disabled={
          game.finished ||
          showWindChange
        }
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "12px",
          marginBottom: "10px",
          fontSize: "20px",
          fontWeight: "bold",
          background:
            game.finished ||
            showWindChange
              ? "#cccccc"
              : "#D4AF37",
          color:
            game.finished ||
            showWindChange
              ? "#777"
              : "#222",
          border: "none",
          borderRadius: "12px",
          cursor:
            game.finished ||
            showWindChange
              ? "not-allowed"
              : "pointer",
          boxShadow:
            game.finished ||
            showWindChange
              ? "none"
              : "0 2px 6px rgba(0,0,0,.25)"
        }}
      >
        {game.finished
          ? `🏁 ${t.gameFinished}`
          : `➕ ${t.registerHand}`}
      </button>

      {/* ---------------------------------- */}
      {/* DESHACER */}
      {/* ---------------------------------- */}

      <button
        onClick={handleUndo}
        disabled={
          game.history.length === 0 ||
          showWindChange ||
          game.finished
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          fontSize: "16px",
          fontWeight: "bold",
          background:
            game.history.length === 0 ||
            showWindChange ||
            game.finished
              ? "#cccccc"
              : "#d9534f",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor:
            game.history.length === 0 ||
            showWindChange ||
            game.finished
              ? "not-allowed"
              : "pointer"
        }}
      >
        ↩️ {t.undoHand}
      </button>

      {/* ---------------------------------- */}
      {/* JUGADORES */}
      {/* ---------------------------------- */}

      <h3
        style={{
          margin: "0 0 10px 0",
          fontSize: "18px"
        }}
      >
        {t.players}
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        {game.players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            t={t}
          />
        ))}
      </div>

      {/* ---------------------------------- */}
      {/* HISTORIAL DE MANOS */}
      {/* ---------------------------------- */}

      <div
        style={{
          marginTop: "20px"
        }}
      >
        <History
          history={game.history}
          players={game.players}
          t={t}
        />
      </div>

      {/* ---------------------------------- */}
      {/* MODAL REGISTRAR MANO */}
      {/* ---------------------------------- */}

      {!game.finished && (
        <RegisterHandModal
          open={showModal}
          game={game}
          updateGame={updateGame}
          onClose={() =>
            setShowModal(false)
          }
          t={t}
        />
      )}

      {/* ---------------------------------- */}
      {/* POPUP GUARDAR Y SALIR */}
      {/* ---------------------------------- */}

      {showSavePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
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
              padding: "24px",
              boxSizing: "border-box",
              boxShadow:
                "0 8px 30px rgba(0,0,0,0.35)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                fontSize: "38px",
                marginBottom: "8px"
              }}
            >
              💾
            </div>

            <h2
              style={{
                margin: "0 0 15px 0",
                fontSize: "25px"
              }}
            >
              {t.saveAndExit}
            </h2>

            <div
              style={{
                fontSize: "17px",
                lineHeight: "1.5",
                marginBottom: "24px"
              }}
            >
              {game.finished
                ? t.gameFinishedMessage
                : t.gameSavedMessage}
            </div>

            <button
              onClick={
                handleConfirmSaveAndExit
              }
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "10px",
                background: "#D4AF37",
                color: "#222",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "10px",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,.20)"
              }}
            >
              💾 {t.saveAndExit}
            </button>

            <button
              onClick={
                handleCancelSaveAndExit
              }
              style={{
                width: "100%",
                padding: "13px",
                border:
                  "1px solid #cccccc",
                borderRadius: "10px",
                background: "#f5f5f5",
                color: "#444",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------- */}
      {/* POPUP DESHACER ÚLTIMA MANO */}
      {/* ---------------------------------- */}

      {showUndoPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
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
              padding: "24px",
              boxSizing: "border-box",
              boxShadow:
                "0 8px 30px rgba(0,0,0,0.35)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                fontSize: "38px",
                marginBottom: "8px"
              }}
            >
              ↩️
            </div>

            <h2
              style={{
                margin: "0 0 15px 0",
                fontSize: "25px"
              }}
            >
              {t.undoConfirmation}
            </h2>

            <div
              style={{
                fontSize: "17px",
                lineHeight: "1.5",
                marginBottom: "24px"
              }}
            >
              {t.undoMessage}
            </div>

            <button
              onClick={
                handleConfirmUndo
              }
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "10px",
                background: "#d9534f",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "10px",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,.20)"
              }}
            >
              ↩️ {t.undoHand}
            </button>

            <button
              onClick={
                handleCancelUndo
              }
              style={{
                width: "100%",
                padding: "13px",
                border:
                  "1px solid #cccccc",
                borderRadius: "10px",
                background: "#f5f5f5",
                color: "#444",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------- */}
      {/* POPUP TERMINAR PARTIDA */}
      {/* ---------------------------------- */}

      {showFinishPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
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
              padding: "24px",
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
              🏁
            </div>

            <h2
              style={{
                margin: "0 0 15px 0",
                fontSize: "25px"
              }}
            >
              {t.finishGameQuestion}
            </h2>

            <div
              style={{
                fontSize: "17px",
                lineHeight: "1.5",
                marginBottom: "24px"
              }}
            >
              {t.finishGameMessage}
            </div>

            <button
              onClick={
                handleConfirmFinishGame
              }
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "10px",
                background: "#0f3d2e",
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "10px",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,.20)"
              }}
            >
              🏁 {t.finishGame}
            </button>

            <button
              onClick={
                handleCancelFinishGame
              }
              style={{
                width: "100%",
                padding: "13px",
                border:
                  "1px solid #cccccc",
                borderRadius: "10px",
                background: "#f5f5f5",
                color: "#444",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------- */}
      {/* POPUP CAMBIO DE VIENTO */}
      {/* ---------------------------------- */}

      {showWindChange &&
        windChangeRound && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
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
                padding: "24px",
                boxSizing: "border-box",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.35)",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  marginBottom: "8px"
                }}
              >
                🌬️
              </div>

              <h2
                style={{
                  margin: "0 0 15px 0",
                  fontSize: "25px"
                }}
              >
                {t.windChange}
              </h2>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "20px"
                }}
              >
                {t.roundChange}{" "}
                {windChangeRound}{" "}
                {getWindName(
                  roundWind[windChangeRound]
                )}
              </div>

              <div
                style={{
                  textAlign: "left",
                  marginBottom: "20px"
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "8px"
                  }}
                >
                  {t.newPositions}
                </div>

                {game.players.map(
                  (player) => (
                    <div
                      key={player.id}
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        padding:
                          "9px 4px",
                        borderBottom:
                          "1px solid #eeeeee"
                      }}
                    >
                      <strong>
                        {player.name}
                      </strong>

                      <span
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "6px",
                          fontWeight:
                            "bold"
                        }}
                      >
                        {player.wind ===
                        "N/A" ? (
                          <>
                            <span
                              style={{
                                fontSize:
                                  "20px"
                              }}
                            >
                              😴
                            </span>

                            {t.inactivePlayer}
                          </>
                        ) : (
                          <>
                            <span
                              style={{
                                fontSize:
                                  "27px",
                                lineHeight: 1
                              }}
                            >
                              {
                                windTile[
                                  player.wind
                                ]
                              }
                            </span>

                            {
                              getWindName(
                                player.wind
                              )
                            }
                          </>
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>

              <button
                onClick={
                  handleContinueAfterWindChange
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#D4AF37",
                  color: "#222",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {t.continueButton}
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

export default GamePage;
