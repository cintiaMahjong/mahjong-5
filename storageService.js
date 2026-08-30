const ACTIVE_GAME_KEY = "mahjong-madrid-active-game";
const HISTORY_KEY = "mahjong-madrid-game-history";


// =====================================================
// PARTIDA ACTIVA
// =====================================================

export function saveGame(game) {
  try {
    localStorage.setItem(
      ACTIVE_GAME_KEY,
      JSON.stringify(game)
    );
  } catch (error) {
    console.error(
      "Error guardando la partida:",
      error
    );
  }
}


export function loadGame() {
  try {
    const data =
      localStorage.getItem(ACTIVE_GAME_KEY);

    if (!data) {
      return null;
    }

    return JSON.parse(data);

  } catch (error) {

    console.error(
      "Error cargando la partida:",
      error
    );

    return null;
  }
}


export function deleteGame() {
  try {
    localStorage.removeItem(
      ACTIVE_GAME_KEY
    );
  } catch (error) {

    console.error(
      "Error eliminando la partida:",
      error
    );
  }
}


// =====================================================
// HISTORIAL DE PARTIDAS
// =====================================================

export function loadGameHistory() {

  try {

    const data =
      localStorage.getItem(HISTORY_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data);

  } catch (error) {

    console.error(
      "Error cargando el historial:",
      error
    );

    return [];
  }
}


// =====================================================
// GUARDAR PARTIDA TERMINADA
// =====================================================

export function saveFinishedGame(game) {

  try {

    const history =
      loadGameHistory();

    const finishedGame = {
      ...structuredClone(game),

      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,

      finishedAt:
        new Date().toISOString()
    };

    history.unshift(finishedGame);

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );

    // Una vez archivada, eliminamos
    // la partida activa
    deleteGame();

    return finishedGame;

  } catch (error) {

    console.error(
      "Error guardando la partida terminada:",
      error
    );

    return null;
  }
}


// =====================================================
// ELIMINAR UNA PARTIDA DEL HISTORIAL
// =====================================================

export function deleteFinishedGame(gameId) {

  try {

    const history =
      loadGameHistory();

    const newHistory =
      history.filter(
        (game) => game.id !== gameId
      );

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(newHistory)
    );

    return newHistory;

  } catch (error) {

    console.error(
      "Error eliminando la partida:",
      error
    );

    return loadGameHistory();
  }
}


// =====================================================
// BORRAR TODO EL HISTORIAL
// =====================================================

export function clearGameHistory() {

  try {

    localStorage.removeItem(
      HISTORY_KEY
    );

  } catch (error) {

    console.error(
      "Error borrando el historial:",
      error
    );
  }
}