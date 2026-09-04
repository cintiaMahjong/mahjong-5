// =========================================
// ROTACIONES PARA 5 JUGADORES
// =========================================

const rotations5 = [
  // Ronda 1 · Manos 1-4
  {
    1: "ESTE",
    2: "SUR",
    3: "OESTE",
    4: "NORTE",
    5: "N/A"
  },

  // Ronda 2 · Manos 5-8
  {
    1: "NORTE",
    2: "OESTE",
    3: "ESTE",
    4: "N/A",
    5: "SUR"
  },

  // Ronda 3 · Manos 9-12
  {
    1: "SUR",
    2: "NORTE",
    3: "N/A",
    4: "OESTE",
    5: "ESTE"
  },

  // Ronda 4 · Manos 13-16
  {
    1: "OESTE",
    2: "N/A",
    3: "SUR",
    4: "ESTE",
    5: "NORTE"
  },

  // Ronda 5 · Manos 17-20
  {
    1: "N/A",
    2: "ESTE",
    3: "NORTE",
    4: "SUR",
    5: "OESTE"
  }
];


// =========================================
// ROTACIONES PARA 4 JUGADORES
// =========================================

const rotations4 = [
  // Ronda 1 · Manos 1-4
  {
    1: "ESTE",
    2: "SUR",
    3: "OESTE",
    4: "NORTE"
  },

  // Ronda 2 · Manos 5-8
  {
    1: "SUR",
    2: "ESTE",
    3: "NORTE",
    4: "OESTE"
  },

  // Ronda 3 · Manos 9-12
  {
    1: "OESTE",
    2: "NORTE",
    3: "ESTE",
    4: "SUR"
  },

  // Ronda 4 · Manos 13-16
  {
    1: "NORTE",
    2: "OESTE",
    3: "SUR",
    4: "ESTE"
  }
];


// =========================================
// APLICAR ROTACIÓN
// =========================================

export function applyRotation(players, round) {

  // Elegimos la tabla según el número
  // de jugadores de la partida.

  const rotations =
    players.length === 4
      ? rotations4
      : rotations5;

  const rotation =
    rotations[round - 1];

  // Si no existe la ronda, no hacemos
  // ningún cambio.

  if (!rotation) {
    return players;
  }

  return players.map((player) => ({
    ...player,
    wind: rotation[player.id]
  }));
}