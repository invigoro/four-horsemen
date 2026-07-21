// Card definitions for the age deck.
// `img` paths are placeholders -- point them at real art later and the UI
// will pick it up automatically (falls back to a text placeholder if missing).
window.FH = window.FH || {};

FH.CARDS = [
  { id: 'heroes',            name: 'Age of Heroes',      type: 'age',      img: 'img/heroes.png' },
  { id: 'conquest',          name: 'Age of Conquest',    type: 'age',      img: 'img/conquest.png' },
  { id: 'reason',            name: 'Age of Reason',      type: 'age',      img: 'img/reason.png' },
  { id: 'renaissance',       name: 'Renaissance Age',    type: 'age',      img: 'img/renaissance.png' },
  { id: 'discovery',         name: 'Age of Discovery',   type: 'age',      img: 'img/discovery.png' },
  { id: 'dark',              name: 'Dark Age',           type: 'age',      img: 'img/dark.png' },
  { id: 'prosperity',        name: 'Age of Prosperity',  type: 'age',      img: 'img/prosperity.png' },

  { id: 'pestilence',        name: 'Pestilence',         type: 'calamity', suit: 'clubs',    img: 'img/horse.png' },
  { id: 'famine',            name: 'Famine',             type: 'calamity', suit: 'spades',   img: 'img/horse.png' },
  { id: 'conquest_calamity', name: 'Conquest',           type: 'calamity', suit: 'diamonds', img: 'img/horse.png' },
  { id: 'death',             name: 'Death',              type: 'calamity', suit: 'hearts',   img: 'img/horse.png' }
];

FH.CARDS_BY_ID = {};
FH.CARDS.forEach(function (card) {
  FH.CARDS_BY_ID[card.id] = card;
});

FH.AGE_IDS = FH.CARDS.filter(function (c) { return c.type === 'age'; }).map(function (c) { return c.id; });
FH.CALAMITY_IDS = FH.CARDS.filter(function (c) { return c.type === 'calamity'; }).map(function (c) { return c.id; });
