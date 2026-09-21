import { useState } from "react";

function NewRiichiGamePage({ onStart, onBack }) {
  const [players, setPlayers] = useState(["", "", "", ""]);

  function updatePlayer(index, value) {
    setPlayers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleStart() {
    const names = players.map((name) => name.trim());

    if (names.some((name) => !name)) {
      return;
    }

    onStart(names);
  }

  return (
    <div className="page new-game-page">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>
          ←
        </button>

        <h1>Nuevo Riichi</h1>
      </div>

      <div className="new-game-content">
        <h2>Jugadores</h2>

        {players.map((name, index) => (
          <div className="input-group" key={index}>
            <label>Jugador {index + 1}</label>

            <input
              type="text"
              value={name}
              onChange={(e) => updatePlayer(index, e.target.value)}
              placeholder={`Nombre del jugador ${index + 1}`}
              maxLength={20}
            />
          </div>
        ))}

        <button
          className="primary-button"
          onClick={handleStart}
          disabled={players.some((name) => !name.trim())}
        >
          EMPEZAR PARTIDA
        </button>
      </div>
    </div>
  );
}

export default NewRiichiGamePage;