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
        padding: "20px",
        textAlign: "center"
      }}
    >
      <h1>Mahjong</h1>

      <p>
        Gestiona tus partidas de Mahjong de forma sencilla.
      </p>

      <button
        onClick={onNewGame}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Nueva partida
      </button>

      {hasActiveGame && (
        <button
          onClick={onContinueGame}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Continuar partida
        </button>
      )}

      <button
        onClick={onHistory}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "10px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Historial
      </button>

      {/* Copyright */}
      <footer
        style={{
          marginTop: "50px",
          paddingTop: "15px",
          borderTop: "1px solid #ddd",
          fontSize: "12px",
          color: "#888"
        }}
      >
        © 2026 Cintia Horcajo · Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default HomePage;
