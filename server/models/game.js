/*
gameStatus:
    0 = not started
    1 = started and running
    2 = paused
    3 = stoped
    4 = finished
    5 = swappingCards
    6 = waitForPlayers
*/
const { Player } = require('./player')
const { Deck } = require('./deck')
const { Field } = require('./field');
const { FlowControl } = require('./flow')

class Game {
    constructor(lifecycleId) {
        this.name = null
        this.lifecycleId = lifecycleId
        this.gameId = null;
        this.player1red = new Player(null, "red");
        this.player2blue = new Player(null, "blue");
        this.player3yellow = new Player(null, "yellow");
        this.player4green = new Player(null, "green");
        this.flowControl = new FlowControl();
        this.players = [this.player1red, this.player2blue, this.player3yellow, this.player4green];
        this.deck = new Deck(false);
        this.deck.shuffle();
        this.field = new Field();
        this.roundSwapLog = [];
        this.currentPlayer = null;
        this.startingPlayer = null;
        this.givingPlayer = null;
        this.playedCards = [];
        this.round = 0;
        this.startableGame = false;
        this.gameStatus = 0
    }

    // Nächster Spieler
    //ig this is not used delete?
    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.flowControl.resetStatesForNextPlayer();
        return this.currentPlayer;
        
    }
    goIntoChangingState(){ // 5
        this.gameStatus = 5
        this.flowControl.state1.state = 0
        this.flowControl.state2.state = 0
        this.flowControl.state3.state = 0
        this.flowControl.state4.state = 0
        this.flowControl.state5.state = 0   
    }
    changeCards(){
        this.player3yellow.deck.cards = this.player3yellow.deck.cards.concat(this.player1red.changingCard)
        this.player1red.deck.cards = this.player1red.deck.cards.concat(this.player3yellow.changingCard)
        this.player2blue.deck.cards = this.player2blue.deck.cards.concat(this.player4green.changingCard)
        this.player4green.deck.cards = this.player4green.deck.cards.concat(this.player2blue.changingCard)

        this.player1red.changingCard = null
        this.player2blue.changingCard = null
        this.player3yellow.changingCard = null
        this.player4green.changingCard = null
    }
    goIntoMainState(){ // 1
        this.gameStatus = 1
        this.flowControl.state1.state = 1
        this.flowControl.state2.state = 0
        this.flowControl.state3.state = 0
        this.flowControl.state4.state = 0
        this.flowControl.state5.state = 0
    }
    isChangingFinished(){
        var finished = true
        this.players.forEach(player => {
            if(player.changingState != 1){
                finished = false
            }
        });
        if(finished){
            this.gameStatus = 1
            this.players.forEach(player => {
                player.changingState = -1
                player.changingCard = null
            });
        }
        return finished
    }
    
    endRound() {
        console.log(`Runde ${this.round} beendet. Gespielte Karten:`);
        this.playedCards.forEach(entry =>
        console.log(`- ${entry.player}: ${entry.card.toString()}`)
        );

        this.playedCards = [];
        //this.startingPlayer = returnNextPlayer(this.startingPlayer)
        //this.startingPlayer = this.currentPlayer;
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
    checkColorFree(color, wantName){
        if (color == "red" && this.player1red.name !== null && this.player1red.name !== wantName) {
            return false
        }else if (color == "blue" && this.player2blue.name !== null && this.player2blue.name !== wantName) {
            return false
        }else if (color == "yellow" && this.player3yellow.name !== null && this.player3yellow.name !== wantName) {
            return false
        }else if (color == "green" && this.player4green.name !== null && this.player4green.name !== wantName) {
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
    initStartGame(){
        this.round = 1
        this.gameStatus = 5
        for (let i = 0; i < 5; i++) {
            this.player1red.drawCard(this.deck);
            this.player2blue.drawCard(this.deck);
            this.player3yellow.drawCard(this.deck);
            this.player4green.drawCard(this.deck);
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
    nextPlayer(){
        this.flowControl.resetStatesForNextPlayer();
        this.currentPlayer.playedCard = null
        if(this.currentPlayer == this.player1red){
            this.currentPlayer = this.player2blue
            return true
        }else if(this.currentPlayer == this.player2blue){
            this.currentPlayer = this.player3yellow
            return true
        }else if(this.currentPlayer == this.player3yellow){
            this.currentPlayer = this.player4green
            return true
        }else if(this.currentPlayer == this.player4green){
            this.currentPlayer = this.player1red
            return true
        }else{
            return false
        }
    }
    returnNextPlayer(inp){
        if(inp == this.player1red){
            return this.player2blue
        }else if(inp == this.player2blue){
            return this.player3yellow
        }else if(inp == this.player3yellow){
            return this.player4green
        }else if(inp == this.player4green){
            return this.player1red
        }
    }
    executeKillBumpDestroySendHomeTurnLightOffKnockOffMurderAssasinateSlaughterSlaySphere(desFieldId){
        const point = this.field.points.find(p => p.pointId == desFieldId);
        if(!point) {
            console.log(desFieldId, this.field.points[0])
            return {exec: false, message: 'Internal Server Error'}  
        } 
        if(!point.isSphereOn) return {exec: true, message: ''}
        const playerOn = this.players.find(pl => pl.color.toLowerCase() === point.sphereColorOn.toLowerCase())
        const sphereOn = playerOn.ownedSpheres.find(s => s.position === desFieldId)
        if(!sphereOn) return {exec: false, message: 'Internal Server Error'}
        sphereOn.sendHome()
        point.removeSphere()
        return {exec: true, message: ''}
    }
}
module.exports = { Game };