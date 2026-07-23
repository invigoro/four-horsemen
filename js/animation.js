// CSS-3D card animation: flip-down (if a card is showing) -> swap content ->
// deal-in -> flip-up to reveal. Durations must match css/styles.css.
window.FH = window.FH || {};

(function () {
  var FLIP_MS = 500;
  var DEAL_MS = 450;
  var FLIP_UP_DELAY_MS = 30;

  // cardEl:      outer .card element (handles the deal slide-in)
  // cardInnerEl: .card-inner element (handles the 3D flip)
  // applyContentFn: called once the back is showing, to swap the front face's content
  // onDone: called once the reveal flip has started
  function playDraw(cardEl, cardInnerEl, applyContentFn, onDone) {
    var wasFlipped = cardInnerEl.classList.contains('flipped');

    function dealIn() {
      applyContentFn();

      cardEl.classList.remove('dealt', 'dealing');
      void cardEl.offsetWidth; // force reflow so the animation restarts
      cardEl.classList.add('dealing');

      setTimeout(function () {
        cardEl.classList.remove('dealing');
        cardEl.classList.add('dealt');

        setTimeout(function () {
          cardInnerEl.classList.add('flipped');
          if (onDone) onDone();
        }, FLIP_UP_DELAY_MS);
      }, DEAL_MS);
    }

    if (wasFlipped) {
      cardInnerEl.classList.remove('flipped');
      setTimeout(dealIn, FLIP_MS);
    } else {
      dealIn();
    }
  }

  FH.Animation = {
    playDraw: playDraw
  };
})();
