function cardIdGenerator() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

class Card {
  constructor(suit, value, description, gameValue, name, sortValue) {
    this.suit = suit;
    this.value = value;
    this.description = description;
    this.gameValue = gameValue;
    this.name = name;
    this.sortValue = sortValue;
    this.id = cardIdGenerator();
  }

  toString() {
    return `${this.description} (${this.suit}${this.value})`;
  }
}

class Deck {
  constructor(emptyDeck) {
    this.suits = [
      { symbol: '♠', name: 'spades' },
      { symbol: '♥', name: 'hearts' },
      { symbol: '♦', name: 'diamonds' },
      { symbol: '♣', name: 'clubs' }
    ];
    this.values = [
      { value: 'A',description: "Ziehe eine Kugel ein Feld oder elf Felder vor, oder verlasse das Haus.", gameValue: [1,11,0], name: 'Ace', sortValue: 14 },
      { value: '2',description: "Ziehe eine Kugel zwei Felder vor.", gameValue: [2], name: 'Two', sortValue: 2 },
      { value: '3',description: "Ziehe eine Kugel drei Felder vor.", gameValue: [3], name: 'Three', sortValue: 3 },
      { value: '4',description: "Ziehe eine Kugel vier Felder zurück.", gameValue: [-4], name: 'Four', sortValue: 4 },
      { value: '5',description: "Ziehe eine Kugel fünf Felder vor.", gameValue: [5], name: 'Five', sortValue: 5 },
      { value: '6',description: "Ziehe eine Kugel sechs Felder vor.", gameValue: [6], name: 'Six', sortValue: 6 },
      { value: '7',description: "Du kannst sieben Schritte auf verschiedene Kugeln verteilen. Kugeln, an denen vorbei gestept wird, werden zurück nach Hause geschickt.", gameValue: [7,6,5,4,3,2,1], name: 'Seven', sortValue: 7 },
      { value: '8',description: "Ziehe eine Kugel acht Felder vor.", gameValue: [8], name: 'Eight', sortValue: 8 },
      { value: '9',description: "Ziehe eine Kugel neun Felder vor.", gameValue: [9], name: 'Nine', sortValue: 9 },
      { value: '10',description:"Ziehe eine Kugel zehn Felder vor.",gameValue: [10],name: 'Ten', sortValue: 10 },
      { value: 'J',description: "Eine eigene mit einer anderen Kugel vertauschen. Fremde Kugeln, die auf ihrem Rausgehpunkt platziert sind, sind ausgeschlossen.", gameValue: [100], name: 'Jack', sortValue: 11 },
      { value: 'Q',description: "Ziehe eine Kugel zwölf Felder vor.", gameValue: [12], name: 'Queen', sortValue: 12 },
      { value: 'K',description: "Ziehe eine Kugel dreizehn Felder vor, oder verlasse das Haus.", gameValue: [13,0], name: 'King', sortValue: 13 }
    ];
    this.cards = [];
    if (!emptyDeck) this._createDeck();
  }

  _createDeck() {
    this.cards = [];
    this.suits.forEach(suit => {
      this.values.forEach(v => {
        this.cards.push(new Card(suit, v.value, v.description, v.gameValue, v.name, v.sortValue));
      });
    });
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw() {
    return this.cards.pop();
  }

  reset() {
    this._createDeck();
    this.shuffle();
  }
  sort() {
    const suitOrder = { '♠': 1, '♣': 2, '♦': 3, '♥': 4 };
    this.cards.sort((a, b) => {
      const suitA = suitOrder[a.suit.symbol];
      const suitB = suitOrder[b.suit.symbol];
      if (suitA === suitB) {
      return a.sortValue - b.sortValue;
      }
      return suitA - suitB;
    });
  }
  removeUnnecessaryDeckInformation() {
    this.values = null;
    this.suits = null;
  }
}

module.exports = { Deck, Card }