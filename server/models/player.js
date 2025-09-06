const { Deck } = require('./deck')
const { Sphere } = require('./sphere')

class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.deck = new Deck(true);
    this.ownedSpheres = [new Sphere(color, 1),new Sphere(color, 2),new Sphere(color, 3),new Sphere(color, 4)]
    if (color == "red"){
        this.partnerColor = "yellow"
    }else if(color == "yellow"){
        this.partnerColor = "red"
    }else if(color == "blue"){
        this.partnerColor = "green"
    }else if(color == "green"){
        this.partnerColor = "blue"
    }
    this.playerid = this.name + "_" + this.color;
  }

  // Karte von einem Spielfeld-Deck ziehen
  drawCard(deck) {
    const card = deck.draw();
    if (card) {
      this.deck.push(card);
      return card;
    } else {
      console.log(`${this.name} kann keine Karte ziehen – Deck ist leer.`);
      return null;
    }
  }

  // Eine Karte aus der Hand spielen
  playCard(index = 0) {
    if (this.deck.length === 0) {
      console.log(`${this.name} hat keine Karten zum Spielen.`);
      return null;
    }
    if (index < 0 || index >= this.deck.length) {
      console.log(`Ungültiger Index: ${index}`);
      return null;
    }
    return this.deck.splice(index, 1)[0];
  }

  handSize() {
    return this.deck.length;
  }
}
module.exports = { Player }