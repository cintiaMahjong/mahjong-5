function History({ history, players }) {
  if (history.length === 0) {
    return (
      <div
        style={{
          marginTop: "25px",
          color: "#ddd",
          textAlign: "center"
        }}
      >
        Todavía no se ha registrado ninguna mano.
      </div>
    );
  }

  const getPlayerName = (id) => {
    const player = players.find(
      (p) => p.id === id
    );

    return player ? player.name : "";
  };

  // Última mano registrada primero
  const orderedHistory = [...history].reverse();

  return (
    <div style={{ marginTop: "25px" }}>
      <h2
        style={{
          color: "white",
          marginBottom: "15px"
        }}
      >
        Historial
      </h2>

      {orderedHistory.map((hand, index) => (
        <div
          key={index}
          style={{
            background: "#ffffff",
            borderRadius: "8px",
            padding: "10px 14px",
            marginBottom: "10px",
            boxShadow:
              "0 1px 4px rgba(0,0,0,0.15)",
            fontSize: "15px"
          }}
        >
          {/* Descripción de la mano */}
          <div
            style={{
              color: "#222",
              fontWeight: "bold",
              marginBottom: "8px"
            }}
          >
            {hand.type === "EMPATE" && (
              <>
                Mano {hand.hand} | 🤝 Empate
              </>
            )}

            {hand.type === "MURO" && (
              <>
                Mano {hand.hand} | 🀄{" "}
                {getPlayerName(hand.winnerId)} Muro (
                {hand.handPoints})
              </>
            )}

            {hand.type === "DESCARTE" && (
              <>
                Mano {hand.hand} | 🀫{" "}
                {getPlayerName(hand.winnerId)} ←{" "}
                {getPlayerName(hand.loserId)} (
                {hand.handPoints})
              </>
            )}
          </div>

          {/* Resultados de los 5 jugadores */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              color: "#333",
              fontSize: "14px"
            }}
          >
            {players.map((player) => {
              const result = hand.results?.find(
                (r) => r.id === player.id
              );

              const points = result
                ? result.points
                : 0;

              return (
                <div key={player.id}>
                  <strong>{player.name}</strong>{" "}
                  <span
                    style={{
                      color:
                        points > 0
                          ? "#0a8f3d"
                          : points < 0
                          ? "#d11a2a"
                          : "#555",
                      fontWeight: "bold"
                    }}
                  >
                    {points > 0 ? "+" : ""}
                    {points}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default History;
