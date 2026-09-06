function HistoryPage({
  history,
  onBack,
  onViewGame,
  onDeleteGame,
  t
}) {
  function formatDate(date) {
    if (!date) {
      return "";
    }

    try {
      return new Date(date).toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short"
      });
    } catch {
      return "";
    }
  }

  function getRanking(game) {
    if (!game || !Array.isArray(game.players)) {
      return [];
    }

    // TODOS los jugadores participan en la clasificación final.
    // El viento "N/A" solo significa que ese jugador estaba
    // descansando en una determinada ronda, no que quede
    // fuera de la clasificación final.
    return [...game.players].sort(
      (a, b) =>
        (Number(b?.points) || 0) -
        (Number(a?.points) || 0)
    );
  }

  // =====================================================
  // ENVIAR CLASIFICACIÓN DE UNA PARTIDA POR WHATSAPP
  // =====================================================
  function sendRankingToWhatsApp(game) {
    const ranking = getRanking(game);

    if (!ranking.length) {
      return;
    }

    const rankingText = ranking
      .map((player, index) => {
        const points = Number(player?.points) || 0;

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

    const message = `🏆 ${
      t.finalRanking || "CLASIFICACIÓN FINAL"
    }

${rankingText}`;

    const encodedMessage =
      encodeURIComponent(message);

    const whatsappUrl =
      `https://wa.me/?text=${encodedMessage}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const safeHistory = Array.isArray(history)
    ? history
    : [];

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      {/* =====================================================
          BOTONES SUPERIORES
      ===================================================== */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px"
        }}
      >
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#D4AF37",
            color: "#0f3d2e",
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.15)",
            fontWeight: "bold",
            fontSize: "15px"
          }}
        >
          ← {t.back}
        </button>
      </div>

      {/* =====================================================
          TÍTULO
      ===================================================== */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px"
        }}
      >
        📚 {t.historyTitle}
      </h1>

      {/* =====================================================
          SIN PARTIDAS
      ===================================================== */}
      {safeHistory.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px"
          }}
        >
          <div
            style={{
              fontSize: "50px",
              marginBottom: "15px"
            }}
          >
            🀄
          </div>

          <p>{t.noFinishedGames}</p>
        </div>
      ) : (
        safeHistory.map((game, gameIndex) => {
          if (!game) {
            return null;
          }

          const ranking = getRanking(game);

          const gameId =
            game.id ||
            game.createdAt ||
            `history-${gameIndex}`;

          return (
            <div
              key={gameId}
              style={{
                background: "white",
                color: "#222",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "15px",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,.2)"
              }}
            >
              {/* =================================================
                  CABECERA
              ================================================= */}
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "5px"
                }}
              >
                🀄 {t.game}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "12px"
                }}
              >
                {formatDate(
                  game.finishedAt ||
                    game.createdAt
                )}
              </div>

              {/* =================================================
                  NOMBRES
              ================================================= */}
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "12px"
                }}
              >
                {Array.isArray(game.players)
                  ? game.players
                      .map(
                        (player) =>
                          player?.name ||
                          t.player
                      )
                      .join(" · ")
                  : t.playersUnavailable}
              </div>

              {/* =================================================
                  CLASIFICACIÓN FINAL
              ================================================= */}
              {ranking.length > 0 ? (
                ranking.map((player, index) => {
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

                  return (
                    <div
                      key={
                        player?.id ??
                        `${gameId}-${index}`
                      }
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        padding: "6px 0",
                        borderBottom:
                          index !==
                          ranking.length - 1
                            ? "1px solid #eee"
                            : "none"
                      }}
                    >
                      <span>
                        {position}{" "}
                        {player?.name ||
                          t.player}
                      </span>

                      <strong
                        style={{
                          color:
                            points > 0
                              ? "#087f3e"
                              : points < 0
                              ? "#c62828"
                              : "#444"
                        }}
                      >
                        {points > 0 ? "+" : ""}
                        {points}
                      </strong>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: "10px 0",
                    color: "#777",
                    fontSize: "14px"
                  }}
                >
                  {t.noPlayerData}
                </div>
              )}

              {/* =================================================
                  BOTONES
              ================================================= */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "15px"
                }}
              >
                {/* VER PARTIDA */}
                <button
                  onClick={() =>
                    onViewGame(game)
                  }
                  style={{
                    flex: 1,
                    padding: "11px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#D4AF37",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  {t.viewGame}
                </button>

                {/* WHATSAPP */}
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
                        d="M16 5.5A10.5 10.5 0 0 0 6.9 21.25l.3.48-1.03 3.8 3.9-1 .46.27A10.5 10.5 0 1 0 16 5.5Zm5.85 14.95c-.25.7-1.45 1.3-2 1.38-.5.08-1.14.12-1.84-.1-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.1-4.95-4.3-.15-.2-1.18-1.57-1.18-3s.74-2.13 1-2.42c.25-.3.55-.37.73-.37h.53c.17 0 .4-.07.62.47l.84 2.02c.07.17.1.3.02.48-.08.18-.12.3-.23.46-.12.15-.24.33-.35.44-.12.12-.24.25-.1.5.14.25.62 1.02 1.33 1.65.92.82 1.7 1.08 1.95 1.2.25.12.4.1.55-.07.15-.17.63-.73.8-.98.17-.25.34-.2.58-.12.25.08 1.57.74 1.84.88.27.13.45.2.52.3.07.1.07.6-.18 1.28Z"
                      />
                    </svg>
                </button>

                {/* ELIMINAR */}
                <button
                  onClick={() =>
                    onDeleteGame(gameId)
                  }
                  style={{
                    padding: "11px 14px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#eee",
                    cursor: "pointer"
                  }}
                  aria-label={t.deleteGame}
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default HistoryPage;
