// Victoria de muro
export function wallWin(game, winnerId, handPoints) {
  const updatedGame = structuredClone(game);

  const winner = updatedGame.players.find(
    (p) => p.id === winnerId
  );

  const handResults = [];

  let totalWon = 0;

  updatedGame.players.forEach((player) => {

    if (player.wind === "N/A") {
      handResults.push({
        id: player.id,
        points: 0
      });
      return;
    }

    if (player.id === winnerId) return;

    const payment = handPoints + 8;

    player.points -= payment;
    totalWon += payment;

    handResults.push({
      id: player.id,
      points: -payment
    });

  });

  winner.points += totalWon;

  handResults.push({
    id: winner.id,
    points: totalWon
  });

  updatedGame.lastHandResults = handResults;

  return updatedGame;
}


// Victoria por descarte
export function discardWin(game, winnerId, loserId, handPoints) {

  const updatedGame = structuredClone(game);

  const winner = updatedGame.players.find(
    (p) => p.id === winnerId
  );

  const handResults = [];

  let winnerGain = 0;

  updatedGame.players.forEach((player) => {

    if (player.wind === "N/A") {

      handResults.push({
        id: player.id,
        points: 0
      });

      return;
    }

    if (player.id === winnerId) return;

    if (player.id === loserId) {

      const loss = handPoints + 8;

      player.points -= loss;
      winner.points += loss;

      winnerGain += loss;

      handResults.push({
        id: player.id,
        points: -loss
      });

    } else {

      player.points -= 8;
      winner.points += 8;

      winnerGain += 8;

      handResults.push({
        id: player.id,
        points: -8
      });

    }

  });

  handResults.push({
    id: winner.id,
    points: winnerGain
  });

  updatedGame.lastHandResults = handResults;

  return updatedGame;
}


// Empate
export function drawGame(game) {

  const updatedGame = structuredClone(game);

  updatedGame.lastHandResults = updatedGame.players.map(player => ({
    id: player.id,
    points: 0
  }));

  return updatedGame;
}