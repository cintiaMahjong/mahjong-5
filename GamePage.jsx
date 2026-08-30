import { useState } from "react";

import PlayerCard from "../components/PlayerCard";
import RegisterHandModal from "../components/RegisterHandModal";
import History from "../components/History";
import Ranking from "../components/Ranking";

import { undoLastHand } from "../services/gameService";

function GamePage({ game, updateGame, onHome }) {
  const [showModal, setShowModal] = useState(false);

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
          if (!game.finished) {
            setShowModal(true);
          }
        }}
        disabled={game.finished}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "12px",
          marginBottom: "10px",
          fontSize: "20px",
          fontWeight: "bold",
          background: game.finished
            ? "#cccccc"
            : "#D4AF37",
          color: game.finished
            ? "#777"
            : "#222",
          border: "none",
          borderRadius: "12px",
          cursor: game.finished
            ? "not-allowed"
            : "pointer",
          boxShadow: game.finished
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
        disabled={game.history.length === 0}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          fontSize: "16px",
          fontWeight: "bold",
          background:
            game.history.length === 0
              ? "#cccccc"
              : "#d9534f",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor:
            game.history.length === 0
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
    </div>
  );
}

export default GamePage;