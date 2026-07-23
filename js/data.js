// Card definitions for the age deck.
// `img` paths are placeholders -- point them at real art later and the UI
// will pick it up automatically (falls back to a text placeholder if missing).
window.FH = window.FH || {};

// `icon` is a Font Awesome 6 Free (solid style) class string, used as a
// corner glyph in lieu of a playing-card suit -- suit itself is unused by
// the game rules and only kept for reference to the physical card deck.
FH.CARDS = [
  { id: 'heroes',            name: 'Age of Heroes',      type: 'age',      img: 'img/heroes.png',            icon: 'fa-solid fa-dragon' },
  { id: 'conquest',          name: 'Age of Conquest',    type: 'age',      img: 'img/conquest.png',           icon: 'fa-solid fa-shield-halved' },
  { id: 'reason',            name: 'Age of Reason',      type: 'age',      img: 'img/reason.png',             icon: 'fa-solid fa-brain' },
  { id: 'renaissance',       name: 'Renaissance Age',    type: 'age',      img: 'img/renaissance.png',        icon: 'fa-solid fa-palette' },
  { id: 'discovery',         name: 'Age of Discovery',   type: 'age',      img: 'img/discovery.png',          icon: 'fa-solid fa-compass' },
  { id: 'dark',              name: 'Dark Age',           type: 'age',      img: 'img/dark.png',               icon: 'fa-solid fa-moon' },
  { id: 'prosperity',        name: 'Age of Prosperity',  type: 'age',      img: 'img/prosperity.png',         icon: 'fa-solid fa-coins' },

  { id: 'pestilence',        name: 'Pestilence',         type: 'calamity', suit: 'clubs',    img: 'img/pestilence.png',        icon: 'fa-solid fa-virus' },
  { id: 'famine',            name: 'Famine',             type: 'calamity', suit: 'spades',   img: 'img/famine.png',            icon: 'fa-solid fa-wheat-awn' },
  { id: 'conquest_calamity', name: 'Conquest',           type: 'calamity', suit: 'diamonds', img: 'img/conquest_calamity.png', icon: 'fa-solid fa-fire' },
  { id: 'death',             name: 'Death',              type: 'calamity', suit: 'hearts',   img: 'img/death.png',             icon: 'fa-solid fa-skull-crossbones' }
];

FH.CARDS_BY_ID = {};
FH.CARDS.forEach(function (card) {
  FH.CARDS_BY_ID[card.id] = card;
});

FH.AGE_IDS = FH.CARDS.filter(function (c) { return c.type === 'age'; }).map(function (c) { return c.id; });
FH.CALAMITY_IDS = FH.CARDS.filter(function (c) { return c.type === 'calamity'; }).map(function (c) { return c.id; });
