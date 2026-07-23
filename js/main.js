// Wires buttons + checkboxes to the deck logic, UI rendering, and persistence.
window.FH = window.FH || {};

(function () {
  var state;
  var dom;

  function refreshCommonUI() {
    FH.UI.syncCheckboxes(state);
    FH.UI.updateStatus(state);
    FH.UI.updateButtons(state);
    FH.UI.renderDrawDeck(state);
  }

  // Plays the deal + flip animation for whatever is currently state.currentCard.
  function revealCurrentCard() {
    FH.Animation.playDraw(dom.stageCard, dom.stageCardInner, function () {
      FH.UI.setCardContent(state.currentCard);
    }, function () {
      FH.UI.renderHistory(state, { animateCurrent: true });
    });
  }

  function performDraw() {
    var result = FH.Deck.drawCard(state);
    FH.State.saveState(state);

    refreshCommonUI();
    // Don't reveal the drawn card's name in the log until its flip actually starts.
    FH.UI.renderHistory(state, { includeCurrent: false });

    if (result.drawnId) {
      revealCurrentCard();
    }
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

    refreshCommonUI();
    FH.UI.renderHistory(state, { includeCurrent: false });
    // Heroes isn't drawn from the pool, but it should reveal the same way a draw does.
    revealCurrentCard();
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
  }

  document.addEventListener('DOMContentLoaded', init);
})();
