function RiichiResultsPage({
  game,
  onNewGame,
  onHistory,
  t
}) {
  // =====================================================
  // CLASIFICACIÓN FINAL
  // =====================================================

  const ranking = [...(game?.players || [])].sort(
    (a, b) =>
      (Number(b?.points) || 0) -
      (Number(a?.points) || 0)
  );

  // =====================================================
  // RESTAS PARA PUNTUACIÓN FINAL
  // =====================================================

  const finalDeductions = [15000, 25000, 35000, 45000];

  // =====================================================
  // FORMATO DE PUNTOS
  // =====================================================

  function formatPoints(value) {
    const points = Number(value) || 0;

    return points.toLocaleString("es-ES");
  }

  function formatSignedPoints(value) {
    const points = Number(value) || 0;

    return `${points > 0 ? "+" : ""}${formatPoints(points)}`;
  }

  // =====================================================
  // MEDALLAS
  // =====================================================

  function medal(index) {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    if (index === 3) return "4️⃣";
    if (index === 4) return "5️⃣";

    return `${index + 1}º`;
  }

  // =====================================================
  // NOMBRE DE JUGADOR
  // =====================================================

  function getPlayerName(id) {
    const player = (game?.players || []).find(
      (item) => String(item.id) === String(id)
    );

    return player?.name || t?.player || "Jugador";
  }

  // =====================================================
  // HISTORIAL DE MANOS
  // =====================================================
  // La última mano aparece primero.

  const orderedHistory = [
    ...(game?.history || [])
  ].reverse();

  // =====================================================
  // TEXTO DE CLASIFICACIÓN PARA WHATSAPP
  // =====================================================

  function getRankingWhatsAppText() {
    return ranking
      .map((player, index) => {
        const points = Number(player?.points) || 0;

        return `${medal(index)} ${
          player?.name || t?.player || "Jugador"
        } · ${formatSignedPoints(points)} puntos`;
      })
      .join("\n");
  }

  // =====================================================
  // TEXTO DE PUNTUACIÓN FINAL PARA WHATSAPP
  // =====================================================

  function getFinalScoreWhatsAppText() {
    return ranking
      .map((player, index) => {
        const points = Number(player?.points) || 0;
        const deduction =
          finalDeductions[index] || 0;
        const finalScore = points - deduction;

        return `${index + 1}º ${
          player?.name || t?.player || "Jugador"
        } · ${formatSignedPoints(finalScore)} ` +
          `(${formatPoints(points)} - ${formatPoints(
            deduction
          )})`;
      })
      .join("\n");
  }

  // =====================================================
  // WHATSAPP: CLASIFICACIÓN
  // =====================================================

  function sendRankingToWhatsApp() {
    if (!ranking.length) return;

    const message =
      `🏆 CLASIFICACIÓN FINAL\n\n` +
      getRankingWhatsAppText();

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

  // =====================================================
  // WHATSAPP: PUNTUACIÓN FINAL
  // =====================================================

  function sendFinalScoreToWhatsApp() {
    if (!ranking.length) return;

    const message =
      `💰 PUNTUACIÓN FINAL\n\n` +
      getFinalScoreWhatsAppText();

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

  // =====================================================
  // WHATSAPP: CLASIFICACIÓN + PUNTUACIÓN FINAL
  // =====================================================

  function sendBothToWhatsApp() {
    if (!ranking.length) return;

    const message =
      `🏆 CLASIFICACIÓN FINAL\n\n` +
      getRankingWhatsAppText() +
      `\n\n` +
      `💰 PUNTUACIÓN FINAL\n\n` +
      getFinalScoreWhatsAppText();

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

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "25px",
        boxSizing: "border-box"
      }}
    >
      {/* ============================================== */}
      {/* BOTONES SUPERIORES */}
      {/* ============================================== */}

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
          ← {t?.backToHistory || "Historial"}
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
          🀄 {t?.newGame || "Nueva partida"}
        </button>
      </div>

      {/* ============================================== */}
      {/* TÍTULO */}
      {/* ============================================== */}

      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px"
        }}
      >
        🏆 {t?.gameFinished || "Partida terminada"}
      </h1>

      {/* ============================================== */}
      {/* CLASIFICACIÓN FINAL */}
      {/* ============================================== */}

      <div
        style={{
          background: "#ffffff",
          color: "#222222",
          borderRadius: "12px",
          padding: "20px",
          boxShadow:
            "0 4px 10px rgba(0,0,0,.25)"
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "15px",
            fontSize: "20px"
          }}
        >
          🏆 CLASIFICACIÓN FINAL
        </h2>

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
                  gap: "10px",
                  padding: "12px 0",
                  borderBottom:
                    index !== ranking.length - 1
                      ? "1px solid #dddddd"
                      : "none"
                }}
              >
                <div
                  style={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {medal(index)}{" "}
                  <strong>
                    {player?.name ||
                      t?.player ||
                      "Jugador"}
                  </strong>
                </div>

                <div
                  style={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    color:
                      points > 0
                        ? "#0a8f3d"
                        : points < 0
                        ? "#c62828"
                        : "#444444"
                  }}
                >
                  {formatSignedPoints(points)}
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              padding: "10px 0",
              textAlign: "center",
              color: "#777777"
            }}
          >
            {t?.noPlayerData ||
              "No hay datos de jugadores"}
          </div>
        )}

        {/* WHATSAPP CLASIFICACIÓN */}

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

      {/* ============================================== */}
      {/* PUNTUACIÓN FINAL */}
      {/* ============================================== */}

      <div
        style={{
          marginTop: "25px",
          background: "#ffffff",
          color: "#222222",
          borderRadius: "12px",
          padding: "20px",
          boxShadow:
            "0 4px 10px rgba(0,0,0,.25)",
          boxSizing: "border-box"
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "15px",
            fontSize: "20px"
          }}
        >
          💰 PUNTUACIÓN FINAL
        </h2>

        <div
          style={{
            width: "100%",
            overflowX: "auto"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px"
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#176b3a",
                  color: "#ffffff"
                }}
              >
                <th
                  style={{
                    padding: "10px 7px",
                    textAlign: "left"
                  }}
                >
                  Jugador
                </th>
                <th
                  style={{
                    padding: "10px 7px",
                    textAlign: "right",
                    whiteSpace: "nowrap"
                  }}
                >
                  Puntos
                </th>
                <th
                  style={{
                    padding: "10px 7px",
                    textAlign: "right",
                    whiteSpace: "nowrap"
                  }}
                >
                  Resta
                </th>
                <th
                  style={{
                    padding: "10px 7px",
                    textAlign: "right",
                    whiteSpace: "nowrap"
                  }}
                >
                  Final
                </th>
              </tr>
            </thead>

            <tbody>
              {ranking.map((player, index) => {
                const points =
                  Number(player?.points) || 0;

                const deduction =
                  finalDeductions[index] || 0;

                const finalScore =
                  points - deduction;

                return (
                  <tr
                    key={
                      player?.id ??
                      `final-${index}`
                    }
                    style={{
                      borderBottom:
                        "1px solid #dddddd"
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 7px",
                        fontWeight: "bold"
                      }}
                    >
                      {index + 1}º{" "}
                      {player?.name ||
                        t?.player ||
                        "Jugador"}
                    </td>

                    <td
                      style={{
                        padding: "10px 7px",
                        textAlign: "right"
                      }}
                    >
                      {formatPoints(points)}
                    </td>

                    <td
                      style={{
                        padding: "10px 7px",
                        textAlign: "right",
                        color: "#b40000"
                      }}
                    >
                      -{formatPoints(deduction)}
                    </td>

                    <td
                      style={{
                        padding: "10px 7px",
                        textAlign: "right",
                        fontWeight: "bold",
                        color:
                          finalScore > 0
                            ? "#176b3a"
                            : finalScore < 0
                            ? "#b40000"
                            : "#444444"
                      }}
                    >
                      {formatSignedPoints(
                        finalScore
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* WHATSAPP PUNTUACIÓN FINAL */}

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

        {/* WHATSAPP TODO JUNTO */}

        {ranking.length > 0 && (
          <button
            onClick={sendBothToWhatsApp}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "11px 16px",
              border: "1px solid #25D366",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "bold",
              background: "#ffffff",
              color: "#176b3a"
            }}
          >
            📱 Enviar clasificación + puntuación
          </button>
        )}
      </div>

      {/* ============================================== */}
      {/* HISTORIAL DE MANOS */}
      {/* ============================================== */}

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
          📋 HISTORIAL DE MANOS
        </h2>

        {orderedHistory.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              color: "#222222",
              borderRadius: "8px",
              padding: "15px",
              textAlign: "center"
            }}
          >
            {t?.noHandsRegistered ||
              "No hay manos registradas"}
          </div>
        ) : (
          orderedHistory.map((hand, index) => {
            const handNumber =
              game.history.length - index;

            const winner = game.players.find(
              (player) =>
                String(player.id) ===
                String(hand.winnerId)
            );

            const loser = game.players.find(
              (player) =>
                String(player.id) ===
                String(hand.loserId)
            );

            return (
              <div
                key={
                  hand.id ??
                  `${hand.hand}-${index}`
                }
                style={{
                  background: "#ffffff",
                  color: "#222222",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  marginBottom: "10px",
                  boxShadow:
                    "0 1px 4px rgba(0,0,0,0.15)",
                  fontSize: "14px"
                }}
              >
                {/* CABECERA */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "8px"
                  }}
                >
                  <strong>
                    Mano {handNumber}
                  </strong>

                  <strong>
                    {hand.type}
                  </strong>
                </div>

                {/* EMPATE */}

                {hand.type === "EMPATE" && (
                  <div
                    style={{
                      color: "#555555"
                    }}
                  >
                    Todos los jugadores: 0 puntos
                  </div>
                )}

                {/* RON */}

                {hand.type === "RON" && (
                  <>
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "7px"
                      }}
                    >
                      Ganador:{" "}
                      {winner?.name || "Jugador"}
                      {" ← "}
                      {loser?.name || "Jugador"}
                    </div>

                    {loser &&
                      hand.payments?.[
                        loser.id
                      ] !== undefined && (
                        <div
                          style={{
                            marginBottom: "8px",
                            color: "#555555"
                          }}
                        >
                          {loser.name} paga{" "}
                          <strong>
                            {formatPoints(
                              hand.payments[
                                loser.id
                              ]
                            )}
                          </strong>
                        </div>
                      )}
                  </>
                )}

                {/* TSUMO */}

                {hand.type === "TSUMO" && (
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "7px"
                    }}
                  >
                    Ganador:{" "}
                    {winner?.name || "Jugador"}
                    {hand.totalWinner !==
                      undefined && (
                      <span
                        style={{
                          fontWeight: "normal"
                        }}
                      >
                        {" · "}
                        recibe{" "}
                        {formatPoints(
                          hand.totalWinner
                        )}
                      </span>
                    )}
                  </div>
                )}

                {/* CAMBIOS DE PUNTOS */}

                {hand.playerChanges &&
                  hand.playerChanges.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px"
                      }}
                    >
                      {hand.playerChanges.map(
                        (change) => {
                          const player =
                            game.players.find(
                              (item) =>
                                String(
                                  item.id
                                ) ===
                                String(
                                  change.playerId
                                )
                            );

                          if (!player) {
                            return null;
                          }

                          const changeValue =
                            Number(
                              change.change
                            ) || 0;

                          return (
                            <div
                              key={
                                change.playerId
                              }
                              style={{
                                display: "flex",
                                justifyContent:
                                  "space-between",
                                alignItems:
                                  "center",
                                gap: "10px"
                              }}
                            >
                              <span>
                                {player.name}
                              </span>

                              <strong
                                style={{
                                  color:
                                    changeValue <
                                    0
                                      ? "#b40000"
                                      : changeValue >
                                        0
                                      ? "#176b3a"
                                      : "#555555"
                                }}
                              >
                                {formatSignedPoints(
                                  changeValue
                                )}
                              </strong>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RiichiResultsPage;
