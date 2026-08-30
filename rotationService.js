const rotations = [
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

export function applyRotation(players, round) {
  const rotation = rotations[round - 1];

  return players.map((player) => ({
    ...player,
    wind: rotation[player.id]
  }));
}