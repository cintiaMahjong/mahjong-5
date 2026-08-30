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

    return new Date(date).toLocaleString(
      "es-ES",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
  }


  function getRanking(game) {

    return [...game.players]
      .filter(
        (player) =>
          player.wind !== "N/A"
      )
      .sort(
        (a, b) =>
          b.points - a.points
      );
  }


  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px"
      }}
    >

      <button
        onClick={onBack}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        ← Volver
      </button>


      <h1
        style={{
          textAlign: "center"
        }}
      >
        📚 Historial
      </h1>


      {history.length === 0 ? (

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

        history.map((game) => {

          const ranking =
            getRanking(game);

          return (
            <div
              key={game.id}
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
                  game.finishedAt
                )}
              </div>


              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "12px"
                }}
              >
                {game.players
                  .map(
                    (player) =>
                      player.name
                  )
                  .join(" · ")}
              </div>


              {ranking.map(
                (player, index) => (

                  <div
                    key={player.id}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      padding:
                        "6px 0"
                    }}
                  >

                    <span>
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : `${index + 1}º`}
                      {" "}
                      {player.name}
                    </span>

                    <strong
                      style={{
                        color:
                          player.points > 0
                            ? "#087f3e"
                            : player.points < 0
                            ? "#c62828"
                            : "#444"
                      }}
                    >
                      {player.points > 0
                        ? "+"
                        : ""}
                      {player.points}
                    </strong>

                  </div>

                )
              )}


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
                    onDeleteGame(
                      game.id
                    )
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