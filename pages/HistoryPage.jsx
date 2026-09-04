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
      return new Date(date).toLocaleString(
        "es-ES",
        {
          dateStyle: "medium",
          timeStyle: "short"
        }
      );
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

      {/* BOTONES SUPERIORES */}

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
            background: "#eeeeee",
            fontWeight: "bold",
            fontSize: "15px"
          }}
        >
          ← {t.back}
        </button>
      </div>

      {/* TÍTULO */}

      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px"
        }}
      >
        📚 {t.historyTitle}
      </h1>

      {/* SIN PARTIDAS */}

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

              {/* CABECERA */}

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

              {/* NOMBRES */}

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

              {/* CLASIFICACIÓN FINAL */}

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

              {/* BOTONES */}

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "15px"
                }}
              >

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
