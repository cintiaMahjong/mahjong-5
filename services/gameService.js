import {
  wallWin,
  discardWin,
  drawGame
} from "./scoreService";

import { applyRotation } from "./rotationService";


// -----------------------------------------
// CALCULAR NÚMERO MÁXIMO DE MANOS
// -----------------------------------------

function getMaxHands(game) {
  return game.players.length === 4
    ? 16
    : 20;
}


// -----------------------------------------
// CALCULAR RONDA
// -----------------------------------------
//
// Manos 1-4   -> Ronda 1
// Manos 5-8   -> Ronda 2
// Manos 9-12  -> Ronda 3
// Manos 13-16 -> Ronda 4
// Manos 17-20 -> Ronda 5
//
// -----------------------------------------

function calculateRound(hand) {
  return Math.floor((hand - 1) / 4) + 1;
}


// -----------------------------------------
// REGISTRAR MANO
// -----------------------------------------

export function registerHand(game, handData) {

  // ---------------------------------------
  // CALCULAR LÍMITE DE LA PARTIDA
  // ---------------------------------------

  const maxHands = getMaxHands(game);


  // ---------------------------------------
  // NO PERMITIR REGISTRAR MÁS MANOS
  // ---------------------------------------

  if (
    game.finished ||
    game.hand > maxHands
  ) {
    throw new Error(
      "La partida ya ha terminado. No se pueden registrar más manos."
    );
  }


  // ---------------------------------------
  // VALIDACIÓN DE PUNTOS
  // ---------------------------------------

  if (handData.type !== "EMPATE") {

    const points =
      Number(handData.handPoints);

    if (!Number.isInteger(points)) {
      throw new Error(
        "Los puntos deben ser un número entero."
      );
    }

    if (points < 8) {
      throw new Error(
        "Una mano debe tener al menos 8 puntos."
      );
    }
  }


  // ---------------------------------------
  // GUARDAR ESTADO ANTES DE LA MANO
  // ---------------------------------------

  const snapshot = structuredClone({
    hand: game.hand,
    round: game.round,
    players: game.players
  });


  let updatedGame;


  // ---------------------------------------
  // CALCULAR RESULTADO
  // ---------------------------------------

  switch (handData.type) {

    case "MURO":

      updatedGame = wallWin(
        game,
        handData.winnerId,
        Number(handData.handPoints)
      );

      break;


    case "DESCARTE":

      updatedGame = discardWin(
        game,
        handData.winnerId,
        handData.loserId,
        Number(handData.handPoints)
      );

      break;


    case "EMPATE":

      updatedGame = drawGame(game);

      break;


    default:

      return game;
  }


  // ---------------------------------------
  // GUARDAR MANO EN EL HISTORIAL
  // ---------------------------------------

  updatedGame.history.push({

    hand: game.hand,

    round: game.round,

    type: handData.type,

    winnerId:
      handData.winnerId || null,

    loserId:
      handData.loserId || null,

    handPoints:
      Number(handData.handPoints) || 0,


    // Resultado de puntos de ESTA mano

    results: structuredClone(
      updatedGame.lastHandResults
    ),


    // Jugadores y vientos de ESTA mano

    winds: structuredClone(
      game.players
    ),


    // Estado anterior para poder deshacer

    snapshot
  });


  delete updatedGame.lastHandResults;


  // ---------------------------------------
  // ÚLTIMA MANO DE LA PARTIDA
  // ---------------------------------------
  //
  // 4 jugadores -> mano 16
  // 5 jugadores -> mano 20
  //
  // ---------------------------------------

  if (game.hand === maxHands) {

    updatedGame.hand = maxHands;

    updatedGame.round =
      calculateRound(maxHands);

    updatedGame.finished = true;


    // -------------------------------------
    // CALCULAR GANADOR FINAL
    // -------------------------------------

    const activePlayers =
      updatedGame.players.filter(
        (player) =>
          player.wind !== "N/A"
      );


    updatedGame.winner =
      [...activePlayers].sort(
        (a, b) =>
          b.points - a.points
      )[0];


    return updatedGame;
  }


  // ---------------------------------------
  // PASAR A LA SIGUIENTE MANO
  // ---------------------------------------

  updatedGame.hand++;


  const newRound =
    calculateRound(
      updatedGame.hand
    );


  // ---------------------------------------
  // CAMBIO DE RONDA
  // ---------------------------------------

  if (
    newRound !== updatedGame.round
  ) {

    updatedGame.round =
      newRound;


    updatedGame.players =
      applyRotation(
        updatedGame.players,
        newRound
      );
  }


  return updatedGame;
}


// -----------------------------------------
// DESHACER ÚLTIMA MANO
// -----------------------------------------

export function undoLastHand(game) {

  if (
    !game.history ||
    game.history.length === 0
  ) {
    return game;
  }


  const updatedGame =
    structuredClone(game);


  const lastHand =
    updatedGame.history[
      updatedGame.history.length - 1
    ];


  // ---------------------------------------
  // RESTAURAR JUGADORES
  // ---------------------------------------

  updatedGame.players =
    structuredClone(
      lastHand.snapshot.players
    );


  // ---------------------------------------
  // RESTAURAR MANO
  // ---------------------------------------

  updatedGame.hand =
    lastHand.snapshot.hand;


  // ---------------------------------------
  // RESTAURAR RONDA
  // ---------------------------------------

  updatedGame.round =
    lastHand.snapshot.round;


  // ---------------------------------------
  // LA PARTIDA VUELVE A ESTAR ACTIVA
  // ---------------------------------------

  updatedGame.finished = false;

  updatedGame.winner = null;


  // ---------------------------------------
  // ELIMINAR ÚLTIMA MANO DEL HISTORIAL
  // ---------------------------------------

  updatedGame.history.pop();


  return updatedGame;
}
