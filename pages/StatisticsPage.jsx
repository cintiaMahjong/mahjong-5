function StatisticsPage({
  history,
  onBack,
  t,
  currentUser
}) {
  // =====================================================
  // COMPROBAR SI UNA PARTIDA ESTÁ COMPLETADA
  // =====================================================

  const isCompletedGame = (game) => {
    if (
      !game ||
      !Array.isArray(game.players) ||
      !Array.isArray(game.history)
    ) {
      return false;
    }

    const playerCount = game.players.length;
    const handsPlayed = game.history.length;

    if (playerCount === 5) {
      return handsPlayed >= 20;
    }

    if (playerCount === 4) {
      return handsPlayed >= 16;
    }

    return false;
  };

  // =====================================================
  // PARTIDAS FINALIZADAS
  // =====================================================

  const finishedGames = Array.isArray(history)
    ? history.filter(
        (game) =>
          game &&
          game.finished &&
          isCompletedGame(game)
      )
    : [];

  // =====================================================
  // PARTIDAS DE 4 Y 5 JUGADORES
  // INDICADORES GENERALES
  // =====================================================

  const fourPlayerGames = finishedGames.filter(
    (game) =>
      Array.isArray(game.players) &&
      game.players.length === 4
  );

  const fivePlayerGames = finishedGames.filter(
    (game) =>
      Array.isArray(game.players) &&
      game.players.length === 5
  );

  const totalGames = finishedGames.length;

  // =====================================================
  // LOCALIZAR AL USUARIO ACTUAL
  // =====================================================

  const getUserPlayer = (game) => {
    if (
      !game ||
      !Array.isArray(game.players) ||
      !currentUser?.id
    ) {
      return null;
    }

    return (
      game.players.find(
        (player) =>
          player?.userId === currentUser.id
      ) || null
    );
  };

  // =====================================================
  // PARTIDAS EN LAS QUE PARTICIPA EL USUARIO
  // =====================================================

  const userGames = finishedGames.filter(
    (game) =>
      getUserPlayer(game) !== null
  );

  const userFourGames = userGames.filter(
    (game) =>
      game.players.length === 4
  );

  const userFiveGames = userGames.filter(
    (game) =>
      game.players.length === 5
  );

  // =====================================================
  // PUNTOS DEL USUARIO - 4 JUGADORES
  // =====================================================

  const fourPlayerTotalPoints =
    userFourGames.reduce(
      (total, game) => {
        const player = getUserPlayer(game);

        return (
          total +
          (Number(player?.points) || 0)
        );
      },
      0
    );

  const fourPlayerAverage =
    userFourGames.length > 0
      ? fourPlayerTotalPoints /
        userFourGames.length
      : 0;

  // =====================================================
  // PUNTOS DEL USUARIO - 5 JUGADORES
  // =====================================================

  const fivePlayerTotalPoints =
    userFiveGames.reduce(
      (total, game) => {
        const player = getUserPlayer(game);

        return (
          total +
          (Number(player?.points) || 0)
        );
      },
      0
    );

  const fivePlayerAverage =
    userFiveGames.length > 0
      ? fivePlayerTotalPoints /
        userFiveGames.length
      : 0;

  // =====================================================
  // ESTADÍSTICAS DE TODOS LOS JUGADORES
  // =====================================================

  const statisticsMap = new Map();

  finishedGames.forEach((game) => {
    if (!Array.isArray(game.players)) {
      return;
    }

    const playerCount = game.players.length;

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

    ranking.forEach((player, index) => {
      const name = player.name.trim();

      if (!statisticsMap.has(name)) {
        statisticsMap.set(name, {
          name,
          gamesPlayed: 0,
          totalPoints: 0,
          fourGames: 0,
          fourTotalPoints: 0,
          fiveGames: 0,
          fiveTotalPoints: 0,
          firstPlace: 0,
          secondPlace: 0,
          thirdPlace: 0,
          fourthPlace: 0,
          fifthPlace: 0,
          userId: player.userId || null
        });
      }

      const stats = statisticsMap.get(name);

      const points =
        Number(player.points) || 0;

      // ===============================================
      // ESTADÍSTICAS GENERALES
      // ===============================================

      stats.gamesPlayed++;
      stats.totalPoints += points;

      // ===============================================
      // PARTIDAS DE 4
      // ===============================================

      if (playerCount === 4) {
        stats.fourGames++;
        stats.fourTotalPoints += points;
      }

      // ===============================================
      // PARTIDAS DE 5
      // ===============================================

      if (playerCount === 5) {
        stats.fiveGames++;
        stats.fiveTotalPoints += points;
      }

      // ===============================================
      // POSICIÓN FINAL
      // ===============================================

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

      // ===============================================
      // GUARDAR USER ID
      // ===============================================

      if (
        player.userId &&
        !stats.userId
      ) {
        stats.userId = player.userId;
      }
    });
  });

  // =====================================================
  // CALCULAR MEDIAS
  // =====================================================

  const statistics = Array.from(
    statisticsMap.values()
  )
    .map((player) => ({
      ...player,

      averagePoints:
        player.gamesPlayed > 0
          ? player.totalPoints /
            player.gamesPlayed
          : 0,

      fourAverage:
        player.fourGames > 0
          ? player.fourTotalPoints /
            player.fourGames
          : 0,

      fiveAverage:
        player.fiveGames > 0
          ? player.fiveTotalPoints /
            player.fiveGames
          : 0
    }))
    .sort(
      (a, b) =>
        b.totalPoints -
        a.totalPoints
    );

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
  // ESTILOS DE TABLA
  // =====================================================

  const headerStyle = {
    padding: "12px 8px",
    textAlign: "center",
    color: "#d4af37",
    fontSize: "13px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    borderBottom:
      "1px solid rgba(212,175,55,0.4)"
  };

  const cellStyle = {
    padding: "12px 8px",
    textAlign: "center",
    color: "#fff",
    fontSize: "14px",
    whiteSpace: "nowrap",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)"
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding:
          "25px 15px 40px"
      }}
    >
      {/* =================================================
          CABECERA
      ================================================= */}

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
            margin: 0,
            color: "#d4af37",
            fontSize: "28px"
          }}
        >
          {t.statistics}
        </h1>

        {/* USUARIO ACTUAL */}

        {currentUser?.name && (
          <div
            style={{
              marginTop: "8px",
              color: "#d4af37",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            {currentUser.name}
          </div>
        )}

        {/* =================================================
            BOTÓN VOLVER
        ================================================= */}

        <button
          onClick={onBack}
          style={{
            marginTop: "18px",
            padding: "12px 30px",
            borderRadius: "10px",
            border:
              "2px solid #d4af37",
            background: "#d4af37",
            color: "#0f3d2e",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow:
              "0 3px 8px rgba(0,0,0,0.25)"
          }}
        >
          ← {t.back}
        </button>
      </div>

      {/* =================================================
          INDICADORES GENERALES
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "15px"
        }}
      >
        {/* PARTIDAS TOTALES */}

        <div
          style={{
            background:
              "rgba(255,255,255,0.07)",
            border:
              "1px solid rgba(212,175,55,0.3)",
            borderRadius: "15px",
            padding: "18px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#fff"
            }}
          >
            {totalGames}
          </div>

          <div
            style={{
              marginTop: "5px",
              color: "#ddd",
              fontSize: "13px"
            }}
          >
            {t.statisticsGamesPlayed}
          </div>
        </div>

        {/* PARTIDAS DE 4 */}

        <div
          style={{
            background:
              "rgba(212,175,55,0.18)",
            border:
              "1px solid rgba(212,175,55,0.45)",
            borderRadius: "15px",
            padding: "18px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#fff"
            }}
          >
            {fourPlayerGames.length}
          </div>

          <div
            style={{
              marginTop: "5px",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px"
            }}
          >
            {t.statisticsFourPlayers ||
              "4 jugadores"}
          </div>
        </div>

        {/* PARTIDAS DE 5 */}

        <div
          style={{
            background:
              "rgba(15,61,46,0.55)",
            border:
              "1px solid rgba(212,175,55,0.35)",
            borderRadius: "15px",
            padding: "18px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#fff"
            }}
          >
            {fivePlayerGames.length}
          </div>

          <div
            style={{
              marginTop: "5px",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px"
            }}
          >
            {t.statisticsFivePlayers ||
              "5 jugadores"}
          </div>
        </div>
      </div>

      {/* =================================================
          INDICADORES DEL USUARIO
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "15px",
          marginBottom: "30px"
        }}
      >
        {/* =================================================
            4 JUGADORES - MIS PUNTOS
        ================================================= */}

        <div
          style={{
            background:
              "rgba(212,175,55,0.18)",
            border:
              "1px solid rgba(212,175,55,0.45)",
            borderRadius: "16px",
            padding: "20px"
          }}
        >
          <h2
            style={{
              margin:
                "0 0 18px",
              color: "#d4af37",
              textAlign: "center",
              fontSize: "21px"
            }}
          >
            {t.statisticsFourPlayers ||
              "4 jugadores"}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr)",
              gap: "15px",
              textAlign: "center"
            }}
          >
            {/* SUMA */}

            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#fff"
                }}
              >
                {formatPoints(
                  fourPlayerTotalPoints
                )}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#ddd",
                  marginTop: "4px"
                }}
              >
                {t.statisticsTotalPoints}
              </div>
            </div>

            {/* MEDIA */}

            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#fff"
                }}
              >
                {formatPoints(
                  fourPlayerAverage
                )}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#ddd",
                  marginTop: "4px"
                }}
              >
                {t.statisticsAveragePoints}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            5 JUGADORES - MIS PUNTOS
        ================================================= */}

        <div
          style={{
            background:
              "rgba(15,61,46,0.55)",
            border:
              "1px solid rgba(212,175,55,0.35)",
            borderRadius: "16px",
            padding: "20px"
          }}
        >
          <h2
            style={{
              margin:
                "0 0 18px",
              color: "#d4af37",
              textAlign: "center",
              fontSize: "21px"
            }}
          >
            {t.statisticsFivePlayers ||
              "5 jugadores"}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr)",
              gap: "15px",
              textAlign: "center"
            }}
          >
            {/* SUMA */}

            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#fff"
                }}
              >
                {formatPoints(
                  fivePlayerTotalPoints
                )}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#ddd",
                  marginTop: "4px"
                }}
              >
                {t.statisticsTotalPoints}
              </div>
            </div>

            {/* MEDIA */}

            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#fff"
                }}
              >
                {formatPoints(
                  fivePlayerAverage
                )}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#ddd",
                  marginTop: "4px"
                }}
              >
                {t.statisticsAveragePoints}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          TABLA UNIFICADA
      ================================================= */}

      {statistics.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding:
              "35px 20px",
            background:
              "rgba(255,255,255,0.06)",
            borderRadius: "15px",
            color: "#ddd",
            marginBottom: "25px"
          }}
        >
          {t.noStatistics}
        </div>
      ) : (
        <div
          style={{
            background:
              "rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "15px",
            overflowX: "auto",
            marginBottom: "25px"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
              minWidth:
                "1050px"
            }}
          >
            <thead>
              <tr>
                {/* N.º */}

                <th
                  style={headerStyle}
                >
                  N.º
                </th>

                {/* JUGADOR */}

                <th
                  style={{
                    ...headerStyle,
                    textAlign: "left"
                  }}
                >
                  {t.statisticsPlayer}
                </th>

                {/* MEDIA GENERAL */}

                <th
                  style={headerStyle}
                >
                  Media puntos
                </th>

                {/* SUMA GENERAL */}

                <th
                  style={headerStyle}
                >
                  Suma puntos
                </th>

                {/* MEDIA 4 */}

                <th
                  style={{
                    ...headerStyle,
                    background:
                      "rgba(212,175,55,0.18)"
                  }}
                >
                  Media (4)
                </th>

                {/* SUMA 4 */}

                <th
                  style={{
                    ...headerStyle,
                    background:
                      "rgba(212,175,55,0.18)"
                  }}
                >
                  Suma (4)
                </th>

                {/* MEDIA 5 */}

                <th
                  style={{
                    ...headerStyle,
                    background:
                      "rgba(15,61,46,0.55)"
                  }}
                >
                  Media (5)
                </th>

                {/* SUMA 5 */}

                <th
                  style={{
                    ...headerStyle,
                    background:
                      "rgba(15,61,46,0.55)"
                  }}
                >
                  Suma (5)
                </th>

                {/* POSICIONES */}

                <th
                  style={headerStyle}
                >
                  {t.firstPlace}
                </th>

                <th
                  style={headerStyle}
                >
                  {t.secondPlace}
                </th>

                <th
                  style={headerStyle}
                >
                  {t.thirdPlace}
                </th>

                <th
                  style={headerStyle}
                >
                  4.º
                </th>

                <th
                  style={headerStyle}
                >
                  5.º
                </th>
              </tr>
            </thead>

            <tbody>
              {statistics.map(
                (player, index) => {
                  // ========================================
                  // ¿ES EL USUARIO ACTUAL?
                  // ========================================

                  const isCurrentUser =
                    currentUser?.id &&
                    player.userId ===
                      currentUser.id;

                  return (
                    <tr
                      key={player.name}
                      style={{
                        background:
                          isCurrentUser
                            ? "rgba(212,175,55,0.16)"
                            : index % 2 === 0
                            ? "rgba(255,255,255,0.035)"
                            : "transparent",

                        boxShadow:
                          isCurrentUser
                            ? "inset 0 0 0 1px rgba(212,175,55,0.45)"
                            : "none"
                      }}
                    >
                      {/* N.º */}

                      <td
                        style={{
                          ...cellStyle,
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff",
                          fontWeight:
                            isCurrentUser
                              ? "bold"
                              : "normal"
                        }}
                      >
                        {index + 1}
                      </td>

                      {/* JUGADOR */}

                      <td
                        style={{
                          ...cellStyle,
                          textAlign:
                            "left",
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff",
                          fontWeight:
                            "bold"
                        }}
                      >
                        {isCurrentUser && (
                          <span
                            style={{
                              marginRight:
                                "7px",
                              color:
                                "#d4af37",
                              fontWeight:
                                "bold"
                            }}
                          >
                            ★
                          </span>
                        )}

                        <span
                          style={{
                            color:
                              isCurrentUser
                                ? "#d4af37"
                                : "#fff",
                            fontWeight:
                              "bold"
                          }}
                        >
                          {isCurrentUser
                            ? "YO"
                            : player.name}
                        </span>
                      </td>

                      {/* MEDIA GENERAL */}

                      <td
                        style={{
                          ...cellStyle,
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff"
                        }}
                      >
                        {formatPoints(
                          player.averagePoints
                        )}
                      </td>

                      {/* SUMA GENERAL */}

                      <td
                        style={{
                          ...cellStyle,
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff",
                          fontWeight:
                            "bold"
                        }}
                      >
                        {formatPoints(
                          player.totalPoints
                        )}
                      </td>

                      {/* MEDIA 4 */}

                      <td
                        style={{
                          ...cellStyle,
                          background:
                            "rgba(212,175,55,0.18)",
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff"
                        }}
                      >
                        {player.fourGames >
                        0
                          ? formatPoints(
                              player.fourAverage
                            )
                          : "—"}
                      </td>

                      {/* SUMA 4 */}

                      <td
                        style={{
                          ...cellStyle,
                          background:
                            "rgba(212,175,55,0.18)",
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff"
                        }}
                      >
                        {player.fourGames >
                        0
                          ? formatPoints(
                              player.fourTotalPoints
                            )
                          : "—"}
                      </td>

                      {/* MEDIA 5 */}

                      <td
                        style={{
                          ...cellStyle,
                          background:
                            "rgba(15,61,46,0.55)",
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff"
                        }}
                      >
                        {player.fiveGames >
                        0
                          ? formatPoints(
                              player.fiveAverage
                            )
                          : "—"}
                      </td>

                      {/* SUMA 5 */}

                      <td
                        style={{
                          ...cellStyle,
                          background:
                            "rgba(15,61,46,0.55)",
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff"
                        }}
                      >
                        {player.fiveGames >
                        0
                          ? formatPoints(
                              player.fiveTotalPoints
                            )
                          : "—"}
                      </td>

                      {/* 1.º */}

                      <td
                        style={{
                          ...cellStyle,
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff"
                        }}
                      >
                        {player.firstPlace}
                      </td>

                      {/* 2.º */}

                      <td
                        style={{
                          ...cellStyle,
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff"
                        }}
                      >
                        {player.secondPlace}
                      </td>

                      {/* 3.º */}

                      <td
                        style={{
                          ...cellStyle,
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff"
                        }}
                      >
                        {player.thirdPlace}
                      </td>

                      {/* 4.º */}

                      <td
                        style={{
                          ...cellStyle,
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff"
                        }}
                      >
                        {player.fourthPlace}
                      </td>

                      {/* 5.º */}

                      <td
                        style={{
                          ...cellStyle,
                          color:
                            isCurrentUser
                              ? "#d4af37"
                              : "#fff"
                        }}
                      >
                        {player.fifthPlace}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StatisticsPage;
