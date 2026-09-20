import { useState } from "react";

function NewGamePage({
  onStartGame,
  onBack,
  t
}) {
  // =========================================================
  // CONFIGURACIÓN INICIAL
  // =========================================================

  // Por defecto: Mahjong normal con 4 jugadores
  const [playerCount, setPlayerCount] = useState(4);

  // Modo de juego:
  // "mahjong" = Mahjong normal
  // "riichi" = Riichi
  const [gameMode, setGameMode] = useState("mahjong");

  // Guardamos siempre espacio para 5 jugadores.
  // Así, si pasamos de 5 a 4 y luego volvemos a 5,
  // no perdemos el nombre del quinto jugador.
  const [players, setPlayers] = useState([
    "",
    "",
    "",
    "",
    ""
  ]);

  const [showEmptyNamesPopup, setShowEmptyNamesPopup] =
    useState(false);

  // =========================================================
  // CAMBIAR A 4 JUGADORES
  // =========================================================

  const handleFourPlayers = () => {
    setPlayerCount(4);
    setGameMode("mahjong");
  };

  // =========================================================
  // CAMBIAR A 5 JUGADORES
  // =========================================================

  const handleFivePlayers = () => {
    setPlayerCount(5);
    setGameMode("mahjong");
  };

  // =========================================================
  // CAMBIAR A RIICHI
  // =========================================================

  const handleRiichi = () => {
    // Riichi siempre utiliza 4 jugadores
    setPlayerCount(4);
    setGameMode("riichi");
  };

  // =========================================================
  // CAMBIAR NOMBRE DE JUGADOR
  // =========================================================

  const handleChange = (index, value) => {
    const newPlayers = [...players];

    newPlayers[index] = value;

    setPlayers(newPlayers);
  };

  // =========================================================
  // COMENZAR PARTIDA
  // =========================================================

  const startGame = () => {
    const requiredPlayers = players.slice(
      0,
      playerCount
    );

    const empty = requiredPlayers.some(
      (player) => player.trim() === ""
    );

    if (
      requiredPlayers.length !== playerCount ||
      empty
    ) {
      setShowEmptyNamesPopup(true);
      return;
    }

    // -------------------------------------------------------
    // RIICHI
    // -------------------------------------------------------

    if (gameMode === "riichi") {
      onStartGame(requiredPlayers, "riichi");
      return;
    }

    // -------------------------------------------------------
    // MAHJONG NORMAL
    // -------------------------------------------------------

    onStartGame(requiredPlayers);
  };

  // =========================================================
  // ESTILO DE LOS BOTONES
  // =========================================================

  const getButtonStyle = (active) => ({
    flex: 1,
    padding: "14px 8px",
    fontSize: "17px",
    fontWeight: "bold",

    border: active
      ? "3px solid #D4AF37"
      : "1px solid #ccc",

    borderRadius: "10px",

    background: active
      ? "#f5e6b3"
      : "#fff",

    color: "#222",

    cursor: "pointer",

    boxSizing: "border-box",

    minWidth: 0
  });

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "30px 20px"
      }}
    >

      {/* ---------------------------------- */}
      {/* VOLVER */}
      {/* ---------------------------------- */}

      <button
        onClick={onBack}
        style={{
          padding: "10px 16px",
          marginBottom: "20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        ← {t.back}
      </button>

      {/* ---------------------------------- */}
      {/* TITULO */}
      {/* ---------------------------------- */}

      <h1
        style={{
          textAlign: "center"
        }}
      >
        🀄 {t.newGameTitle}
      </h1>

      {/* ---------------------------------- */}
      {/* NUMERO DE JUGADORES */}
      {/* ---------------------------------- */}

      <p
        style={{
          textAlign: "center",
          opacity: 0.8,
          marginBottom: "20px"
        }}
      >
        {t.numberOfPlayers}
      </p>

      {/* ---------------------------------- */}
      {/* BOTONES 4 / 5 / RIICHI */}
      {/* ---------------------------------- */}

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "25px",
          width: "100%"
        }}
      >

        {/* ================================ */}
        {/* 4 JUGADORES */}
        {/* ================================ */}

        <button
          onClick={handleFourPlayers}
          style={getButtonStyle(
            gameMode === "mahjong" &&
            playerCount === 4
          )}
        >
          {t.fourPlayers}
        </button>

        {/* ================================ */}
        {/* 5 JUGADORES */}
        {/* ================================ */}

        <button
          onClick={handleFivePlayers}
          style={getButtonStyle(
            gameMode === "mahjong" &&
            playerCount === 5
          )}
        >
          {t.fivePlayers}
        </button>

        {/* ================================ */}
        {/* RIICHI */}
        {/* ================================ */}

        <button
          onClick={handleRiichi}
          style={getButtonStyle(
            gameMode === "riichi"
          )}
        >
          RIICHI
        </button>

      </div>

      {/* ---------------------------------- */}
      {/* INDICADOR DE RIICHI */}
      {/* ---------------------------------- */}

      {gameMode === "riichi" && (
        <p
          style={{
            textAlign: "center",
            marginTop: "-10px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#D4AF37"
          }}
        >
          Riichi · 4 jugadores
        </p>
      )}

      {/* ---------------------------------- */}
      {/* TEXTO ANTES DE LOS NOMBRES */}
      {/* ---------------------------------- */}

      <p
        style={{
          textAlign: "center",
          opacity: 0.8,
          marginBottom: "25px"
        }}
      >
        {t.enterPlayers}
      </p>

      {/* ---------------------------------- */}
      {/* NOMBRES DE LOS JUGADORES */}
      {/* ---------------------------------- */}

      {players
        .slice(0, playerCount)
        .map((player, index) => (
          <div
            key={index}
            style={{
              marginBottom: "12px"
            }}
          >
            <input
              type="text"
              placeholder={`${t.player} ${index + 1}`}
              value={player}
              onChange={(event) =>
                handleChange(
                  index,
                  event.target.value
                )
              }
              autoComplete="off"
              style={{
                boxSizing: "border-box",
                width: "100%",
                padding: "14px",
                fontSize: "18px",
                borderRadius: "10px",
                border: "1px solid #ccc"
              }}
            />
          </div>
        ))}

      {/* ---------------------------------- */}
      {/* COMENZAR PARTIDA */}
      {/* ---------------------------------- */}

      <button
        onClick={startGame}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "10px",
          fontSize: "20px",
          fontWeight: "bold",
          background: "#D4AF37",
          color: "#222",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        {t.startGame}
      </button>

      {/* ---------------------------------- */}
      {/* POPUP NOMBRES INCOMPLETOS */}
      {/* ---------------------------------- */}

      {showEmptyNamesPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
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
              ⚠️
            </div>

            {/* TITULO */}

            <h2
              style={{
                margin: "0 0 10px 0",
                fontSize: "24px"
              }}
            >
              {t.emptyPlayerNamesTitle ||
                "Faltan nombres"}
            </h2>

            {/* MENSAJE */}

            <p
              style={{
                margin: "0 0 25px 0",
                fontSize: "17px",
                lineHeight: "1.5"
              }}
            >
              {t.emptyPlayerNamesMessage
                ? t.emptyPlayerNamesMessage.replace(
                    "{count}",
                    playerCount
                  )
                : `Debes introducir los nombres de los ${playerCount} jugadores para comenzar la partida.`}
            </p>

            {/* ACEPTAR */}

            <button
              onClick={() =>
                setShowEmptyNamesPopup(false)
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
              {t.back || "Aceptar"}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default NewGamePage;
