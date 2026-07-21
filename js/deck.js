// Deck / draw logic.
window.FH = window.FH || {};

(function () {

  function idsInDeck(state, ids) {
    return ids.filter(function (id) { return state.inDeck[id]; });
  }

  function ageIdsInDeck(state) { return idsInDeck(state, FH.AGE_IDS); }
  function calamityIdsInDeck(state) { return idsInDeck(state, FH.CALAMITY_IDS); }
  function allIdsInDeck(state) { return ageIdsInDeck(state).concat(calamityIdsInDeck(state)); }

  function calamityIdsNotInDeck(state) {
    return FH.CALAMITY_IDS.filter(function (id) { return !state.inDeck[id]; });
  }

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Shuffles one random not-yet-available calamity into the deck.
  // Returns the id added, or null if all calamities are already in the deck.
  function shuffleInCalamity(state) {
    var candidates = calamityIdsNotInDeck(state);
    if (candidates.length === 0) return null;
    var id = randomFrom(candidates);
    state.inDeck[id] = true;
    return id;
  }

  // Draws a card per the age-transition rules:
  //  - first draw of a cycle: draw straight from the current deck
  //  - every subsequent draw: shuffle in one calamity first, then draw
  // Returns { drawnId, shuffledInId, deckEmpty } -- drawnId is null if the
  // deck was empty and nothing could be drawn.
  function drawCard(state) {
    var shuffledInId = null;
    if (state.drawsThisCycle > 0) {
      shuffledInId = shuffleInCalamity(state);
    }

    var pool = allIdsInDeck(state);
    if (pool.length === 0) {
      return { drawnId: null, shuffledInId: shuffledInId, deckEmpty: true };
    }

    var drawnId = randomFrom(pool);
    state.inDeck[drawnId] = false;
    state.drawsThisCycle += 1;
    state.currentCard = drawnId;

    if (FH.CARDS_BY_ID[drawnId].type === 'calamity') {
      state.gameOver = true;
    }

    return { drawnId: drawnId, shuffledInId: shuffledInId, deckEmpty: false };
  }

  // True start of the game: all ages except Heroes, no calamities.
  function newGame(state) {
    FH.AGE_IDS.forEach(function (id) { state.inDeck[id] = (id !== 'heroes'); });
    FH.CALAMITY_IDS.forEach(function (id) { state.inDeck[id] = false; });
    state.drawsThisCycle = 0;
    state.currentCard = null;
    state.gameOver = false;
  }

  // Infinite-mode reset after a calamity: all ages (incl. Heroes) return,
  // and all calamities are re-armed (available to be shuffled in again).
  function continuePlaying(state) {
    FH.AGE_IDS.forEach(function (id) { state.inDeck[id] = true; });
    FH.CALAMITY_IDS.forEach(function (id) { state.inDeck[id] = false; });
    state.drawsThisCycle = 0;
    state.currentCard = null;
    state.gameOver = false;
  }

  FH.Deck = {
    ageIdsInDeck: ageIdsInDeck,
    calamityIdsInDeck: calamityIdsInDeck,
    allIdsInDeck: allIdsInDeck,
    calamityIdsNotInDeck: calamityIdsNotInDeck,
    shuffleInCalamity: shuffleInCalamity,
    drawCard: drawCard,
    newGame: newGame,
    continuePlaying: continuePlaying
  };
})();
