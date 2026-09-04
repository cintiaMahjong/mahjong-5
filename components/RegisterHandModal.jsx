import { useState } from "react";

import { registerHand } from "../services/gameService";

import PointsStep from "./PointsStep";

function RegisterHandModal({
  open,
  onClose,
  game,
  updateGame,
  t
}) {
  const [form, setForm] = useState({
    step: 1,
    winnerId: null,
    loserId: null,
    type: null,
    handPoints: ""
  });

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!open) return null;

  // -----------------------------------------
  // MOSTRAR ERROR
  // -----------------------------------------

  function showError(message) {
    setErrorMessage(message);
    setShowErrorPopup(true);
  }

  function closeErrorPopup() {
    setShowErrorPopup(false);
    setErrorMessage("");
  }

  // -----------------------------------------
  // REINICIAR Y CERRAR
  // -----------------------------------------

  function resetAndClose() {
    setForm({
      step: 1,
      winnerId: null,
      loserId: null,
      type: null,
      handPoints: ""
    });

    setShowErrorPopup(false);
    setErrorMessage("");

    onClose();
  }

  // -----------------------------------------
  // GUARDAR MANO
  // -----------------------------------------

  function saveHand() {
    if (form.handPoints === "") {
      showError(t.enterPoints);
      return;
    }

    const points = Number(form.handPoints);

    if (isNaN(points)) {
      showError(t.pointsMustBeNumber);
      return;
    }

    if (points < 8) {
      showError(t.minimumPoints);
      return;
    }

    const updatedGame = registerHand(game, {
      ...form,
      handPoints: points
    });

    updateGame(updatedGame);

    resetAndClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9998,
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          background: "white",
          color: "black",
          width: "100%",
          maxWidth: "380px",
          padding: "25px",
          borderRadius: "12px",
          boxSizing: "border-box",
          position: "relative"
        }}
      >
        {/* ---------------------------------- */}
        {/* PASO 1 - TIPO DE MANO */}
        {/* ---------------------------------- */}

        {form.step === 1 && (
          <>
            <h2 style={{ textAlign: "center" }}>
              {t.registerHandTitle}
            </h2>

            <button
              style={{
                width: "100%",
                padding: "18px",
                marginBottom: "15px",
                fontSize: "22px",
                background: "#D4AF37",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer"
              }}
              onClick={() =>
                setForm({
                  ...form,
                  step: 2
                })
              }
            >
              🀄 {t.mahjong}
            </button>

            <button
              style={{
                width: "100%",
                padding: "18px",
                fontSize: "22px",
                background: "#e5e5e5",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer"
              }}
              onClick={() => {
                const updatedGame = registerHand(
                  game,
                  {
                    type: "EMPATE"
                  }
                );

                updateGame(updatedGame);

                resetAndClose();
              }}
            >
              🤝 {t.draw}
            </button>
          </>
        )}

        {/* ---------------------------------- */}
        {/* PASO 2 - GANADOR */}
        {/* ---------------------------------- */}

        {form.step === 2 && (
          <>
            <h2>{t.whoWon}</h2>

            {game.players
              .filter(
                (p) => p.wind !== "N/A"
              )
              .map((player) => (
                <button
                  key={player.id}
                  style={{
                    width: "100%",
                    marginBottom: "10px"
                  }}
                  onClick={() =>
                    setForm({
                      ...form,
                      winnerId: player.id,
                      step: 3
                    })
                  }
                >
                  {player.name}
                </button>
              ))}
          </>
        )}

        {/* ---------------------------------- */}
        {/* PASO 3 - COMO GANO */}
        {/* ---------------------------------- */}

        {form.step === 3 && (
          <>
            <h2>{t.howWon}</h2>

            <button
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
              onClick={() =>
                setForm({
                  ...form,
                  type: "MURO",
                  step: 6
                })
              }
            >
              🀄 {t.wall}
            </button>

            <button
              style={{
                width: "100%"
              }}
              onClick={() =>
                setForm({
                  ...form,
                  type: "DESCARTE",
                  step: 4
                })
              }
            >
              🀫 {t.discard}
            </button>
          </>
        )}

        {/* ---------------------------------- */}
        {/* PASO 4 - QUIEN DESCARTO */}
        {/* ---------------------------------- */}

        {form.step === 4 && (
          <>
            <h2>{t.whoDiscarded}</h2>

            {game.players
              .filter(
                (p) =>
                  p.wind !== "N/A" &&
                  p.id !== form.winnerId
              )
              .map((player) => (
                <button
                  key={player.id}
                  style={{
                    width: "100%",
                    marginBottom: "10px"
                  }}
                  onClick={() =>
                    setForm({
                      ...form,
                      loserId: player.id,
                      step: 6
                    })
                  }
                >
                  {player.name}
                </button>
              ))}
          </>
        )}

        {/* ---------------------------------- */}
        {/* PASO 6 - PUNTOS */}
        {/* ---------------------------------- */}

        {form.step === 6 && (
          <PointsStep
            handPoints={form.handPoints}
            setHandPoints={(value) =>
              setForm({
                ...form,
                handPoints: value
              })
            }
            onSave={saveHand}
            t={t}
          />
        )}

        {/* ---------------------------------- */}
        {/* CANCELAR */}
        {/* ---------------------------------- */}

        <hr />

        <button
          style={{
            width: "100%",
            marginTop: "10px"
          }}
          onClick={resetAndClose}
        >
          {t.cancel}
        </button>
      </div>

      {/* ---------------------------------- */}
      {/* POP-UP DE ERROR */}
      {/* ---------------------------------- */}

      {showErrorPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.70)",
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
              color: "#222",
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
              ⚠️
            </div>

            <h2
              style={{
                margin: "0 0 15px 0",
                fontSize: "25px"
              }}
            >
              {t.invalidPointsTitle}
            </h2>

            <div
              style={{
                fontSize: "17px",
                lineHeight: "1.5",
                marginBottom: "24px"
              }}
            >
              {errorMessage}
            </div>

            <button
              onClick={closeErrorPopup}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "10px",
                background: "#D4AF37",
                color: "#222",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,.20)"
              }}
            >
              {t.accept}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterHandModal;