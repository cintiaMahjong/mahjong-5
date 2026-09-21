export function createRiichiGame(playerNames) {
  return {
    id: `riichi-${Date.now()}`,
    gameType: "RIICHI",

    players: playerNames.map((name, index) => ({
      id: index + 1,
      name,
      points: 30000
    })),

    history: [],

    finished: false,
    winner: null,

    createdAt: Date.now()
  };
}