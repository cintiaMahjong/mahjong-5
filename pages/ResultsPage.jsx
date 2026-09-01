function ResultsPage({ game, onNewGame, onHistory }) {
  const ranking = [...game.players].sort((a, b) => {
    // El jugador N/A siempre al final
    if (a.wind === "N/A") return 1;
    if (b.wind === "N/A") return -1;

    return b.points - a.points;
  });

  const medal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";

    return `${index + 1}º`;
  };

  const getPlayerName = (id) => {
    const player = game.players.find(
      (player) => player.id === id
    );

    return player ? player.name : "";
  };

  // Última mano primero
  const orderedHistory = [...(game.history || [])].reverse();

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "25px",
        boxSizing: "border-box"
      }}
    >
      {/* ---------------------------------- */}
      {/* BOTÓN VOLVER */}
      {/* ---------------------------------- */}

      <button
        onClick={onHistory}
        style={{
          marginBottom: "15px",
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "15px"
        }}
      >
        ← Volver al historial
      </button>

      {/* ---------------------------------- */}
      {/* TÍTULO */}
      {/* ---------------------------------- */}

      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px"
        }}
      >
        🏆 Partida Finalizada
      </h1>

      {/* ---------------------------------- */}
      {/* CLASIFICACIÓN */}
      {/* ---------------------------------- */}

      <div
        style={{
          background: "#fff",
          color: "#222",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,.25)"
        }}
      >
        {ranking.map((player, index) => (
          <div
            key={player.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom:
                index !== ranking.length - 1
                  ? "1px solid #ddd"
                  : "none"
            }}
          >
            <div>
              {player.wind === "N/A"
                ? "🚫"
                : medal(index)}{" "}

              <strong>{player.name}</strong>

              {player.wind === "N/A" && " (N/A)"}
            </div>

            <div
              style={{
                fontWeight: "bold",
                color:
                  player.points > 0
                    ? "#0a8f3d"
                    : player.points < 0
                    ? "#c62828"
                    : "#444"
              }}
            >
              {player.points > 0 ? "+" : ""}
              {player.points}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------------------------- */}
      {/* HISTORIAL DE MANOS */}
      {/* ---------------------------------- */}

      <div
        style={{
          marginTop: "30px"
        }}
      >
        <h2
          style={{
            color: "white",
            marginBottom: "15px"
          }}
        >
          📋 Manos jugadas
        </h2>

        {orderedHistory.length === 0 ? (
          <div
            style={{
              background: "#fff",
              color: "#222",
              borderRadius: "8px",
              padding: "15px",
              textAlign: "center"
            }}
          >
            No hay manos registradas.
          </div>
        ) : (
          orderedHistory.map((hand, index) => (
            <div
              key={`${hand.hand}-${index}`}
              style={{
                background: "#ffffff",
                color: "#222",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "10px",
                boxShadow:
                  "0 1px 4px rgba(0,0,0,0.15)",
                fontSize: "15px"
              }}
            >
              {/* -------------------------------- */}
              {/* DESCRIPCIÓN DE LA MANO */}
              {/* -------------------------------- */}

              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px"
                }}
              >
                {hand.type === "EMPATE" && (
                  <>
                    Mano {hand.hand} | · 🤝 Empate
                  </>
                )}

                {hand.type === "MURO" && (
                  <>
                    Mano {hand.hand} | · 🀄{" "}
                    {getPlayerName(hand.winnerId)}{" "}
                    Muro ({hand.handPoints})
                  </>
                )}

                {hand.type === "DESCARTE" && (
                  <>
                    Mano {hand.hand} | · 🀫{" "}
                    {getPlayerName(hand.winnerId)} ←{" "}
                    {getPlayerName(hand.loserId)}{" "}
                    ({hand.handPoints})
                  </>
                )}
              </div>

              {/* -------------------------------- */}
              {/* RESULTADO DE PUNTOS */}
              {/* -------------------------------- */}

              {hand.results && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    color: "#333",
                    fontSize: "14px"
                  }}
                >
                  {hand.results.map((result) => (
                    <div key={result.id}>
                      <strong>
                        {getPlayerName(result.id)}
                      </strong>{" "}

                      <span
                        style={{
                          color:
                            result.points > 0
                              ? "#0a8f3d"
                              : result.points < 0
                              ? "#d11a2a"
                              : "#555",
                          fontWeight: "bold"
                        }}
                      >
                        {result.points > 0
                          ? "+"
                          : ""}
                        {result.points}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ---------------------------------- */}
      {/* NUEVA PARTIDA */}
      {/* ---------------------------------- */}

      <button
        onClick={onNewGame}
        style={{
          width: "100%",
          marginTop: "25px",
          padding: "18px",
          fontSize: "22px",
          fontWeight: "bold",
          background: "#D4AF37",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        🀄 NUEVA PARTIDA
      </button>
    </div>
  );
}

export default ResultsPage;
