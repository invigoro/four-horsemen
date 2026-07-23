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
    dom.cardCornerIconTl = document.getElementById('card-corner-icon-tl');
    dom.cardCornerIconBr = document.getElementById('card-corner-icon-br');
    dom.statusLine = document.getElementById('status-line');
    dom.btnDraw = document.getElementById('btn-draw');
    dom.btnContinue = document.getElementById('btn-continue');
    dom.btnNewGame = document.getElementById('btn-newgame');
    dom.btnShuffleCalamity = document.getElementById('btn-shuffle-calamity');
    dom.gameOverBanner = document.getElementById('game-over-banner');
    dom.checkboxesAges = document.getElementById('checkboxes-ages');
    dom.checkboxesCalamities = document.getElementById('checkboxes-calamities');
    dom.historyList = document.getElementById('history-list');
    dom.historyEmptyHint = document.getElementById('history-empty-hint');
    dom.drawDeck = document.getElementById('draw-deck');
    return dom;
  }

  // Must stay in sync with the .draw-deck container height in css/styles.css
  // (sized to fit the worst case of all 11 cards stacked).
  var DRAW_DECK_OFFSET_PX = 18;

  // Renders a pile of full-size, face-down cards -- one per card still
  // drawable this round (undrawn ages + calamities currently shuffled in) --
  // stacked so each one peeks out from behind the card in front of it.
  function renderDrawDeck(state) {
    var count = FH.Deck.allIdsInDeck(state).length;
    dom.drawDeck.innerHTML = '';

    if (count === 0) {
      var empty = document.createElement('div');
      empty.className = 'draw-deck-empty';
      dom.drawDeck.appendChild(empty);
      return;
    }

    // k=0 is the frontmost/topmost card (zero offset); larger k sits
    // further back and further down, so it peeks out below the one in front.
    for (var k = count - 1; k >= 0; k--) {
      var mini = document.createElement('div');
      mini.className = 'draw-deck-card';
      mini.style.top = (k * DRAW_DECK_OFFSET_PX) + 'px';
      mini.style.zIndex = String(count - k);
      dom.drawDeck.appendChild(mini);
    }

    var topCard = dom.drawDeck.lastElementChild;
    var logo = document.createElement('img');
    logo.src = 'img/horse.png';
    logo.alt = '';
    logo.className = 'draw-deck-logo';
    topCard.appendChild(logo);
  }

  // Calamities display as "Age of Calamity" up top with their specific
  // name (e.g. "Famine") below -- ages just show their name up top.
  function headerLabel(card) {
    if (card.type === 'calamity') return 'Age of Calamity';
    return card.name;
  }

  function subLabel(card) {
    if (card.type === 'calamity') return card.name;
    return 'Age';
  }

  function historyLabel(card) {
    if (card.type === 'calamity') return 'Age of Calamity: ' + card.name;
    return card.name;
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
      dom.cardCornerIconTl.className = 'card-corner-icon corner-tl';
      dom.cardCornerIconBr.className = 'card-corner-icon corner-br';
      return;
    }

    dom.cardName.textContent = headerLabel(card);
    dom.cardType.textContent = subLabel(card);
    dom.stageCard.classList.toggle('is-calamity', card.type === 'calamity');

    dom.cardCornerIconTl.className = 'card-corner-icon corner-tl ' + card.icon;
    dom.cardCornerIconBr.className = 'card-corner-icon corner-br ' + card.icon;

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

  // opts.includeCurrent (default true): append the current card as a
  // highlighted entry. Pass false while a draw's reveal animation is still
  // playing, so the log doesn't spoil the result before the flip does.
  // opts.animateCurrent (default false): fade the current entry in --
  // used once the reveal animation actually starts.
  function renderHistory(state, opts) {
    opts = opts || {};
    var includeCurrent = opts.includeCurrent !== false;
    var showCurrent = includeCurrent && !!state.currentCard;

    dom.historyList.innerHTML = '';
    dom.historyEmptyHint.classList.toggle('hidden', state.history.length > 0 || showCurrent);

    state.history.forEach(function (id) {
      var li = document.createElement('li');
      li.textContent = historyLabel(FH.CARDS_BY_ID[id]);
      dom.historyList.appendChild(li);
    });

    if (showCurrent) {
      var li = document.createElement('li');
      li.className = 'history-current' + (opts.animateCurrent ? ' fade-in' : '');

      var icon = document.createElement('i');
      icon.className = 'fa-solid fa-chevron-right';
      icon.setAttribute('aria-hidden', 'true');

      li.appendChild(icon);
      li.appendChild(document.createTextNode(' ' + historyLabel(FH.CARDS_BY_ID[state.currentCard])));
      dom.historyList.appendChild(li);
    }
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
    renderHistory(state);
    renderDrawDeck(state);
  }

  FH.UI = {
    init: init,
    dom: dom,
    setCardContent: setCardContent,
    renderCheckboxes: renderCheckboxes,
    syncCheckboxes: syncCheckboxes,
    updateStatus: updateStatus,
    updateButtons: updateButtons,
    renderHistory: renderHistory,
    renderDrawDeck: renderDrawDeck,
    render: render
  };
})();
