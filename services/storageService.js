const ACTIVE_GAME_KEY =
  "mahjong-madrid-active-game";

const HISTORY_KEY =
  "mahjong-madrid-game-history";

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
      localStorage.getItem(
        ACTIVE_GAME_KEY
      );

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
      localStorage.getItem(
        HISTORY_KEY
      );

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

      // Conservamos el ID original
      id: game.id,

      // La partida está terminada
      finished: true,

      finishedAt:
        new Date().toISOString()
    };

    // Buscar si esta partida ya estaba
    // guardada anteriormente
    const existingIndex =
      history.findIndex(
        (item) =>
          item.id === game.id
      );

    if (existingIndex !== -1) {
      // Reemplazar la versión anterior
      history[existingIndex] =
        finishedGame;
    } else {
      // Partida nueva
      history.unshift(
        finishedGame
      );
    }

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );

    // La partida ya está archivada
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
// GUARDAR PARTIDA INACABADA EN EL HISTORIAL
// =====================================================

export function saveUnfinishedGameToHistory(game) {
  try {
    const history =
      loadGameHistory();

    const unfinishedGame = {
      ...structuredClone(game),

      // Conservamos el ID original
      id: game.id,

      // Indicamos que NO terminó
      finished: false,

      // Fecha en la que se archivó
      archivedAt:
        new Date().toISOString(),

      // Una partida inacabada no tiene
      // fecha de finalización
      finishedAt: null
    };

    // Buscar si ya estaba en el historial
    const existingIndex =
      history.findIndex(
        (item) =>
          item.id === game.id
      );

    if (existingIndex !== -1) {
      // Actualizamos la partida existente
      history[existingIndex] =
        unfinishedGame;
    } else {
      // Añadimos la partida al principio
      history.unshift(
        unfinishedGame
      );
    }

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );

    // Ya no debe aparecer como
    // "Continuar partida"
    deleteGame();

    return unfinishedGame;
  } catch (error) {
    console.error(
      "Error guardando la partida inacabada:",
      error
    );

    return null;
  }
}

// =====================================================
// ELIMINAR UNA PARTIDA DEL HISTORIAL
// =====================================================

export function deleteFinishedGame(
  gameId
) {
  try {
    const history =
      loadGameHistory();

    const newHistory =
      history.filter(
        (game) =>
          game.id !== gameId
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
