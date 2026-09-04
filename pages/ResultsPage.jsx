function ResultsPage({
  game,
  onNewGame,
  onHistory,
  t
}) {

  // =====================================================
  // CLASIFICACIÓN FINAL
  // =====================================================

  // Todos los jugadores aparecen en la clasificación final.
  // El viento "N/A" solo indica que ese jugador descansaba
  // durante una ronda concreta. No significa que quede
  // fuera de la clasificación de la partida.
  const ranking = [...(game?.players || [])]
    .sort(
      (a, b) =>
        (Number(b?.points) || 0) -
        (Number(a?.points) || 0)
    );

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
          ← {t.backToHistory}
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
          🀄 {t.newGame}
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
        🏆 {t.gameFinished}
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

        {ranking.length > 0 ? (

          ranking.map((player, index) => {

            const points =
              Number(player?.points) || 0;

            return (
              <div
                key={
                  player?.id ??
                  `ranking-${index}`
                }
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom:
                    index !==
                    ranking.length - 1
                      ? "1px solid #ddd"
                      : "none"
                }}
              >

                <div>
                  {medal(index)}{" "}
                  <strong>
                    {player?.name || t.player}
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

          })

        ) : (

          <div
            style={{
              padding: "10px 0",
              textAlign: "center",
              color: "#777"
            }}
          >
            {t.noPlayerData}
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
          📋 {t.playedHands}
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
            {t.noHandsRegistered}
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
                    {t.hand} {hand.hand} | · 🤝{" "}
                    {t.draw}
                  </>
                )}

                {hand.type === "MURO" && (
                  <>
                    {t.hand} {hand.hand} | · 🀄{" "}
                    {getPlayerName(
                      hand.winnerId
                    )}{" "}
                    {t.wall} (
                    {hand.handPoints})
                  </>
                )}

                {hand.type === "DESCARTE" && (
                  <>
                    {t.hand} {hand.hand} | · 🀫{" "}
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
