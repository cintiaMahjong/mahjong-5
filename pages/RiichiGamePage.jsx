import { useState } from "react";

function RiichiGamePage({
  game,
  updateGame,
  onHome,
  onFinish
}) {
  const [showRegisterModal, setShowRegisterModal] =
    useState(false);

  const [winnerId, setWinnerId] = useState("");
  const [winType, setWinType] = useState("");

  // TSUMO:
  // cantidad que paga cada uno de los 3 jugadores
  //
  // RON:
  // solamente se utiliza la cantidad del jugador
  // que pierde.
  const [playerPayments, setPlayerPayments] =
    useState({});

  // En RON indica quién hace el descarte/perdedor
  const [loserId, setLoserId] = useState("");

  const [error, setError] = useState("");

  const [showSavePopup, setShowSavePopup] =
    useState(false);

  const [showFinishPopup, setShowFinishPopup] =
    useState(false);

  const [showUndoPopup, setShowUndoPopup] =
    useState(false);

  // =====================================================
  // FORMATEAR PUNTOS
  // =====================================================

  function formatPoints(value) {
    return new Intl.NumberFormat("es-ES").format(value);
  }

  // =====================================================
  // ABRIR MODAL
  // =====================================================

  function openRegisterModal() {
    setWinnerId("");
    setWinType("");
    setPlayerPayments({});
    setLoserId("");
    setError("");
    setShowRegisterModal(true);
  }

  // =====================================================
  // CERRAR MODAL
  // =====================================================

  function closeRegisterModal() {
    setShowRegisterModal(false);
    setWinnerId("");
    setWinType("");
    setPlayerPayments({});
    setLoserId("");
    setError("");
  }

  // =====================================================
  // VOLVER A LA PRIMERA PANTALLA
  // =====================================================

  function backToResultSelection() {
    setWinnerId("");
    setPlayerPayments({});
    setLoserId("");
    setError("");
    setWinType("");
  }

  // =====================================================
  // CAMBIAR CANTIDAD
  // =====================================================

  function updatePlayerPayment(playerId, value) {
    setPlayerPayments((prev) => ({
      ...prev,
      [playerId]: value
    }));
  }

  // =====================================================
  // JUGADORES CONTRARIOS DEL GANADOR
  // =====================================================

  function getOpponents() {
    if (!winnerId) {
      return [];
    }

    return game.players.filter(
      (player) =>
        String(player.id) !== String(winnerId)
    );
  }

  // =====================================================
  // TOTAL TSUMO
  // =====================================================

  function getTsumoWinnerTotal() {
    const opponents = getOpponents();

    return opponents.reduce(
      (total, player) => {
        const value = Number(
          playerPayments[player.id] || 0
        );

        return total + (
          Number.isNaN(value) ? 0 : value
        );
      },
      0
    );
  }

  // =====================================================
  // REGISTRAR MANO
  // =====================================================

  function registerHand() {
    setError("");

    // ===================================================
    // EMPATE
    // ===================================================

    if (winType === "EMPATE") {
      const playerChanges =
        game.players.map((player) => ({
          playerId: player.id,
          change: 0
        }));

      const newHand = {
        id: Date.now(),
        type: "EMPATE",
        winnerId: null,
        loserId: null,
        payments: {},
        playerChanges,
        createdAt: Date.now()
      };

      const updatedGame = {
        ...game,
        history: [
          ...(game.history || []),
          newHand
        ]
      };

      updateGame(updatedGame);
      closeRegisterModal();

      return;
    }

    // ===================================================
    // COMPROBAR GANADOR
    // ===================================================

    if (!winnerId) {
      setError(
        "Selecciona quién gana la mano."
      );
      return;
    }

    // ===================================================
    // RON
    // ===================================================

    if (winType === "RON") {
      // -----------------------------------------------
      // COMPROBAR QUIÉN PIERDE
      // -----------------------------------------------

      if (!loserId) {
        setError(
          "Selecciona qué jugador pierde."
        );
        return;
      }

      // El ganador no puede ser el que pierde
      if (
        String(loserId) ===
        String(winnerId)
      ) {
        setError(
          "El ganador no puede ser el jugador que pierde."
        );
        return;
      }

      // -----------------------------------------------
      // CANTIDAD DEL PERDEDOR
      // -----------------------------------------------

      const loserAmount = Number(
        playerPayments[loserId]
      );

      if (
        playerPayments[loserId] === undefined ||
        playerPayments[loserId] === "" ||
        Number.isNaN(loserAmount) ||
        loserAmount < 0
      ) {
        const loser = game.players.find(
          (player) =>
            String(player.id) ===
            String(loserId)
        );

        setError(
          `Introduce la cantidad que paga ${
            loser?.name || "el jugador"
          }.`
        );

        return;
      }

      // -----------------------------------------------
      // CAMBIOS
      //
      // GANADOR + cantidad
      // PERDEDOR - cantidad
      // OTROS 2 = 0
      // -----------------------------------------------

      const playerChanges =
        game.players.map((player) => {
          // GANADOR
          if (
            String(player.id) ===
            String(winnerId)
          ) {
            return {
              playerId: player.id,
              change: loserAmount
            };
          }

          // PERDEDOR
          if (
            String(player.id) ===
            String(loserId)
          ) {
            return {
              playerId: player.id,
              change: -loserAmount
            };
          }

          // LOS OTROS DOS
          return {
            playerId: player.id,
            change: 0
          };
        });

      const newHand = {
        id: Date.now(),
        type: "RON",
        winnerId: winnerId,
        loserId: loserId,
        payments: {
          [loserId]: loserAmount
        },
        playerChanges,
        createdAt: Date.now()
      };

      // -----------------------------------------------
      // ACTUALIZAR PUNTOS
      // -----------------------------------------------

      const updatedPlayers =
        game.players.map((player) => {
          const change =
            playerChanges.find(
              (item) =>
                item.playerId === player.id
            );

          return {
            ...player,
            points:
              player.points +
              (change?.change || 0)
          };
        });

      const updatedGame = {
        ...game,
        players: updatedPlayers,
        history: [
          ...(game.history || []),
          newHand
        ]
      };

      updateGame(updatedGame);
      closeRegisterModal();

      return;
    }

    // ===================================================
    // TSUMO
    // ===================================================

    if (winType === "TSUMO") {
      const opponents = getOpponents();

      // -----------------------------------------------
      // COMPROBAR LAS 3 CANTIDADES
      // -----------------------------------------------

      for (const player of opponents) {
        const value =
          playerPayments[player.id];

        if (
          value === undefined ||
          value === "" ||
          Number.isNaN(Number(value)) ||
          Number(value) < 0
        ) {
          setError(
            `Introduce la cantidad de ${player.name}.`
          );

          return;
        }
      }

      // -----------------------------------------------
      // TOTAL DEL GANADOR
      // -----------------------------------------------

      const totalWinner =
        getTsumoWinnerTotal();

      // -----------------------------------------------
      // CAMBIOS
      // -----------------------------------------------

      const playerChanges =
        game.players.map((player) => {
          // GANADOR
          if (
            String(player.id) ===
            String(winnerId)
          ) {
            return {
              playerId: player.id,
              change: totalWinner
            };
          }

          // CADA CONTRARIO PAGA SU CANTIDAD
          const amount = Number(
            playerPayments[player.id] || 0
          );

          return {
            playerId: player.id,
            change: -amount
          };
        });

      const payments = {};

      opponents.forEach((player) => {
        payments[player.id] =
          Number(
            playerPayments[player.id] || 0
          );
      });

      const newHand = {
        id: Date.now(),
        type: "TSUMO",
        winnerId: winnerId,
        loserId: null,
        totalWinner: totalWinner,
        payments,
        playerChanges,
        createdAt: Date.now()
      };

      // -----------------------------------------------
      // ACTUALIZAR PUNTOS
      // -----------------------------------------------

      const updatedPlayers =
        game.players.map((player) => {
          const change =
            playerChanges.find(
              (item) =>
                item.playerId === player.id
            );

          return {
            ...player,
            points:
              player.points +
              (change?.change || 0)
          };
        });

      const updatedGame = {
        ...game,
        players: updatedPlayers,
        history: [
          ...(game.history || []),
          newHand
        ]
      };

      updateGame(updatedGame);
      closeRegisterModal();

      return;
    }

    // ===================================================
    // TIPO INCORRECTO
    // ===================================================

    setError(
      "Selecciona RON, TSUMO o EMPATE."
    );
  }

  // =====================================================
  // GUARDAR Y SALIR
  // =====================================================

  function handleSaveAndExit() {
    setShowSavePopup(true);
  }

  function handleConfirmSaveAndExit() {
    setShowSavePopup(false);

    if (onHome) {
      onHome();
    }
  }

  function handleCancelSaveAndExit() {
    setShowSavePopup(false);
  }

  // =====================================================
  // TERMINAR PARTIDA
  // =====================================================

  function handleFinishGame() {
    setShowFinishPopup(true);
  }

  function handleConfirmFinishGame() {
    setShowFinishPopup(false);

    if (onFinish) {
      onFinish();
    }
  }

  function handleCancelFinishGame() {
    setShowFinishPopup(false);
  }

  // =====================================================
  // DESHACER
  // =====================================================

  function handleUndo() {
    if (
      !game.history ||
      game.history.length === 0
    ) {
      return;
    }

    setShowUndoPopup(true);
  }

  function handleConfirmUndo() {
    const history = [
      ...(game.history || [])
    ];

    const lastHand =
      history[history.length - 1];

    if (!lastHand) {
      setShowUndoPopup(false);
      return;
    }

    // -----------------------------------------------
    // REVERTIR EXACTAMENTE LOS CAMBIOS
    // -----------------------------------------------

    const updatedPlayers =
      game.players.map((player) => {
        const change =
          lastHand.playerChanges?.find(
            (item) =>
              item.playerId === player.id
          );

        if (!change) {
          return player;
        }

        return {
          ...player,
          points:
            player.points -
            change.change
        };
      });

    // -----------------------------------------------
    // QUITAR ÚLTIMA MANO
    // -----------------------------------------------

    const updatedHistory =
      history.slice(0, -1);

    const updatedGame = {
      ...game,
      players: updatedPlayers,
      history: updatedHistory
    };

    updateGame(updatedGame);

    setShowUndoPopup(false);
  }

  function handleCancelUndo() {
    setShowUndoPopup(false);
  }

  // =====================================================
  // SI NO HAY PARTIDA
  // =====================================================

  if (!game) {
    return null;
  }

  const handCount =
    game.history?.length || 0;

  // =====================================================
  // RANKING
  // =====================================================

  const ranking = [...game.players].sort(
    (a, b) => b.points - a.points
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "16px",
        boxSizing: "border-box",
        color: "#222222"
      }}
    >

      {/* =================================================
          CABECERA
      ================================================= */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "18px"
        }}
      >
        <h1
          style={{
            margin: "0 0 5px 0",
            fontSize: "27px",
            color: "#e12b2b"
          }}
        >
          🀄 RIICHI
        </h1>

        <div
          style={{
            fontSize: "19px",
            fontWeight: "bold",
            color: "#e12b2b"
          }}
        >
          4 jugadores · {handCount} manos
        </div>
      </div>

      {/* =================================================
          GUARDAR Y SALIR
      ================================================= */}

      <button
        onClick={handleSaveAndExit}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          background: "#D4AF37",
          color: "#222222",
          border: "1px solid #777777",
          borderRadius: "10px",
          cursor: "pointer",
          boxSizing: "border-box"
        }}
      >
        💾 GUARDAR Y SALIR
      </button>

      {/* =================================================
          TERMINAR PARTIDA
      ================================================= */}

      <button
        onClick={handleFinishGame}
        style={{
          width: "100%",
          padding: "13px",
          marginBottom: "20px",
          fontSize: "17px",
          fontWeight: "bold",
          background: "#56ad81",
          color: "#ffffff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxSizing: "border-box"
        }}
      >
        🏁 TERMINAR PARTIDA
      </button>

      {/* =================================================
          CLASIFICACIÓN
      ================================================= */}

      <div
        style={{
          marginBottom: "18px"
        }}
      >
        <h3
          style={{
            margin: "0 0 10px 0",
            fontSize: "18px",
            color: "#e8bb33"
          }}
        >
          CLASIFICACIÓN
        </h3>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid #dddddd"
          }}
        >
          {ranking.map((player, index) => (
            <div
              key={player.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderBottom:
                  index < ranking.length - 1
                    ? "1px solid #eeeeee"
                    : "none",
                boxSizing: "border-box",
                background: "#ffffff",
                color: "#222222"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: 0,
                  flex: 1,
                  color: "#222222"
                }}
              >
                <span
                  style={{
                    width: "28px",
                    flexShrink: 0,
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#222222"
                  }}
                >
                  {index + 1}
                </span>

                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#222222",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {player.name}
                </span>
              </div>

              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "17px",
                  fontWeight: "bold",
                  flexShrink: 0,
                  color:
                    player.points < 0
                      ? "#b40000"
                      : "#222222"
                }}
              >
                {formatPoints(player.points)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
          REGISTRAR MANO
      ================================================= */}

      <button
        onClick={openRegisterModal}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "12px",
          marginBottom: "10px",
          fontSize: "20px",
          fontWeight: "bold",
          background: "#D4AF37",
          color: "#222222",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          boxSizing: "border-box"
        }}
      >
        ➕ REGISTRAR MANO
      </button>

      {/* =================================================
          DESHACER
      ================================================= */}

      <button
        onClick={handleUndo}
        disabled={
          !game.history ||
          game.history.length === 0
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          fontSize: "16px",
          fontWeight: "bold",
          background:
            !game.history ||
            game.history.length === 0
              ? "#cccccc"
              : "#d9534f",
          color: "#ffffff",
          border: "none",
          borderRadius: "10px",
          cursor:
            !game.history ||
            game.history.length === 0
              ? "not-allowed"
              : "pointer",
          boxSizing: "border-box"
        }}
      >
        ↩️ DESHACER ÚLTIMA MANO
      </button>

{/* =================================================
    PUNTUACIÓN FINAL
================================================= */}

<div
  style={{
    marginTop: "18px",
    marginBottom: "20px"
  }}
>
  <h3
    style={{
      margin: "0 0 10px 0",
      fontSize: "18px",
      color: "#e8bb33"
    }}
  >
    PUNTUACIÓN FINAL
  </h3>

  <div
    style={{
      background: "#ffffff",
      border: "1px solid #dddddd",
      borderRadius: "10px",
      overflow: "hidden",
      color: "#e8bb33"
    }}
  >
    {/* CABECERA */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 90px 110px",
        alignItems: "center",
        padding: "9px 10px",
        background: "#37735f",
        color: "#ffffff",
        fontSize: "12px",
        fontWeight: "bold"
      }}
    >
      <span>Jugador</span>
      <span style={{ textAlign: "right" }}>
        Resta
      </span>
      <span style={{ textAlign: "right" }}>
        Puntuación real
      </span>
    </div>

    {/* FILAS */}

    {ranking.map((player, index) => {
      const restas = [
        15000,
        25000,
        35000,
        45000
      ];

      const resta =
        restas[index] || 0;

      const puntuacionReal =
        player.points - resta;

      return (
        <div
          key={player.id}
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 90px 110px",
            alignItems: "center",
            padding: "10px",
            background: "#ffffff",
            color: "#222222",
            borderBottom:
              index <
              ranking.length - 1
                ? "1px solid #eeeeee"
                : "none",
            fontSize: "14px"
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: "#222222",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              paddingRight: "5px"
            }}
          >
            {player.name}
          </span>

          <span
            style={{
              textAlign: "right",
              color: "#b40000",
              fontWeight: "bold"
            }}
          >
            -{formatPoints(resta)}
          </span>

          <span
            style={{
              textAlign: "right",
              fontWeight: "bold",
              color:
                puntuacionReal < 0
                  ? "#b40000"
                  : "#222222"
            }}
          >
            {puntuacionReal > 0
              ? "+"
              : ""}
            {formatPoints(
              puntuacionReal
            )}
          </span>
        </div>
      );
    })}
  </div>
</div>



      {/* =================================================
          HISTORIAL DE MANOS
      ================================================= */}

      <div
        style={{
          marginTop: "20px"
        }}
      >
        <h3
          style={{
            margin: "0 0 10px 0",
            fontSize: "18px",
            color: "#e8bb33"
          }}
        >
          HISTORIAL DE MANOS
        </h3>

        {game.history &&
        game.history.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            {game.history
              .slice()
              .reverse()
              .map((hand, index) => {
                const winner =
                  game.players.find(
                    (player) =>
                      String(player.id) ===
                      String(hand.winnerId)
                  );

                const handNumber =
                  game.history.length -
                  index;

                return (
                  <div
                    key={hand.id}
                    style={{
                      background: "#ffffff",
                      color: "#222222",
                      border:
                        "1px solid #dddddd",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      boxSizing: "border-box"
                    }}
                  >
                    {/* CABECERA */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        marginBottom:
                          hand.type ===
                          "EMPATE"
                            ? 0
                            : "8px",
                        color: "#222222"
                      }}
                    >
                      <strong
                        style={{
                          color: "#222222"
                        }}
                      >
                        Mano {handNumber}
                      </strong>

                      <strong
                        style={{
                          color: "#222222"
                        }}
                      >
                        {hand.type}
                      </strong>
                    </div>

                    {/* EMPATE */}

                    {hand.type ===
                      "EMPATE" && (
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#555555"
                        }}
                      >
                        Todos los jugadores: 0 puntos
                      </div>
                    )}

                    {/* RON / TSUMO */}

                    {hand.type !==
                      "EMPATE" && (
                      <>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            marginBottom:
                              "7px",
                            color: "#222222"
                          }}
                        >
                          Ganador:{" "}
                          {winner?.name ||
                            "Jugador"}
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            flexDirection:
                              "column",
                            gap: "3px"
                          }}
                        >
                          {hand.playerChanges?.map(
                            (change) => {
                              const player =
                                game.players.find(
                                  (p) =>
                                    p.id ===
                                    change.playerId
                                );

                              if (!player) {
                                return null;
                              }

                              return (
                                <div
                                  key={
                                    change.playerId
                                  }
                                  style={{
                                    display:
                                      "flex",
                                    justifyContent:
                                      "space-between",
                                    alignItems:
                                      "center",
                                    fontSize:
                                      "14px",
                                    color:
                                      "#222222",
                                    background:
                                      "#ffffff"
                                  }}
                                >
                                  <span
                                    style={{
                                      color:
                                        "#222222",
                                      fontWeight:
                                        "500"
                                    }}
                                  >
                                    {player.name}
                                  </span>

                                  <strong
                                    style={{
                                      color:
                                        change.change <
                                        0
                                          ? "#b40000"
                                          : change.change >
                                            0
                                          ? "#176b3a"
                                          : "#555555"
                                    }}
                                  >
                                    {change.change >
                                    0
                                      ? "+"
                                      : ""}
                                    {formatPoints(
                                      change.change
                                    )}
                                  </strong>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <div
            style={{
              padding: "12px",
              background: "#ffffff",
              color: "#777777",
              border:
                "1px solid #dddddd",
              borderRadius: "10px",
              fontSize: "14px"
            }}
          >
            Todavía no hay manos registradas.
          </div>
        )}
      </div>

      {/* =================================================
          MODAL REGISTRAR MANO
      ================================================= */}

      {showRegisterModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "360px",
              background: "#ffffff",
              color: "#222222",
              borderRadius: "12px",
              padding: "14px",
              boxSizing: "border-box",
              boxShadow:
                "0 8px 30px rgba(0,0,0,0.35)"
            }}
          >

            {/* =================================================
                PRIMERA PANTALLA
            ================================================= */}

            {winType === "" && (
              <>
                <h2
                  style={{
                    margin:
                      "0 0 16px 0",
                    fontSize: "20px",
                    textAlign:
                      "center",
                    color: "#222222"
                  }}
                >
                  Registrar mano
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setWinType("RON");
                    setError("");
                    setWinnerId("");
                    setLoserId("");
                    setPlayerPayments({});
                  }}
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "8px",
                    marginBottom:
                      "8px",
                    border: "none",
                    borderRadius: "7px",
                    background:
                      "#D4AF37",
                    color: "#222222",
                    fontSize: "15px",
                    fontWeight:
                      "600",
                    cursor:
                      "pointer",
                    boxSizing:
                      "border-box"
                  }}
                >
                  RON
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWinType("TSUMO");
                    setError("");
                    setWinnerId("");
                    setLoserId("");
                    setPlayerPayments({});
                  }}
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "8px",
                    marginBottom:
                      "8px",
                    border: "none",
                    borderRadius: "7px",
                    background:
                      "#D4AF37",
                    color: "#222222",
                    fontSize: "15px",
                    fontWeight:
                      "600",
                    cursor:
                      "pointer",
                    boxSizing:
                      "border-box"
                  }}
                >
                  TSUMO
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWinType("EMPATE");
                    setWinnerId("");
                    setLoserId("");
                    setPlayerPayments({});
                    setError("");
                  }}
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "8px",
                    marginBottom:
                      "12px",
                    border: "none",
                    borderRadius: "7px",
                    background:
                      "#e5e5e5",
                    color: "#222222",
                    fontSize: "15px",
                    fontWeight:
                      "600",
                    cursor:
                      "pointer",
                    boxSizing:
                      "border-box"
                  }}
                >
                  EMPATE
                </button>

                {winType ===
                  "EMPATE" && (
                  <button
                    onClick={
                      registerHand
                    }
                    style={{
                      width: "100%",
                      height: "42px",
                      border: "none",
                      borderRadius:
                        "7px",
                      background:
                        "#D4AF37",
                      color:
                        "#222222",
                      fontSize:
                        "15px",
                      fontWeight:
                        "800",
                      cursor:
                        "pointer",
                      marginBottom:
                        "10px"
                    }}
                  >
                    REGISTRAR
                  </button>
                )}

                <div
                  style={{
                    height: "1px",
                    background:
                      "#cccccc",
                    margin:
                      "0 0 10px 0"
                  }}
                />

                <button
                  onClick={
                    closeRegisterModal
                  }
                  style={{
                    width: "100%",
                    height: "38px",
                    border: "none",
                    borderRadius:
                      "7px",
                    background:
                      "#D4AF37",
                    color:
                      "#222222",
                    fontSize:
                      "14px",
                    fontWeight:
                      "500",
                    cursor:
                      "pointer"
                  }}
                >
                  Cancelar
                </button>
              </>
            )}

            {/* =================================================
                RON
            ================================================= */}

            {winType === "RON" && (
              <>
                <h2
                  style={{
                    margin:
                      "0 0 4px 0",
                    fontSize:
                      "20px",
                    textAlign:
                      "center",
                    color:
                      "#222222"
                  }}
                >
                  RON
                </h2>

                <div
                  style={{
                    textAlign:
                      "center",
                    fontSize:
                      "13px",
                    color:
                      "#666666",
                    marginBottom:
                      "14px"
                  }}
                >
                  Victoria por descarte
                </div>

                {/* GANADOR */}

                <div
                  style={{
                    marginBottom:
                      "12px"
                  }}
                >
                  <div
                    style={{
                      fontWeight:
                        "bold",
                      marginBottom:
                        "5px",
                      color:
                        "#222222",
                      fontSize:
                        "13px"
                    }}
                  >
                    Ganador
                  </div>

                  <select
                    value={winnerId}
                    onChange={(
                      event
                    ) => {
                      setWinnerId(
                        event.target.value
                      );
                      setLoserId("");
                      setPlayerPayments({});
                      setError("");
                    }}
                    style={{
                      width:
                        "100%",
                      height:
                        "42px",
                      padding:
                        "8px",
                      border:
                        "1px solid #cccccc",
                      borderRadius:
                        "7px",
                      fontSize:
                        "15px",
                      background:
                        "#ffffff",
                      color:
                        "#222222",
                      boxSizing:
                        "border-box"
                    }}
                  >
                    <option value="">
                      Selecciona ganador
                    </option>

                    {game.players.map(
                      (player) => (
                        <option
                          key={
                            player.id
                          }
                          value={
                            player.id
                          }
                        >
                          {player.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* PERDEDOR */}

                {winnerId && (
                  <>
                    <div
                      style={{
                        marginBottom:
                          "12px"
                      }}
                    >
                      <div
                        style={{
                          fontWeight:
                            "bold",
                          marginBottom:
                            "5px",
                          color:
                            "#222222",
                          fontSize:
                            "13px"
                        }}
                      >
                        Jugador que pierde
                      </div>

                      <select
                        value={loserId}
                        onChange={(
                          event
                        ) => {
                          setLoserId(
                            event.target
                              .value
                          );
                          setPlayerPayments({});
                          setError("");
                        }}
                        style={{
                          width:
                            "100%",
                          height:
                            "42px",
                          padding:
                            "8px",
                          border:
                            "1px solid #cccccc",
                          borderRadius:
                            "7px",
                          fontSize:
                            "15px",
                          background:
                            "#ffffff",
                          color:
                            "#222222",
                          boxSizing:
                            "border-box"
                        }}
                      >
                        <option value="">
                          Selecciona quién pierde
                        </option>

                        {game.players
                          .filter(
                            (player) =>
                              String(
                                player.id
                              ) !==
                              String(
                                winnerId
                              )
                          )
                          .map(
                            (player) => (
                              <option
                                key={
                                  player.id
                                }
                                value={
                                  player.id
                                }
                              >
                                {player.name}
                              </option>
                            )
                          )}
                      </select>
                    </div>
                  </>
                )}

                {/* IMPORTE RON */}

                {winnerId &&
                  loserId && (
                    <div
                      style={{
                        marginBottom:
                          "10px"
                      }}
                    >
                      <div
                        style={{
                          fontWeight:
                            "bold",
                          marginBottom:
                            "7px",
                          color:
                            "#222222",
                          fontSize:
                            "13px"
                        }}
                      >
                        Importe que paga
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "8px"
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            fontWeight:
                              "600",
                            fontSize:
                              "14px",
                            color:
                              "#222222"
                          }}
                        >
                          {
                            game.players.find(
                              (player) =>
                                String(
                                  player.id
                                ) ===
                                String(
                                  loserId
                                )
                            )?.name
                          }
                        </div>

                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={
                            playerPayments[
                              loserId
                            ] ?? ""
                          }
                          onChange={(
                            event
                          ) =>
                            updatePlayerPayment(
                              loserId,
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="0"
                          style={{
                            width:
                              "110px",
                            height:
                              "40px",
                            padding:
                              "8px",
                            border:
                              "1px solid #cccccc",
                            borderRadius:
                              "7px",
                            fontSize:
                              "15px",
                            background:
                              "#ffffff",
                            color:
                              "#222222",
                            boxSizing:
                              "border-box"
                          }}
                        />
                      </div>
                    </div>
                  )}

                {/* PREVISUALIZACIÓN RON */}

                {winnerId &&
                  loserId &&
                  playerPayments[
                    loserId
                  ] !== undefined &&
                  playerPayments[
                    loserId
                  ] !== "" && (
                    <div
                      style={{
                        background:
                          "#f5f0dc",
                        border:
                          "1px solid #D4AF37",
                        borderRadius:
                          "7px",
                        padding:
                          "9px 10px",
                        marginBottom:
                          "10px",
                        fontSize:
                          "13px",
                        color:
                          "#222222"
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between"
                        }}
                      >
                        <strong>
                          Ganador
                        </strong>

                        <strong
                          style={{
                            color:
                              "#176b3a"
                          }}
                        >
                          +
                          {formatPoints(
                            Number(
                              playerPayments[
                                loserId
                              ] || 0
                            )
                          )}
                        </strong>
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          marginTop:
                            "3px"
                        }}
                      >
                        <span>
                          Perdedor
                        </span>

                        <strong
                          style={{
                            color:
                              "#b40000"
                          }}
                        >
                          -
                          {formatPoints(
                            Number(
                              playerPayments[
                                loserId
                              ] || 0
                            )
                          )}
                        </strong>
                      </div>
                    </div>
                  )}

                {/* ERROR */}

                {error && (
                  <div
                    style={{
                      color:
                        "#b40000",
                      background:
                        "#f9eaea",
                      padding:
                        "8px",
                      borderRadius:
                        "7px",
                      marginBottom:
                        "10px",
                      fontSize:
                        "13px",
                      fontWeight:
                        "600"
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* REGISTRAR */}

                <button
                  onClick={
                    registerHand
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "42px",
                    border:
                      "none",
                    borderRadius:
                      "7px",
                    background:
                      "#D4AF37",
                    color:
                      "#222222",
                    fontSize:
                      "15px",
                    fontWeight:
                      "800",
                    cursor:
                      "pointer",
                    marginBottom:
                      "8px"
                  }}
                >
                  REGISTRAR
                </button>

                <button
                  onClick={
                    backToResultSelection
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "34px",
                    border:
                      "none",
                    background:
                      "transparent",
                    color:
                      "#555555",
                    fontSize:
                      "13px",
                    cursor:
                      "pointer",
                    marginBottom:
                      "8px"
                  }}
                >
                  ← Volver
                </button>

                <div
                  style={{
                    height:
                      "1px",
                    background:
                      "#cccccc",
                    margin:
                      "0 0 10px 0"
                  }}
                />

                <button
                  onClick={
                    closeRegisterModal
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "38px",
                    border:
                      "none",
                    borderRadius:
                      "7px",
                    background:
                      "#D4AF37",
                    color:
                      "#222222",
                    fontSize:
                      "14px",
                    fontWeight:
                      "500",
                    cursor:
                      "pointer"
                  }}
                >
                  Cancelar
                </button>
              </>
            )}

            {/* =================================================
                TSUMO
            ================================================= */}

            {winType ===
              "TSUMO" && (
              <>
                <h2
                  style={{
                    margin:
                      "0 0 4px 0",
                    fontSize:
                      "20px",
                    textAlign:
                      "center",
                    color:
                      "#222222"
                  }}
                >
                  TSUMO
                </h2>

                <div
                  style={{
                    textAlign:
                      "center",
                    fontSize:
                      "13px",
                    color:
                      "#666666",
                    marginBottom:
                      "14px"
                  }}
                >
                  Victoria de muro
                </div>

                {/* GANADOR */}

                <div
                  style={{
                    marginBottom:
                      "12px"
                  }}
                >
                  <div
                    style={{
                      fontWeight:
                        "bold",
                      marginBottom:
                        "5px",
                      color:
                        "#222222",
                      fontSize:
                        "13px"
                    }}
                  >
                    Ganador
                  </div>

                  <select
                    value={winnerId}
                    onChange={(
                      event
                    ) => {
                      setWinnerId(
                        event.target.value
                      );
                      setPlayerPayments({});
                      setError("");
                    }}
                    style={{
                      width:
                        "100%",
                      height:
                        "42px",
                      padding:
                        "8px",
                      border:
                        "1px solid #cccccc",
                      borderRadius:
                        "7px",
                      fontSize:
                        "15px",
                      background:
                        "#ffffff",
                      color:
                        "#222222",
                      boxSizing:
                        "border-box"
                    }}
                  >
                    <option value="">
                      Selecciona ganador
                    </option>

                    {game.players.map(
                      (player) => (
                        <option
                          key={
                            player.id
                          }
                          value={
                            player.id
                          }
                        >
                          {player.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* PAGOS TSUMO */}

                {winnerId && (
                  <div
                    style={{
                      marginBottom:
                        "10px"
                    }}
                  >
                    <div
                      style={{
                        fontWeight:
                          "bold",
                        marginBottom:
                          "7px",
                        color:
                          "#222222",
                        fontSize:
                          "13px"
                      }}
                    >
                      Cantidad que paga cada jugador
                    </div>

                    <div
                      style={{
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        gap: "7px"
                      }}
                    >
                      {getOpponents().map(
                        (player) => (
                          <div
                            key={
                              player.id
                            }
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap:
                                "8px"
                            }}
                          >
                            <div
                              style={{
                                flex:
                                  "1",
                                minWidth:
                                  0,
                                fontWeight:
                                  "600",
                                fontSize:
                                  "14px",
                                color:
                                  "#222222",
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap"
                              }}
                            >
                              {player.name}
                            </div>

                            <input
                              type="number"
                              min="0"
                              step="100"
                              value={
                                playerPayments[
                                  player.id
                                ] ?? ""
                              }
                              onChange={(
                                event
                              ) =>
                                updatePlayerPayment(
                                  player.id,
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="0"
                              style={{
                                width:
                                  "110px",
                                height:
                                  "40px",
                                padding:
                                  "8px",
                                border:
                                  "1px solid #cccccc",
                                borderRadius:
                                  "7px",
                                fontSize:
                                  "15px",
                                background:
                                  "#ffffff",
                                color:
                                  "#222222",
                                boxSizing:
                                  "border-box"
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* TOTAL TSUMO */}

                {winnerId && (
                  <div
                    style={{
                      background:
                        "#f5f0dc",
                      border:
                        "1px solid #D4AF37",
                      borderRadius:
                        "7px",
                      padding:
                        "9px 10px",
                      marginBottom:
                        "10px",
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      fontSize:
                        "14px",
                      color:
                        "#222222"
                    }}
                  >
                    <strong>
                      Total ganador
                    </strong>

                    <strong
                      style={{
                        color:
                          "#176b3a",
                        fontSize:
                          "16px"
                      }}
                    >
                      +
                      {formatPoints(
                        getTsumoWinnerTotal()
                      )}
                    </strong>
                  </div>
                )}

                {/* ERROR */}

                {error && (
                  <div
                    style={{
                      color:
                        "#b40000",
                      background:
                        "#f9eaea",
                      padding:
                        "8px",
                      borderRadius:
                        "7px",
                      marginBottom:
                        "10px",
                      fontSize:
                        "13px",
                      fontWeight:
                        "600"
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* REGISTRAR */}

                <button
                  onClick={
                    registerHand
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "42px",
                    border:
                      "none",
                    borderRadius:
                      "7px",
                    background:
                      "#D4AF37",
                    color:
                      "#222222",
                    fontSize:
                      "15px",
                    fontWeight:
                      "800",
                    cursor:
                      "pointer",
                    marginBottom:
                      "8px"
                  }}
                >
                  REGISTRAR
                </button>

                <button
                  onClick={
                    backToResultSelection
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "34px",
                    border:
                      "none",
                    background:
                      "transparent",
                    color:
                      "#555555",
                    fontSize:
                      "13px",
                    cursor:
                      "pointer",
                    marginBottom:
                      "8px"
                  }}
                >
                  ← Volver
                </button>

                <div
                  style={{
                    height:
                      "1px",
                    background:
                      "#cccccc",
                    margin:
                      "0 0 10px 0"
                  }}
                />

                <button
                  onClick={
                    closeRegisterModal
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "38px",
                    border:
                      "none",
                    borderRadius:
                      "7px",
                    background:
                      "#D4AF37",
                    color:
                      "#222222",
                    fontSize:
                      "14px",
                    fontWeight:
                      "500",
                    cursor:
                      "pointer"
                  }}
                >
                  Cancelar
                </button>
              </>
            )}

            {/* =================================================
                EMPATE
            ================================================= */}

            {winType ===
              "EMPATE" && (
              <>
                <h2
                  style={{
                    margin:
                      "0 0 10px 0",
                    fontSize:
                      "20px",
                    textAlign:
                      "center",
                    color:
                      "#222222"
                  }}
                >
                  EMPATE
                </h2>

                <div
                  style={{
                    textAlign:
                      "center",
                    fontSize:
                      "14px",
                    color:
                      "#555555",
                    marginBottom:
                      "14px",
                    lineHeight:
                      "1.4"
                  }}
                >
                  La mano termina en empate.
                  <br />
                  Todos los jugadores reciben 0 puntos.
                </div>

                <button
                  onClick={
                    registerHand
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "42px",
                    border:
                      "none",
                    borderRadius:
                      "7px",
                    background:
                      "#D4AF37",
                    color:
                      "#222222",
                    fontSize:
                      "15px",
                    fontWeight:
                      "800",
                    cursor:
                      "pointer",
                    marginBottom:
                      "8px"
                  }}
                >
                  REGISTRAR
                </button>

                <button
                  onClick={
                    backToResultSelection
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "34px",
                    border:
                      "none",
                    background:
                      "transparent",
                    color:
                      "#555555",
                    fontSize:
                      "13px",
                    cursor:
                      "pointer",
                    marginBottom:
                      "8px"
                  }}
                >
                  ← Volver
                </button>

                <div
                  style={{
                    height:
                      "1px",
                    background:
                      "#cccccc",
                    margin:
                      "0 0 10px 0"
                  }}
                />

                <button
                  onClick={
                    closeRegisterModal
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "38px",
                    border:
                      "none",
                    borderRadius:
                      "7px",
                    background:
                      "#D4AF37",
                    color:
                      "#222222",
                    fontSize:
                      "14px",
                    fontWeight:
                      "500",
                    cursor:
                      "pointer"
                  }}
                >
                  Cancelar
                </button>
              </>
            )}

          </div>
        </div>
      )}

      {/* =================================================
          POPUP GUARDAR Y SALIR
      ================================================= */}

      {showSavePopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.70)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "#ffffff",
              color: "#222222",
              borderRadius: "16px",
              padding: "24px",
              boxSizing: "border-box",
              boxShadow:
                "0 8px 30px rgba(0,0,0,0.35)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                fontSize: "38px",
                marginBottom: "8px"
              }}
            >
              💾
            </div>

            <h2
              style={{
                margin:
                  "0 0 15px 0",
                fontSize: "25px",
                color: "#222222"
              }}
            >
              GUARDAR Y SALIR
            </h2>

            <div
              style={{
                fontSize: "17px",
                lineHeight: "1.5",
                marginBottom:
                  "24px",
                color: "#333333"
              }}
            >
              La partida quedará
              guardada para poder
              continuarla más tarde.
            </div>

            <button
              onClick={
                handleConfirmSaveAndExit
              }
              style={{
                width:
                  "100%",
                padding:
                  "14px",
                border:
                  "none",
                borderRadius:
                  "10px",
                background:
                  "#D4AF37",
                color:
                  "#222222",
                fontSize:
                  "18px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
                marginBottom:
                  "10px"
              }}
            >
              💾 GUARDAR Y SALIR
            </button>

            <button
              onClick={
                handleCancelSaveAndExit
              }
              style={{
                width:
                  "100%",
                padding:
                  "13px",
                border:
                  "1px solid #cccccc",
                borderRadius:
                  "10px",
                background:
                  "#f5f5f5",
                color:
                  "#444444",
                fontSize:
                  "17px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer"
              }}
            >
              CANCELAR
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          POPUP DESHACER
      ================================================= */}

      {showUndoPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.70)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "#ffffff",
              color: "#222222",
              borderRadius: "16px",
              padding: "24px",
              boxSizing: "border-box",
              boxShadow:
                "0 8px 30px rgba(0,0,0,0.35)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                fontSize: "38px",
                marginBottom: "8px"
              }}
            >
              ↩️
            </div>

            <h2
              style={{
                margin:
                  "0 0 15px 0",
                fontSize: "25px",
                color: "#222222"
              }}
            >
              DESHACER ÚLTIMA MANO
            </h2>

            <div
              style={{
                fontSize: "17px",
                lineHeight: "1.5",
                marginBottom:
                  "24px",
                color: "#333333"
              }}
            >
              ¿Quieres deshacer la
              última mano registrada?
            </div>

            <button
              onClick={
                handleConfirmUndo
              }
              style={{
                width:
                  "100%",
                padding:
                  "14px",
                border:
                  "none",
                borderRadius:
                  "10px",
                background:
                  "#d9534f",
                color:
                  "#ffffff",
                fontSize:
                  "18px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
                marginBottom:
                  "10px"
              }}
            >
              ↩️ DESHACER
            </button>

            <button
              onClick={
                handleCancelUndo
              }
              style={{
                width:
                  "100%",
                padding:
                  "13px",
                border:
                  "1px solid #cccccc",
                borderRadius:
                  "10px",
                background:
                  "#f5f5f5",
                color:
                  "#444444",
                fontSize:
                  "17px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer"
              }}
            >
              CANCELAR
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          POPUP TERMINAR PARTIDA
      ================================================= */}

      {showFinishPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.70)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "#ffffff",
              color: "#222222",
              borderRadius: "16px",
              padding: "24px",
              boxSizing: "border-box",
              boxShadow:
                "0 8px 30px rgba(0,0,0,0.35)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: "8px"
              }}
            >
              🏁
            </div>

            <h2
              style={{
                margin:
                  "0 0 15px 0",
                fontSize: "25px",
                color: "#222222"
              }}
            >
              ¿TERMINAR PARTIDA?
            </h2>

            <div
              style={{
                fontSize: "17px",
                lineHeight: "1.5",
                marginBottom:
                  "24px",
                color: "#333333"
              }}
            >
              La partida se marcará
              como terminada.
            </div>

            <button
              onClick={
                handleConfirmFinishGame
              }
              style={{
                width:
                  "100%",
                padding:
                  "14px",
                border:
                  "none",
                borderRadius:
                  "10px",
                background:
                  "#0f3d2e",
                color:
                  "#ffffff",
                fontSize:
                  "18px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
                marginBottom:
                  "10px"
              }}
            >
              🏁 TERMINAR PARTIDA
            </button>

            <button
              onClick={
                handleCancelFinishGame
              }
              style={{
                width:
                  "100%",
                padding:
                  "13px",
                border:
                  "1px solid #cccccc",
                borderRadius:
                  "10px",
                background:
                  "#f5f5f5",
                color:
                  "#444444",
                fontSize:
                  "17px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer"
              }}
            >
              CANCELAR
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default RiichiGamePage;