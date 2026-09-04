export function createGame(playerNames) {
  // -----------------------------------------
  // VIENTOS INICIALES
  // -----------------------------------------
  //
  // 5 jugadores:
  // J1 -> ESTE
  // J2 -> SUR
  // J3 -> OESTE
  // J4 -> NORTE
  // J5 -> N/A
  //
  // 4 jugadores:
  // J1 -> ESTE
  // J2 -> SUR
  // J3 -> OESTE
  // J4 -> NORTE
  //
  // La rotación de 4 jugadores se ajustará
  // posteriormente en rotationService.js.
  // -----------------------------------------

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

  // -----------------------------------------
  // CREAR PARTIDA
  // -----------------------------------------

  return {
    id:
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,

    round: 1,

    hand: 1,

    players,

    history: [],

    finished: false,

    winner: null,

    createdAt:
      new Date().toISOString()
  };
}
