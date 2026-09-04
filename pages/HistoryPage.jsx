function HistoryPage({
  history,
  onBack,
  onViewGame,
  onDeleteGame
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

    // Solo jugadores que realmente participan.
    // En partidas de 4 jugadores no existirá un quinto jugador.
    return game.players
      .filter((player) => player?.wind !== "N/A")
      .sort(
        (a, b) => (b.points || 0) - (a.points || 0)
      );
  }

  function getInactivePlayer(game) {
    if (!game || !Array.isArray(game.players)) {
      return null;
    }

    // Solo devuelve un N/A si realmente existe.
    // En una partida de 4 jugadores será null.
    return game.players.find(
      (player) => player?.wind === "N/A"
    ) || null;
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
          ← Volver
        </button>
      </div>

      {/* TÍTULO */}

      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px"
        }}
      >
        📚 Historial
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

          <p>
            Todavía no hay partidas
            terminadas.
          </p>
        </div>

      ) : (

        safeHistory.map((game, gameIndex) => {

          if (!game) {
            return null;
          }

          const ranking = getRanking(game);
          const inactivePlayer = getInactivePlayer(game);

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
                🀄 Partida
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
                          player?.name || "Jugador"
                      )
                      .join(" · ")
                  : "Jugadores no disponibles"}
              </div>

              {/* CLASIFICACIÓN */}

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
                          "Jugador"}
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
                  No hay datos de jugadores
                  disponibles para esta partida.
                </div>

              )}

              {/* JUGADOR N/A */}

              {inactivePlayer && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderTop:
                      ranking.length > 0
                        ? "1px solid #eee"
                        : "none",
                    color: "#777",
                    fontSize: "14px"
                  }}
                >
                  <span>
                    🚫{" "}
                    {inactivePlayer.name ||
                      "Jugador"}
                  </span>

                  <strong
                    style={{
                      color: "#777"
                    }}
                  >
                    {Number(
                      inactivePlayer.points
                    ) || 0}
                  </strong>
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
                  Ver partida
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
                  aria-label="Eliminar partida"
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
