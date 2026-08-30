export function createGame(playerNames) {

  const winds = [
    "ESTE",
    "SUR",
    "OESTE",
    "NORTE",
    "N/A"
  ];

  const players = playerNames.map(
    (name, index) => ({
      id: index + 1,
      name: name.trim(),
      wind: winds[index],
      points: 0
    })
  );

  return {
    round: 1,
    hand: 1,
    players,
    history: [],
    finished: false,
    winner: null,
    createdAt: new Date().toISOString()
  };
}