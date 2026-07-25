// Deck / draw logic.
window.FH = window.FH || {};

(function () {

  function idsInDeck(state, ids) {
    return ids.filter(function (id) { return state.inDeck[id]; });
  }

  function ageIdsInDeck(state) { return idsInDeck(state, FH.AGE_IDS); }
  function calamityIdsInDeck(state) { return idsInDeck(state, FH.CALAMITY_IDS); }
  function allIdsInDeck(state) { return ageIdsInDeck(state).concat(calamityIdsInDeck(state)); }

  // The checkboxes ARE the deck: whatever's currently unchecked is a valid
  // shuffle-in candidate, including something a player manually removed --
  // manually unchecking a calamity only takes it out of the deck right now,
  // it doesn't block it from being shuffled back in later.
  function calamityIdsNotInDeck(state) {
    return FH.CALAMITY_IDS.filter(function (id) { return !state.inDeck[id]; });
  }

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Shuffles one random not-currently-in-the-deck calamity into the deck.
  // Returns the id added, or null if every calamity is already in the deck.
  function shuffleInCalamity(state) {
    var candidates = calamityIdsNotInDeck(state);
    if (candidates.length === 0) return null;
    var id = randomFrom(candidates);
    state.inDeck[id] = true;
    return id;
  }

  // Draws a card straight from the deck as it currently stands. Does NOT
  // shuffle in a calamity -- that's a separate step the caller runs
  // afterward (see js/main.js), so a newly shuffled-in calamity is never
  // the one that gets drawn in the same action; it's only ever a
  // possibility starting with the *next* draw.
  // Returns { drawnId, deckEmpty } -- drawnId is null if the deck was empty.
  function drawCard(state) {
    var pool = allIdsInDeck(state);
    if (pool.length === 0) {
      return { drawnId: null, deckEmpty: true };
    }

    var drawnId = randomFrom(pool);
    state.inDeck[drawnId] = false;

    if (state.currentCard) {
      state.history.push(state.currentCard);
    }
    state.currentCard = drawnId;

    if (FH.CARDS_BY_ID[drawnId].type === 'calamity') {
      state.gameOver = true;
    }

    return { drawnId: drawnId, deckEmpty: false };
  }

  // True start of the game: all ages except Heroes, no calamities. Heroes
  // is shown as the current card immediately (it's always the age the game
  // begins in, not something drawn from the pool), so history starts empty --
  // it'll move there once the first real draw happens.
  function newGame(state) {
    FH.AGE_IDS.forEach(function (id) { state.inDeck[id] = (id !== 'heroes'); });
    FH.CALAMITY_IDS.forEach(function (id) { state.inDeck[id] = false; });
    state.currentCard = 'heroes';
    state.gameOver = false;
    state.history = [];
  }

  // Infinite-mode reset after a calamity: all ages (incl. Heroes) return,
  // and all calamities are re-armed (available to be shuffled in again).
  // History is cleared -- which age comes next (possibly Heroes again) is
  // no longer a foregone conclusion, so nothing is seeded.
  function continuePlaying(state) {
    FH.AGE_IDS.forEach(function (id) { state.inDeck[id] = true; });
    FH.CALAMITY_IDS.forEach(function (id) { state.inDeck[id] = false; });
    state.currentCard = null;
    state.gameOver = false;
    state.history = [];
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
