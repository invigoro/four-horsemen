// DOM rendering: card face, checkbox panel, status line, button visibility.
window.FH = window.FH || {};

(function () {
  var dom = {};

  function init() {
    dom.stageCard = document.getElementById('stage-card');
    dom.stageCardInner = document.getElementById('stage-card-inner');
    dom.cardName = document.getElementById('card-name');
    dom.cardType = document.getElementById('card-type');
    dom.cardImg = document.getElementById('card-img');
    dom.cardImgPlaceholder = document.getElementById('card-img-placeholder');
    dom.statusLine = document.getElementById('status-line');
    dom.btnDraw = document.getElementById('btn-draw');
    dom.btnContinue = document.getElementById('btn-continue');
    dom.btnNewGame = document.getElementById('btn-newgame');
    dom.btnShuffleCalamity = document.getElementById('btn-shuffle-calamity');
    dom.gameOverBanner = document.getElementById('game-over-banner');
    dom.checkboxesAges = document.getElementById('checkboxes-ages');
    dom.checkboxesCalamities = document.getElementById('checkboxes-calamities');
    return dom;
  }

  function typeLabel(card) {
    if (card.type === 'calamity') return 'Calamity — ' + card.suit;
    return 'Age';
  }

  // Swaps the front face's content. Safe to call while the back is showing.
  function setCardContent(cardId) {
    var card = cardId ? FH.CARDS_BY_ID[cardId] : null;

    if (!card) {
      dom.cardName.textContent = '';
      dom.cardType.textContent = '';
      dom.cardImg.style.display = 'none';
      dom.cardImg.src = '';
      dom.cardImgPlaceholder.style.display = 'none';
      return;
    }

    dom.cardName.textContent = card.name;
    dom.cardType.textContent = typeLabel(card);
    dom.stageCard.classList.toggle('is-calamity', card.type === 'calamity');

    dom.cardImgPlaceholder.style.display = 'none';
    dom.cardImgPlaceholder.textContent = card.name;
    dom.cardImg.style.display = '';
    dom.cardImg.alt = card.name;
    dom.cardImg.onerror = function () {
      dom.cardImg.style.display = 'none';
      dom.cardImgPlaceholder.style.display = 'flex';
    };
    dom.cardImg.src = card.img;
  }

  function renderCheckboxes(state, onToggle) {
    dom.checkboxesAges.innerHTML = '';
    dom.checkboxesCalamities.innerHTML = '';

    FH.CARDS.forEach(function (card) {
      var container = card.type === 'age' ? dom.checkboxesAges : dom.checkboxesCalamities;

      var label = document.createElement('label');
      label.className = 'checkbox-row';

      var input = document.createElement('input');
      input.type = 'checkbox';
      input.dataset.id = card.id;
      input.checked = !!state.inDeck[card.id];
      input.addEventListener('change', function () {
        onToggle(card.id, input.checked);
      });

      var span = document.createElement('span');
      span.textContent = card.name;

      label.appendChild(input);
      label.appendChild(span);
      container.appendChild(label);
    });
  }

  function syncCheckboxes(state) {
    var inputs = document.querySelectorAll('#checkboxes-ages input, #checkboxes-calamities input');
    inputs.forEach(function (input) {
      input.checked = !!state.inDeck[input.dataset.id];
    });
  }

  function updateStatus(state) {
    var deckCount = FH.Deck.allIdsInDeck(state).length;
    var calamitiesAvailable = FH.Deck.calamityIdsInDeck(state).length + FH.Deck.calamityIdsNotInDeck(state).length;
    var calamitiesArmed = FH.Deck.calamityIdsNotInDeck(state).length;

    dom.statusLine.textContent =
      'Cards in deck: ' + deckCount +
      ' · Calamities still available to shuffle in: ' + calamitiesArmed + '/' + calamitiesAvailable;
  }

  function updateButtons(state) {
    var deckCount = FH.Deck.allIdsInDeck(state).length;

    dom.btnDraw.disabled = state.gameOver || deckCount === 0;
    dom.btnDraw.title = (!state.gameOver && deckCount === 0) ? 'No cards left in the deck' : '';

    dom.btnContinue.classList.toggle('hidden', !state.gameOver);
    dom.gameOverBanner.classList.toggle('hidden', !state.gameOver);

    var calamitiesArmed = FH.Deck.calamityIdsNotInDeck(state).length;
    dom.btnShuffleCalamity.disabled = calamitiesArmed === 0;
    dom.btnShuffleCalamity.title = calamitiesArmed === 0 ? 'All calamities are already in the deck' : '';
  }

  function render(state) {
    setCardContent(state.currentCard);
    if (state.currentCard) {
      dom.stageCardInner.classList.add('flipped');
    } else {
      dom.stageCardInner.classList.remove('flipped');
    }
    syncCheckboxes(state);
    updateStatus(state);
    updateButtons(state);
  }

  FH.UI = {
    init: init,
    dom: dom,
    setCardContent: setCardContent,
    renderCheckboxes: renderCheckboxes,
    syncCheckboxes: syncCheckboxes,
    updateStatus: updateStatus,
    updateButtons: updateButtons,
    render: render
  };
})();
