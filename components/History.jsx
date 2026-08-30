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
          <div
            style={{
              color: "#222",
              fontWeight: "bold",
              marginBottom: "8px"
            }}
          >
            {hand.type === "EMPATE" && (
              <>
                R{hand.hand} | 🤝 Empate
              </>
            )}

            {hand.type === "MURO" && (
              <>
                R{hand.hand} | 🀄{" "}
                {getPlayerName(hand.winnerId)} Muro (
                {hand.handPoints})
              </>
            )}

            {hand.type === "DESCARTE" && (
              <>
                R{hand.hand} | 🀫{" "}
                {getPlayerName(hand.winnerId)} ←{" "}
                {getPlayerName(hand.loserId)} (
                {hand.handPoints})
              </>
            )}
          </div>

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
                    {result.points > 0 ? "+" : ""}
                    {result.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default History;