import React from "react";
function HomePage({
  hasActiveGame,
  onNewGame,
  onContinueGame,
  onHistory
}) {

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "40px 20px",
        textAlign: "center"
      }}
    >

      <div
        style={{
          fontSize: "60px",
          marginBottom: "10px"
        }}
      >
        🀄
      </div>


      <h1>
        Mahjong Madrid
      </h1>


      <p
        style={{
          marginBottom: "35px",
          opacity: 0.8
        }}
      >
        Gestor de partidas · 5 jugadores
      </p>


      {hasActiveGame && (

        <button
          onClick={onContinueGame}
          style={{
            width: "100%",
            padding: "17px",
            marginBottom: "12px",
            fontSize: "19px",
            fontWeight: "bold",
            background: "#D4AF37",
            color: "#222",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer"
          }}
        >
          ▶️ Continuar partida
        </button>

      )}


      <button
        onClick={onNewGame}
        style={{
          width: "100%",
          padding: "17px",
          marginBottom: "12px",
          fontSize: "19px",
          fontWeight: "bold",
          background: hasActiveGame
            ? "#ffffff"
            : "#D4AF37",
          color: "#222",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        ➕ Nueva partida
      </button>


      <button
        onClick={onHistory}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "18px",
          fontWeight: "bold",
          background: "transparent",
          color: "white",
          border: "2px solid rgba(255,255,255,.5)",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        📚 Historial de partidas
      </button>

    </div>
  );
}

export default HomePage;
