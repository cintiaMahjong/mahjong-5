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
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="15"
                      fill="white"
                    />

                    <path
                      d="M23.2 8.8C21.28 6.88 18.72 5.82 16 5.82C10.39 5.82 5.82 10.39 5.82 16C5.82 17.79 6.29 19.54 7.18 21.08L5.73 26.27L11.05 24.87C12.52 25.67 14.24 26.18 16 26.18C21.61 26.18 26.18 21.61 26.18 16C26.18 13.28 25.12 10.72 23.2 8.8Z"
                      fill="#25D366"
                    />

                    <path
                      d="M20.66 17.77C20.41 17.65 19.2 17.06 18.98 16.97C18.75 16.89 18.59 16.84 18.42 17.09C18.26 17.34 17.78 17.89 17.64 18.05C17.49 18.22 17.35 18.24 17.1 18.11C16.85 17.99 16.05 17.73 15.1 16.87C14.36 16.21 13.86 15.39 13.72 15.14C13.58 14.89 13.7 14.75 13.82 14.63C13.93 14.52 14.07 14.34 14.19 14.2C14.31 14.05 14.35 13.94 14.43 13.78C14.51 13.62 14.47 13.48 14.41 13.36C14.35 13.23 13.85 12.02 13.64 11.53C13.44 11.04 13.24 11.12 13.1 11.12C12.97 11.12 12.81 11.1 12.65 11.1C12.49 11.1 12.23 11.16 12.01 11.41C11.79 11.65 11.17 12.24 11.17 13.44C11.17 14.64 12.03 15.8 12.15 15.96C12.27 16.12 13.84 18.54 16.25 19.58C16.82 19.82 17.27 19.96 17.62 20.07C18.19 20.25 18.71 20.22 19.12 20.15C19.58 20.08 20.55 19.57 20.76 19C20.96 18.43 20.96 17.94 20.9 17.83C20.84 17.81 20.79 17.79 20.66 17.77Z"
                      fill="#25D366"
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
