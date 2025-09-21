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

  drawCard(deck) {
    const card = deck.draw();
    if (card) {
      this.deck.cards.push(card);
      return card;
    } else {
      return null;
    }
  }

  playCard(index = 0) {
    if (this.deck.length === 0) {
      return null;
    }
    if (index < 0 || index >= this.deck.length) {
      return null;
    }
    return this.deck.splice(index, 1)[0];
  }

  // handSize() {
  //   return this.deck.length;
  // }
  regeneratePlayerId(){
    this.playerid = this.name + "_" + this.color;
  }
  // playerFree(){
  //   return this.name == null
  // }
  checkMoveSpheresSeven(game, moveProfiles){
    if(!(game.gameStatus == 1)){
      return {test: false, message: "Spiel nicht im Spielmodus"}
    }
    if(!(game.currentPlayer == this)){
      return {test: false, message: "Nicht am Zug"}
    }
    if(!(moveProfiles.color.toLowerCase() == this.color)){
      return {test:false, message: "Falsche Kugelfarbe"} //theoretically not possible
    }
    if (!(this.deck.cards.some(card => card.id === moveProfiles.cardId))) {
      return {test:false, message: "Karte nicht in der Hand des Spielers"};
    }
    let anyError
    let walkDisctance
    moveProfiles.spheres.forEach(sp => {
      var sphere = this.ownedSpheres[(sp.sphereId - 1)]
      if(!(sp.sphereId == sphere.sphereId)){
        return anyError = {test:false, message: "Falsche Kugel ID"}
      }
      if(!(sp.pointId == sphere.position)){
        return anyError = {test:false, message: "Kugel nicht an angegebener Position"}
      }
      let currentPosField = game.field.points[findPosInArray(game.field.points, sphere.position)]
      let destinationField = game.field.points[findPosInArray(game.field.points, sp.destinationId)]
      if(!currentPosField || !destinationField){
        return anyError = {test: false, extra: "Ungueltige Feld-ID."}
      }
      var card = this.deck.cards.find(card => card.id === moveProfiles.cardId)
      if(!(card.gameValue[0] == 7)){
        return anyError = {test: false, extra: "Interner Routing error, bitte kontaktiere das DEV-Team!"} // here only seven is heandled
      }
      if(!destinationField.isFree() && destinationField.sphereColorOn.toLowerCase() == sphere.color.toLowerCase()){
        return anyError = {test: false, extra: "Das Zielfeld wird durch die eigene Kugel belegt."} //destination occupied by own sphere
      }
      if(destinationField.isFinishPoint && (destinationField.color.toLowerCase() == sphere.color.toLowerCase())){
        let watchField = destinationField
        while(watchField.pointId !== currentPosField.pointId){
          if(!watchField.isPassable()){
            return anyError = {test: false, extra: "Der angestrebte Pfad kann nicht bestritten werden."}
          }
          watchField = game.field.points[findPosInArray(game.field.points, watchField.prevPointId)]
          walkDisctance++
          if(watchField == undefined){
            return anyError = {test: false, extra: "eigentlich ist dieser Fehler nicht moeglich."}
          }
        }
      }else{
        let watchField = destinationField
        while(watchField.pointId !== currentPosField.pointId){
          if(!watchField.isPassable()){
            return anyError = {test: false, extra: "Der angestrebte Pfad kann nicht bestritten werden."}
          }
          watchField = game.field.points[findPosInArray(game.field.points, watchField.prevPointId)]
          walkDisctance++
          if(watchField == undefined){
            return anyError = {test: false, extra: "eigentlich ist dieser Fehler nicht moeglich."}
          }
        }
      }
    });
    if(!anyError.test){
      return {test:false, message: anyError.message}
    }
    if(walkDisctance > 7 ){
      return { test: false, message: "Mit dieser Karte kannst du nicht so weit laufen."}
    }
    if(walkDisctance < 7 && !this.checkSevenExpirable(moveProfiles)){
      return { test: false, message: "Du musst den vollen moeglichen Wert der Karte laufen"}
    }
    if(!game.nextPlayer()){
      return {test:false, message: "Naechster Spieler konnte nicht ermittelt werden. " + checkedMove.extra}
    }
    return {test: true, extra: ""};
  }
  checkSevenExpirable(moveProfiles){
    var result = true
    moveProfiles.spheres.forEach(sp => {
      if(!result) return
      var destinationField = game.field.points[findPosInArray(game.field.points, sp.destinationId)]
      var nextField = game.field.points[findPosInArray(game.field.points, destinationField.nextField)]
      if(!nextField) return
      if(!nextField.isPassable()) return
      //check other spheres
      result = false
    })
    return result
  }
}
module.exports = { Player }