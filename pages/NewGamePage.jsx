import { useState } from "react";

function NewGamePage({
  onStartGame,
  onBack
}) {

  const [players, setPlayers] =
    useState([
      "",
      "",
      "",
      "",
      ""
    ]);


  const handleChange = (
    index,
    value
  ) => {

    const newPlayers =
      [...players];

    newPlayers[index] =
      value;

    setPlayers(newPlayers);
  };


  const startGame = () => {

    const empty =
      players.some(
        (player) =>
          player.trim() === ""
      );

    if (empty) {

      alert(
        "Debes introducir el nombre de los 5 jugadores."
      );

      return;
    }

    onStartGame(players);
  };


  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "30px 20px"
      }}
    >

      <button
        onClick={onBack}
        style={{
          padding: "10px 16px",
          marginBottom: "20px",
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
        🀄 Nueva partida
      </h1>


      <p
        style={{
          textAlign: "center",
          opacity: 0.8,
          marginBottom: "25px"
        }}
      >
        Introduce los 5 jugadores
      </p>


      {players.map(
        (player, index) => (

          <div
            key={index}
            style={{
              marginBottom: "12px"
            }}
          >

            <input
              type="text"
              placeholder={
                `Jugador ${index + 1}`
              }
              value={player}
              onChange={(event) =>
                handleChange(
                  index,
                  event.target.value
                )
              }
              autoComplete="off"
              style={{
                boxSizing: "border-box",
                width: "100%",
                padding: "14px",
                fontSize: "18px",
                borderRadius: "10px",
                border:
                  "1px solid #ccc"
              }}
            />

          </div>

        )
      )}


      <button
        onClick={startGame}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "10px",
          fontSize: "20px",
          fontWeight: "bold",
          background: "#D4AF37",
          color: "#222",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        Comenzar partida
      </button>

    </div>
  );
}

export default NewGamePage;