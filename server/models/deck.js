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
      { value: 'A',description: "walk 1, walk 11, go out", gameValue: [1,11,0], name: 'Ace', sortValue: 14 },
      { value: '2',description: "walk 2", gameValue: [2], name: 'Two', sortValue: 2 },
      { value: '3',description: "walk 3", gameValue: [3], name: 'Three', sortValue: 3 },
      { value: '4',description: "walk 4 backwards", gameValue: [-4], name: 'Four', sortValue: 4 },
      { value: '5',description: "walk 5", gameValue: [5], name: 'Five', sortValue: 5 },
      { value: '6',description: "walk 6", gameValue: [6], name: 'Six', sortValue: 6 },
      { value: '7',description: "walk between 1-7 with various balls", gameValue: [1,2,3,4,5,6,7], name: 'Seven', sortValue: 7 },
      { value: '8',description: "walk 8", gameValue: [8], name: 'Eight', sortValue: 8 },
      { value: '9',description: "walk 9", gameValue: [9], name: 'Nine', sortValue: 9 },
      { value: '10',description: "walk 10", gameValue: [10], name: 'Ten', sortValue: 10 },
      { value: 'J',description: "swap the position from one of your ball with another ball", gameValue: [null], name: 'Jack', sortValue: 11 },
      { value: 'Q',description: "walk 12", gameValue: [12], name: 'Queen', sortValue: 12 },
      { value: 'K',description: "walk 13 or go out", gameValue: [13,0], name: 'King', sortValue: 13 }
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
    const suitOrder = { '♠': 1, '♥': 2, '♦': 3, '♣': 4 };
    this.cards.sort((a, b) => {
      if (suitOrder[a.suit.symbol] === suitOrder[b.suit.symbol]) {
        return a.sortValue - b.sortValue;
      }
      return suitOrder[a.suit] - suitOrder[b.suit];
    });
  }
}

module.exports = { Deck, Card }