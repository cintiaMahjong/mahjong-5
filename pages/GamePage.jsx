import { useEffect, useState } from "react";

import PlayerCard from "../components/PlayerCard";
import RegisterHandModal from "../components/RegisterHandModal";
import History from "../components/History";
import Ranking from "../components/Ranking";

import { undoLastHand } from "../services/gameService";

function GamePage({ game, updateGame, onHome }) {
  const [showModal, setShowModal] = useState(false);

  // -----------------------------------------
  // POPUP CAMBIO DE VIENTO
  // -----------------------------------------

  const [showWindChange, setShowWindChange] = useState(false);
  const [windChangeRound, setWindChangeRound] = useState(null);

  // Viento correspondiente a cada ronda
  const roundWind = {
    2: "SUR",
    3: "OESTE",
    4: "NORTE",
    5: "ESTE"
  };

  // Detectar cuando comienza una nueva ronda
  useEffect(() => {
    if (!game) {
      return;
    }

    // Solo mostrar el aviso al comenzar
    // las rondas 2, 3, 4 y 5
    if (
      game.round >= 2 &&
      game.round <= 5 &&
      game.hand !== 20
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
  }, [game.round, game.hand]);

  // -----------------------------------------
  // DESHACER ÚLTIMA MANO
  // -----------------------------------------

  function handleUndo() {
    if (game.history.length === 0) {
      alert("No hay ninguna mano para deshacer.");
      return;
    }

    const confirmUndo = window.confirm(
      "¿Seguro que quieres deshacer la última mano?"
    );

    if (!confirmUndo) {
      return;
    }

    const updatedGame = undoLastHand(game);

    updateGame(updatedGame);

    sessionStorage.setItem(
      "mahjong-last-round",
      String(updatedGame.round)
    );

    setShowWindChange(false);
  }

  // -----------------------------------------
  // GUARDAR Y SALIR
  // -----------------------------------------

  function handleSaveAndExit() {
    const confirmExit = window.confirm(
      "La partida se guardará y podrás continuarla más tarde.\n\n¿Quieres salir de la partida?"
    );

    if (!confirmExit) {
      return;
    }

    if (onHome) {
      onHome();
    }
  }

  // -----------------------------------------
  // CERRAR POPUP
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
          Ronda {game.round} · Mano {game.hand}/20
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
            🏁 PARTIDA TERMINADA
          </div>
        )}
      </div>

      {/* ---------------------------------- */}
      {/* BOTÓN GUARDAR Y SALIR */}
      {/* ---------------------------------- */}

      <button
        onClick={handleSaveAndExit}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "16px",
          fontSize: "16px",
          fontWeight: "bold",
          background: "transparent",
          color: "inherit",
          border: "1px solid currentColor",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        💾 Guardar y salir
      </button>

      {/* ---------------------------------- */}
      {/* CLASIFICACIÓN */}
      {/* ---------------------------------- */}

      <Ranking players={game.players} />

      {/* ---------------------------------- */}
      {/* REGISTRAR MANO */}
      {/* ---------------------------------- */}

      <button
        onClick={() => {
          if (!game.finished && !showWindChange) {
            setShowModal(true);
          }
        }}
        disabled={game.finished || showWindChange}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "12px",
          marginBottom: "10px",
          fontSize: "20px",
          fontWeight: "bold",
          background:
            game.finished || showWindChange
              ? "#cccccc"
              : "#D4AF37",
          color:
            game.finished || showWindChange
              ? "#777"
              : "#222",
          border: "none",
          borderRadius: "12px",
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
        {game.finished
          ? "🏁 Partida terminada"
          : "➕ Registrar mano"}
      </button>

      {/* ---------------------------------- */}
      {/* DESHACER */}
      {/* ---------------------------------- */}

      <button
        onClick={handleUndo}
        disabled={
          game.history.length === 0 ||
          showWindChange
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          fontSize: "16px",
          fontWeight: "bold",
          background:
            game.history.length === 0 ||
            showWindChange
              ? "#cccccc"
              : "#d9534f",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor:
            game.history.length === 0 ||
            showWindChange
              ? "not-allowed"
              : "pointer"
        }}
      >
        ↩️ Deshacer última mano
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
        Jugadores
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
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ---------------------------------- */}
      {/* POPUP CAMBIO DE VIENTO */}
      {/* ---------------------------------- */}

      {showWindChange && windChangeRound && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.70)",
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
            {/* TÍTULO */}

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
              ¡CAMBIAD DE VIENTO!
            </h2>

            {/* INFORMACIÓN DE LA RONDA */}

            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "20px"
              }}
            >
              La ronda {windChangeRound} es el viento{" "}
              {roundWind[windChangeRound]}
            </div>

            {/* NUEVAS POSICIONES */}

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
                Nuevas posiciones:
              </div>

              {game.players.map((player) => (
                <div
                  key={player.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "9px 4px",
                    borderBottom:
                      "1px solid #eeeeee"
                  }}
                >
                  <strong>
                    {player.name}
                  </strong>

                  <span
                    style={{
                      fontWeight: "bold"
                    }}
                  >
                    {player.wind === "N/A"
                      ? "DESCANSA"
                      : player.wind}
                  </span>
                </div>
              ))}
            </div>

            {/* CONTINUAR */}

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
              CONTINUAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;
