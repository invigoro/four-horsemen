// Wires buttons + checkboxes to the deck logic, UI rendering, and persistence.
window.FH = window.FH || {};

(function () {
  var state;
  var dom;

  function handleDraw() {
    if (state.gameOver) return;

    var result = FH.Deck.drawCard(state);
    FH.State.saveState(state);

    FH.UI.syncCheckboxes(state);
    FH.UI.updateStatus(state);
    FH.UI.updateButtons(state);

    if (result.drawnId) {
      FH.Animation.playDraw(dom.stageCard, dom.stageCardInner, function () {
        FH.UI.setCardContent(state.currentCard);
      });
    }
  }

  function resetStageVisual() {
    FH.Animation.resetCard(dom.stageCard, dom.stageCardInner);
    FH.UI.setCardContent(null);
    FH.UI.syncCheckboxes(state);
    FH.UI.updateStatus(state);
    FH.UI.updateButtons(state);
  }

  function handleContinue() {
    FH.Deck.continuePlaying(state);
    FH.State.saveState(state);
    resetStageVisual();
  }

  function handleNewGame() {
    FH.Deck.newGame(state);
    FH.State.saveState(state);
    resetStageVisual();
  }

  function handleCheckboxToggle(id, checked) {
    state.inDeck[id] = checked;
    FH.State.saveState(state);
    FH.UI.updateStatus(state);
    FH.UI.updateButtons(state);
  }

  function handleShuffleInCalamity() {
    var addedId = FH.Deck.shuffleInCalamity(state);
    if (!addedId) return;

    FH.State.saveState(state);
    FH.UI.syncCheckboxes(state);
    FH.UI.updateStatus(state);
    FH.UI.updateButtons(state);
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
