/*
gameStatus:
    0 = not started
    1 = started and running
    2 = paused
    3 = stoped
    4 = finished
*/
const { Player } = require('./player')
const { Deck } = require('./deck')
const { Field } = require('./field');

class Game {
    constructor(lifecycleId) {
        this.name = null
        this.lifecycleId = lifecycleId
        this.gameId = null;
        this.player1red = new Player(null, "red");
        this.player2blue = new Player(null, "blue");
        this.player3yellow = new Player(null, "yellow");
        this.player4green = new Player(null, "green");
        this.players = [this.player1red, this.player2blue, this.player3yellow, this.player4green];
        this.deck = new Deck(false);
        this.deck.shuffle();
        this.field = new Field();
        
        this.currentPlayer = null;
        this.startingPlayer = null;
        this.givingPlayer = null;
        this.playedCards = [];
        this.round = 0;
        this.startableGame = false;
        this.gameStatus = 0
    }

    // Nächster Spieler
    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        return this.currentPlayer;
    }

    // Runde beenden
    endRound() {
        console.log(`Runde ${this.round} beendet. Gespielte Karten:`);
        this.playedCards.forEach(entry =>
        console.log(`- ${entry.player}: ${entry.card.toString()}`)
        );

        this.playedCards = [];
        this.startingPlayer = this.currentPlayer;
        this.round++;
    }
    addPlayer(name, color) {
        if (color == "red" && this.player1red.name !== null) {
            return false
        }else if (color == "blue" && this.player2blue.name !== null) {
            return false
        }else if (color == "yellow" && this.player3yellow.name !== null) {
            return false
        }else if (color == "green" && this.player4green.name !== null) {
            return false
        }
        var returnPlayer = null
        switch (color) {
            case "red":
                this.player1red.name = name
                this.player1red.regeneratePlayerId()
                returnPlayer = this.player1red
                break;
            case "blue":
                this.player2blue.name = name
                this.player2blue.regeneratePlayerId()
                returnPlayer = this.player2blue
                break;
            case "yellow":
                this.player3yellow.name = name
                this.player3yellow.regeneratePlayerId()
                returnPlayer = this.player3yellow
                break;
            case "green":
                this.player4green.name = name
                this.player4green.regeneratePlayerId()
                returnPlayer = this.player4green
                break;
        }
        this.checkStartable()
        return returnPlayer
    }
    checkColorFree(color){
        if (color == "red" && this.player1red.name !== null) {
            return false
        }else if (color == "blue" && this.player2blue.name !== null) {
            return false
        }else if (color == "yellow" && this.player3yellow.name !== null) {
            return false
        }else if (color == "green" && this.player4green.name !== null) {
            return false
        }
        return true
    }
    checkStartable(){
        if (this.player1red.name !== null && this.player2blue.name !== null && this.player3yellow.name !== null && this.player4green.name !== null){
            this.startableGame = true
        }else{
            this.startableGame = false
        }
    }
    rejoinPlayer(name, color){
        switch (color) {
            case "red":
                if (this.player1red.name == name){
                    return true
                }
                break;
            case "blue":
                if (this.player2blue.name == name){
                    return true
                }
                break;
            case "yellow":
                if (this.player3yellow.name == name){
                    return true
                }
                break;
            case "green":
                if (this.player4green.name == name){
                    return true
                }
                break;
        }
        return null
    }
}
module.exports = { Game };