import { useState } from "react";
import { registerHand } from "../services/gameService";
import PointsStep from "./PointsStep";

function RegisterHandModal({ open, onClose, game, updateGame }) {
  const [form, setForm] = useState({
    step: 1,
    winnerId: null,
    loserId: null,
    type: null,
    handPoints: ""
  });

  if (!open) return null;

  function resetAndClose() {
    setForm({
      step: 1,
      winnerId: null,
      loserId: null,
      type: null,
      handPoints: ""
    });

    onClose();
  }

  function saveHand() {

    if (form.handPoints === "") {
      alert("Introduce los puntos de la mano.");
      return;
    }

    const points = Number(form.handPoints);

    if (isNaN(points)) {
      alert("Los puntos deben ser un número.");
      return;
    }

    if (points < 8) {
      alert("Una mano válida debe tener al menos 8 puntos.");
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
        alignItems: "center"
      }}
    >
      <div
        style={{
          background: "white",
          color: "black",
          width: "380px",
          padding: "25px",
          borderRadius: "12px"
        }}
      >
        {form.step === 1 && (
          <>
            <h2 style={{ textAlign: "center" }}>
              Registrar mano
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
              🀄 MAHJONG
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
                const updatedGame = registerHand(game, {
                  type: "EMPATE"
                });

                updateGame(updatedGame);

                resetAndClose();
              }}
            >
              🤝 EMPATE
            </button>
          </>
        )}

        {form.step === 2 && (
          <>
            <h2>¿Quién ha ganado?</h2>

            {game.players
              .filter((p) => p.wind !== "N/A")
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

        {form.step === 3 && (
          <>
            <h2>¿Cómo ha ganado?</h2>

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
              🀄 De muro
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
              🀫 De descarte
            </button>
          </>
        )}

        {form.step === 4 && (
          <>
            <h2>¿Quién descartó?</h2>

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
          />
        )}

        <hr />

        <button
          style={{
            width: "100%",
            marginTop: "10px"
          }}
          onClick={resetAndClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default RegisterHandModal;