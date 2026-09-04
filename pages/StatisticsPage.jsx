function StatisticsPage({
  history,
  onBack,
  t
}) {
  // =====================================================
  // PARTIDAS TERMINADAS
  // =====================================================

  const finishedGames = Array.isArray(history)
    ? history.filter((game) => game.finished)
    : [];

  // =====================================================
  // CREAR ESTADÍSTICAS POR JUGADOR
  // =====================================================

  const statisticsMap = new Map();

  finishedGames.forEach((game) => {
    if (!Array.isArray(game.players)) {
      return;
    }

    // ===================================================
    // CLASIFICACIÓN DE LA PARTIDA
    // ===================================================

    const ranking = [...game.players]
      .filter(
        (player) =>
          player?.name &&
          player.name.trim() !== ""
      )
      .sort(
        (a, b) =>
          (Number(b.points) || 0) -
          (Number(a.points) || 0)
      );

    // ===================================================
    // ESTADÍSTICAS DE CADA JUGADOR
    // ===================================================

    ranking.forEach((player, index) => {
      const name = player.name.trim();

      if (!statisticsMap.has(name)) {
        statisticsMap.set(name, {
          name,
          gamesPlayed: 0,
          totalPoints: 0,
          firstPlace: 0,
          secondPlace: 0,
          thirdPlace: 0,
          fourthPlace: 0,
          fifthPlace: 0,
          rankingByAverage: null
        });
      }

      const stats = statisticsMap.get(name);

      stats.gamesPlayed++;

      stats.totalPoints +=
        Number(player.points) || 0;

      const position = index + 1;

      switch (position) {
        case 1:
          stats.firstPlace++;
          break;

        case 2:
          stats.secondPlace++;
          break;

        case 3:
          stats.thirdPlace++;
          break;

        case 4:
          stats.fourthPlace++;
          break;

        case 5:
          stats.fifthPlace++;
          break;

        default:
          break;
      }
    });
  });

  // =====================================================
  // CONVERTIR A ARRAY Y CALCULAR MEDIA
  // =====================================================

  const statistics = Array.from(
    statisticsMap.values()
  ).map((player) => ({
    ...player,
    averagePoints:
      player.gamesPlayed > 0
        ? player.totalPoints /
          player.gamesPlayed
        : 0
  }));

  // =====================================================
  // RANKING POR MEJOR MEDIA
  //
  // rankingByAverage:
  // 1 = mejor media
  // 2 = segunda mejor
  // etc.
  //
  // En caso de empate:
  // 1, 1, 3...
  // =====================================================

  const averageRanking = [
    ...statistics
  ].sort(
    (a, b) =>
      b.averagePoints - a.averagePoints
  );

  let currentRanking = 0;
  let previousAverage = null;

  averageRanking.forEach(
    (player, index) => {
      if (
        previousAverage === null ||
        player.averagePoints !==
          previousAverage
      ) {
        currentRanking = index + 1;
      }

      player.rankingByAverage =
        currentRanking;

      previousAverage =
        player.averagePoints;
    }
  );

  // =====================================================
  // ORDEN VISUAL DE LA TABLA
  //
  // La tabla sigue ordenada por puntuación acumulada.
  // Esto es independiente del ranking por media.
  // =====================================================

  statistics.sort(
    (a, b) =>
      b.totalPoints - a.totalPoints
  );

  // =====================================================
  // TOTAL DE PARTIDAS
  // =====================================================

  const totalGames = finishedGames.length;

  // =====================================================
  // FORMATO DE PUNTOS
  // =====================================================

  const formatPoints = (value) => {
    return Number(value).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    );
  };

  // =====================================================
  // SIN PARTIDAS
  // =====================================================

  if (finishedGames.length === 0) {
    return (
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "30px 20px 40px",
          textAlign: "center",
          color: "white"
        }}
      >
        {/* ========================================= */}
        {/* CABECERA */}
        {/* ========================================= */}

        <div
          style={{
            fontSize: "42px",
            marginBottom: "8px"
          }}
        >
          📊
        </div>

        <h1
          style={{
            margin: "0 0 30px 0"
          }}
        >
          {t.statistics}
        </h1>

        {/* ========================================= */}
        {/* MENSAJE */}
        {/* ========================================= */}

        <div
          style={{
            background:
              "rgba(255,255,255,0.10)",
            borderRadius: "14px",
            padding: "25px 20px",
            marginBottom: "25px"
          }}
        >
          <div
            style={{
              fontSize: "38px",
              marginBottom: "10px"
            }}
          >
            🀄
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "17px",
              lineHeight: "1.5"
            }}
          >
            {t.noStatistics}
          </p>
        </div>

        {/* ========================================= */}
        {/* VOLVER */}
        {/* ========================================= */}

        <button
          onClick={onBack}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "18px",
            fontWeight: "bold",
            background: "transparent",
            color: "white",
            border:
              "2px solid rgba(255,255,255,.5)",
            borderRadius: "12px",
            cursor: "pointer"
          }}
        >
          ← {t.back}
        </button>
      </div>
    );
  }

  // =====================================================
  // PANTALLA DE ESTADÍSTICAS
  // =====================================================

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "25px 15px 40px",
        color: "white"
      }}
    >
      {/* ========================================= */}
      {/* CABECERA */}
      {/* ========================================= */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "25px"
        }}
      >
        <div
          style={{
            fontSize: "42px",
            marginBottom: "5px"
          }}
        >
          📊
        </div>

        <h1
          style={{
            margin: 0
          }}
        >
          {t.statistics}
        </h1>
      </div>

      {/* ========================================= */}
      {/* INDICADOR DE PARTIDAS */}
      {/* ========================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "25px"
        }}
      >
        <div
          style={{
            background: "white",
            color: "#222",
            borderRadius: "14px",
            padding: "18px 35px",
            minWidth: "180px",
            textAlign: "center",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.15)"
          }}
        >
          <div
            style={{
              fontSize: "14px",
              opacity: 0.7,
              marginBottom: "5px"
            }}
          >
            🎮 {t.statisticsGamesPlayed}
          </div>

          <div
            style={{
              fontSize: "34px",
              fontWeight: "bold"
            }}
          >
            {totalGames}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* TABLA */}
      {/* ========================================= */}

      <div
        style={{
          background: "white",
          color: "#222",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.15)",
          marginBottom: "25px"
        }}
      >
        {/* ========================================= */}
        {/* SCROLL HORIZONTAL EN MÓVIL */}
        {/* ========================================= */}

        <div
          style={{
            overflowX: "auto",
            width: "100%"
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: "760px",
              borderCollapse: "collapse",
              fontSize: "15px"
            }}
          >
            {/* ===================================== */}
            {/* CABECERA */}
            {/* ===================================== */}

            <thead>
              <tr
                style={{
                  background:
                    "rgba(15,61,46,0.10)"
                }}
              >
                <th
                  style={{
                    padding: "14px 12px",
                    textAlign: "left",
                    whiteSpace: "nowrap"
                  }}
                >
                  {t.statisticsPlayer}
                </th>

                <th
                  style={{
                    padding: "14px 10px",
                    textAlign: "center",
                    whiteSpace: "nowrap"
                  }}
                >
                  {t.statisticsAveragePoints}
                </th>

                <th
                  style={{
                    padding: "14px 10px",
                    textAlign: "center",
                    whiteSpace: "nowrap"
                  }}
                >
                  {t.statisticsTotalPoints}
                </th>

                <th
                  style={{
                    padding: "14px 10px",
                    textAlign: "center"
                  }}
                >
                  Nº 1
                </th>

                <th
                  style={{
                    padding: "14px 10px",
                    textAlign: "center"
                  }}
                >
                  Nº 2
                </th>

                <th
                  style={{
                    padding: "14px 10px",
                    textAlign: "center"
                  }}
                >
                  Nº 3
                </th>

                <th
                  style={{
                    padding: "14px 10px",
                    textAlign: "center"
                  }}
                >
                  Nº 4
                </th>

                <th
                  style={{
                    padding: "14px 10px",
                    textAlign: "center"
                  }}
                >
                  Nº 5
                </th>
              </tr>
            </thead>

            {/* ===================================== */}
            {/* CUERPO */}
            {/* ===================================== */}

            <tbody>
              {statistics.map(
                (player, index) => (
                  <tr
                    key={player.name}
                    style={{
                      borderTop:
                        "1px solid #eeeeee"
                    }}
                  >
                    {/* ================================= */}
                    {/* JUGADOR */}
                    {/* ================================= */}

                    <td
                      style={{
                        padding: "13px 12px",
                        fontWeight:
                          index === 0
                            ? "bold"
                            : "normal",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {index === 0
                        ? "🏆 "
                        : ""}
                      {player.name}
                    </td>

                    {/* ================================= */}
                    {/* MEDIA DE PUNTOS */}
                    {/* ================================= */}

                    <td
                      style={{
                        padding: "13px 10px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        color:
                          player.averagePoints < 0
                            ? "#d32f2f"
                            : "#222",
                        fontWeight:
                          player.averagePoints < 0
                            ? "bold"
                            : "normal"
                      }}
                    >
                      {formatPoints(
                        player.averagePoints
                      )}
                    </td>

                    {/* ================================= */}
                    {/* PUNTUACIÓN TOTAL */}
                    {/* ================================= */}

                    <td
                      style={{
                        padding: "13px 10px",
                        textAlign: "center",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        color:
                          player.totalPoints < 0
                            ? "#d32f2f"
                            : "#222"
                      }}
                    >
                      {formatPoints(
                        player.totalPoints
                      )}
                    </td>

                    {/* ================================= */}
                    {/* Nº 1 */}
                    {/* ================================= */}

                    <td
                      style={{
                        padding: "13px 10px",
                        textAlign: "center"
                      }}
                    >
                      {player.firstPlace}
                    </td>

                    {/* ================================= */}
                    {/* Nº 2 */}
                    {/* ================================= */}

                    <td
                      style={{
                        padding: "13px 10px",
                        textAlign: "center"
                      }}
                    >
                      {player.secondPlace}
                    </td>

                    {/* ================================= */}
                    {/* Nº 3 */}
                    {/* ================================= */}

                    <td
                      style={{
                        padding: "13px 10px",
                        textAlign: "center"
                      }}
                    >
                      {player.thirdPlace}
                    </td>

                    {/* ================================= */}
                    {/* Nº 4 */}
                    {/* ================================= */}

                    <td
                      style={{
                        padding: "13px 10px",
                        textAlign: "center"
                      }}
                    >
                      {player.fourthPlace}
                    </td>

                    {/* ================================= */}
                    {/* Nº 5 */}
                    {/* ================================= */}

                    <td
                      style={{
                        padding: "13px 10px",
                        textAlign: "center"
                      }}
                    >
                      {player.fifthPlace}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================= */}
      {/* VOLVER */}
      {/* ========================================= */}

      <div
        style={{
          maxWidth: "450px",
          margin: "0 auto"
        }}
      >
        <button
            onClick={onBack}
            style={{
                width: "100%",
                padding: "15px",
                fontSize: "18px",
                fontWeight: "bold",
                background: "#D4AF37",
                color: "#0f3d2e",
                border: "2px solid #D4AF37",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow:
                "0 4px 10px rgba(0,0,0,0.15)"
            }}
            >
            ← {t.back}
            </button>
      </div>
    </div>
  );
}

export default StatisticsPage;