// Game state + cookie persistence.
window.FH = window.FH || {};

(function () {
  var COOKIE_NAME = 'fh_state';
  var COOKIE_DAYS = 365;

  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  // Deck at the true start of a game: all ages except Heroes, no calamities.
  function defaultState() {
    var inDeck = {};
    FH.AGE_IDS.forEach(function (id) { inDeck[id] = (id !== 'heroes'); });
    FH.CALAMITY_IDS.forEach(function (id) { inDeck[id] = false; });
    return {
      inDeck: inDeck,
      drawsThisCycle: 0,
      currentCard: null,
      gameOver: false
    };
  }

  function isValidState(s) {
    if (!s || typeof s !== 'object' || !s.inDeck) return false;
    var ok = true;
    FH.CARDS.forEach(function (c) {
      if (typeof s.inDeck[c.id] !== 'boolean') ok = false;
    });
    return ok;
  }

  function loadState() {
    var raw = getCookie(COOKIE_NAME);
    if (!raw) return defaultState();
    try {
      var parsed = JSON.parse(raw);
      if (!isValidState(parsed)) return defaultState();
      return parsed;
    } catch (e) {
      return defaultState();
    }
  }

  function saveState(state) {
    setCookie(COOKIE_NAME, JSON.stringify(state), COOKIE_DAYS);
  }

  FH.State = {
    defaultState: defaultState,
    loadState: loadState,
    saveState: saveState
  };
})();
