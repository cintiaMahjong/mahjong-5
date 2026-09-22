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

  const ranking = [...(game?.players || [])].sort(
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

    if (index === 3) return "4️⃣";
    if (index === 4) return "5️⃣";

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
  // =====================================================
  // Última mano primero

  const orderedHistory = [
    ...(game?.history || [])
  ].reverse();

  // =====================================================
  // ENVIAR CLASIFICACIÓN POR WHATSAPP
  // =====================================================

  const sendRankingToWhatsApp = () => {
    if (!ranking.length) return;

    // Construimos únicamente el listado de clasificación
    const rankingText = ranking
      .map((player, index) => {
        const points =
          Number(player?.points) || 0;

        let position;

        if (index === 0) {
          position = "🥇";
        } else if (index === 1) {
          position = "🥈";
        } else if (index === 2) {
          position = "🥉";
        } else if (index === 3) {
          position = "4️⃣";
        } else if (index === 4) {
          position = "5️⃣";
        } else {
          position = `${index + 1}º`;
        }

        return `${position} ${
          player?.name || t.player
        } · ${points} puntos`;
      })
      .join("\n");

    // Mensaje que se enviará a WhatsApp
    const message = `🏆 ${
      t.finalRanking || "CLASIFICACIÓN FINAL"
    }

${rankingText}`;

    // Codificamos el mensaje para WhatsApp
    const encodedMessage =
      encodeURIComponent(message);

    // WhatsApp permite elegir el contacto o grupo
    const whatsappUrl =
      `https://wa.me/?text=${encodedMessage}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

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

        {/* ---------------------------------- */}
        {/* BOTÓN WHATSAPP */}
        {/* ---------------------------------- */}

        {ranking.length > 0 && (
          <button
                  onClick={() =>
                    sendRankingToWhatsApp(game)
                  }
                  style={{
                    width: "46px",
                    height: "46px",
                    padding: "0",
                    border: "none",
                    borderRadius: "50%",
                    background: "#25D366",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "0 2px 5px rgba(0,0,0,.2)"
                  }}
                  aria-label={
                    t.whatsappShare ||
                    "Enviar clasificación por WhatsApp"
                  }
                  title={
                    t.whatsappShare ||
                    "Enviar clasificación por WhatsApp"
                  }
                >
                  {/* LOGO WHATSAPP */}

                  <svg
                    width="27"
                    height="27"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      fill="white"
                      d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.45 1.75 6.35L3 29l6.85-1.74A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Z"
                    />

                    <path
                      fill="#25D366"
                      d="M16 5.5A10.5 10.5 0 0 0 6.9 21.25l.3.48-1.03 3.8 3.9-1 .46.27A10.5 10.5 0 1 0 16 5.5Zm5.85 14.95c-.25.7-1.45 1.3-2 1.38-.5.08-1.14.12-1.84-.1-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.1-4.95-4.3-.15-.2-1.18-1.57-1.18-3s.74-2.13 1-2.42c.25-.3.55-.37.73-.37h.53c.17 0 .4-.07.62.47l.84 2.02c.07.17.1.3.02.48-.08.18-.12.3.02.48-.08.18-.12.3-.23.46-.12.15-.24.33-.35.44-.12.12-.24.25-.1.5.14.25.62 1.02 1.33 1.65.92.82 1.7 1.08 1.95 1.2.25.12.4.1.55-.07.15-.17.63-.73.8-.98.17-.25.34-.2.58-.12.25.08 1.57.74 1.84.88.27.13.45.2.52.3.07.1.07.6-.18 1.28Z"
                    />
                  </svg>
                </button>
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
                            fontWeight:
                              "bold"
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
