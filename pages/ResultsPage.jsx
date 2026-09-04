function ResultsPage({
  game,
  onNewGame,
  onHistory
}) {

  // =====================================================
  // JUGADORES ACTIVOS
  // =====================================================

  const activePlayers = [...(game?.players || [])]
    .filter((player) => player?.wind !== "N/A")
    .sort(
      (a, b) => (b.points || 0) - (a.points || 0)
    );

  // Jugador N/A, si existe.
  // En partidas de 4 jugadores será null.
  const inactivePlayer =
    (game?.players || []).find(
      (player) => player?.wind === "N/A"
    ) || null;

  // =====================================================
  // MEDALLAS
  // =====================================================

  const medal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";

    return `${index + 1}º`;
  };

  // =====================================================
  // NOMBRE DE JUGADOR
  // =====================================================

  const getPlayerName = (id) => {
    const player = (game?.players || []).find(
      (player) => player.id === id
    );

    return player ? player.name : "";
  };

  // =====================================================
  // HISTORIAL DE MANOS
  // Última mano primero
  // =====================================================

  const orderedHistory = [
    ...(game?.history || [])
  ].reverse();

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
      {/* BOTONES SUPERIORES */}
      {/* ---------------------------------- */}

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "15px"
        }}
      >

        <button
          onClick={onHistory}
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px"
          }}
        >
          ← Volver al historial
        </button>

        <button
          onClick={onNewGame}
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "bold",
            background: "#D4AF37"
          }}
        >
          🀄 Nueva partida
        </button>

      </div>

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
          boxShadow:
            "0 4px 10px rgba(0,0,0,.25)"
        }}
      >

        {/* JUGADORES ACTIVOS */}

        {activePlayers.map((player, index) => {

          const points =
            Number(player?.points) || 0;

          return (
            <div
              key={player.id}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom:
                  "1px solid #ddd"
              }}
            >

              <div>
                {medal(index)}{" "}
                <strong>
                  {player.name}
                </strong>
              </div>

              <div
                style={{
                  fontWeight: "bold",
                  color:
                    points > 0
                      ? "#0a8f3d"
                      : points < 0
                      ? "#c62828"
                      : "#444"
                }}
              >
                {points > 0 ? "+" : ""}
                {points}
              </div>

            </div>
          );
        })}

        {/* ---------------------------------- */}
        {/* JUGADOR N/A */}
        {/* ---------------------------------- */}

        {inactivePlayer && (
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              padding: "12px 0",
              color: "#777"
            }}
          >

            <div>
              🚫{" "}
              <strong>
                {inactivePlayer.name}
              </strong>{" "}
              (N/A)
            </div>

            <div
              style={{
                fontWeight: "bold",
                color: "#777"
              }}
            >
              {Number(
                inactivePlayer.points
              ) || 0}
            </div>

          </div>
        )}

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
                    {getPlayerName(
                      hand.winnerId
                    )}{" "}
                    Muro ({hand.handPoints})
                  </>
                )}

                {hand.type === "DESCARTE" && (
                  <>
                    Mano {hand.hand} | · 🀫{" "}
                    {getPlayerName(
                      hand.winnerId
                    )} ←{" "}
                    {getPlayerName(
                      hand.loserId
                    )}{" "}
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

                  {hand.results.map((result) => {

                    const points =
                      Number(
                        result?.points
                      ) || 0;

                    return (
                      <div
                        key={result.id}
                      >
                        <strong>
                          {getPlayerName(
                            result.id
                          )}
                        </strong>{" "}

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
                          {points > 0
                            ? "+"
                            : ""}
                          {points}
                        </span>
                      </div>
                    );
                  })}

                </div>

              )}

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default ResultsPage;
