// Wires buttons + checkboxes to the deck logic, UI rendering, and persistence.
window.FH = window.FH || {};

(function () {
  var state;
  var dom;

  // True while a draw's reveal animation is in flight. Manual controls
  // (checkboxes, Shuffle In Calamity, etc.) are locked for the duration so
  // a player can't change the deck out from under an in-progress draw.
  var busy = false;

  function refreshCommonUI() {
    FH.UI.syncCheckboxes(state);
    FH.UI.updateStatus(state);
    FH.UI.updateButtons(state, { locked: busy });
    FH.UI.renderDrawDeck(state);
  }

  function setBusy(value) {
    busy = value;
    refreshCommonUI();
  }

  // Plays the deal + flip animation for whatever is currently state.currentCard.
  // onRevealed (optional) fires once the reveal flip actually starts.
  function revealCurrentCard(onRevealed) {
    FH.Animation.playDraw(dom.stageCard, dom.stageCardInner, function () {
      FH.UI.setCardContent(state.currentCard);
    }, function () {
      FH.UI.renderHistory(state, { animateCurrent: true });
      if (onRevealed) onRevealed();
    });
  }

  // Order matters here: draw first from the deck as it currently stands,
  // reveal it, and only *after* that shuffle in a calamity (if the rules
  // call for one) -- so a newly shuffled-in calamity is never the card
  // that was just drawn, only ever a possibility starting next draw.
  function performDraw() {
    var result = FH.Deck.drawCard(state);
    FH.State.saveState(state);

    if (!result.drawnId) {
      refreshCommonUI();
      FH.UI.renderHistory(state, { includeCurrent: false });
      return;
    }

    setBusy(true);
    // Don't reveal the drawn card's name in the log until its flip actually starts.
    FH.UI.renderHistory(state, { includeCurrent: false });

    revealCurrentCard(function () {
      if (!state.gameOver) {
        FH.Deck.shuffleInCalamity(state);
      }
      FH.State.saveState(state);
      setBusy(false);
    });
  }

  function handleDraw() {
    if (state.gameOver) return;
    performDraw();
  }

  function handleContinue() {
    FH.Deck.continuePlaying(state);
    FH.State.saveState(state);
    // Immediately draw the next age -- no face-down card should sit idle here.
    performDraw();
  }

  function handleNewGame() {
    FH.Deck.newGame(state);
    FH.State.saveState(state);

    setBusy(true);
    FH.UI.renderHistory(state, { includeCurrent: false });
    // Heroes isn't drawn from the pool, but it should reveal the same way a draw does.
    revealCurrentCard(function () {
      setBusy(false);
    });
  }

  function handleCheckboxToggle(id, checked) {
    state.inDeck[id] = checked;
    FH.State.saveState(state);
    refreshCommonUI();
  }

  function handleShuffleInCalamity() {
    var addedId = FH.Deck.shuffleInCalamity(state);
    if (!addedId) return;

    FH.State.saveState(state);
    refreshCommonUI();
  }

  function init() {
    state = FH.State.loadState();
    dom = FH.UI.init();

    FH.UI.renderCheckboxes(state, handleCheckboxToggle);
    FH.UI.render(state);

    dom.btnDraw.addEventListener('click', handleDraw);
    dom.btnContinue.addEventListener('click', handleContinue);
    dom.btnNewGame.addEventListener('click', handleNewGame);
    dom.btnShuffleCalamity.addEventListener('click', handleShuffleInCalamity);

    // Clicking the deck pile itself is a shortcut for the Draw Card button.
    dom.drawDeck.addEventListener('click', function (e) {
      if (dom.btnDraw.disabled) return;
      if (!e.target.closest('.draw-deck-card')) return;
      handleDraw();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
