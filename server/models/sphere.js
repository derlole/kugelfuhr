findPosInArray = (array, id) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].pointId == id) {
            return i;
        }
    }
    return -1;
}
class Sphere {
    constructor(color, sphereId){
        this.color = color
        this.sphereId = sphereId
        this.home = true
        this.finish = false
        this.position = 0
        this.finallyNotMovable = false;
        this._initPos(color, sphereId)
    }
    _initPos(color, sphereId){
        if (color == "red"){
            this.position = 10 + sphereId
        }else if(color == "yellow"){
            this.position = 30 + sphereId
        }else if(color == "blue"){
            this.position = 20 + sphereId
        }else if(color == "green"){
            this.position = 40 + sphereId
        }
    }
    isSwappable(extended){
        if(this.position < 100){ // home or finish fields
            return false
        }
        if(extended){ // is foreignSphere check for homeExitfieldPosition
            if(this.color == "red" && this.position == 1001){
                return false
            }else if(this.color == "blue" && this.position == 1026){
                return false
            }else if(this.color == "yellow" && this.position == 1051){
                return false
            }else if(this.color == "green" && this.position == 1076){
                return false
            }
        }
        return true
    }
    isFinalyNotMovable(game){
        // Finish-Felder je nach Farbe
        const finishFieldsByColor = {
            red:   [15, 16, 17, 18],
            blue:  [25, 26, 27, 28],
            yellow:[35, 36, 37, 38],
            green: [45, 46, 47, 48]
        };
        const finishFields = finishFieldsByColor[this.color.toLowerCase()];
        if (!finishFields || !finishFields.includes(this.position)) {
            return false;
        }

        // Belegte Finish-Felder für die eigene Farbe
        let occupied = finishFields.filter(f =>
            game.field.points[findPosInArray(game.field.points, f)].sphereColorOn &&
            game.field.points[findPosInArray(game.field.points, f)].sphereColorOn.toLowerCase() === this.color.toLowerCase()
        );

        // Prüfe die Bedingungen
        if (this.position === finishFields[3]) {
            return true;
        }
        if (this.position === finishFields[2] && occupied.includes(finishFields[3])) {
            return true;
        }
        if (this.position === finishFields[1] && occupied.includes(finishFields[2]) && occupied.includes(finishFields[3])) {
            return true;
        }
        if (this.position === finishFields[0] && occupied.includes(finishFields[1]) && occupied.includes(finishFields[2]) && occupied.includes(finishFields[3])) {
            return true;
        }
        return false;
    }
    moveSphere(game, moveProfile){
        //change sphere state
        this.position = moveProfile.destinationId
        if (this.position < 1000){
            if(global.homeFields.includes(this.position)){
                this.home = true
            }else{
                this.home = false
            }
            if(global.finishPoints.includes(this.position)){
                this.finish = true
            }else{
                this.finish = false
            }
        }else{
            this.home = false
            this.finish = false
        }
        this.finallyNotMovable = this.isFinalyNotMovable(game)
        //change fields states
        let currentPosField = game.field.points[findPosInArray(game.field.points, this.position)]
        let destinationField = game.field.points[findPosInArray(game.field.points, moveProfile.destinationId)]
        currentPosField.removeSphere()
        destinationField.placeSphere(this.color)

        return true
    } 
    checkPath(gameField, destinationId, card){
        //console.log(card)
        let currentPosField = gameField.points[findPosInArray(gameField.points, this.position)]
        let destinationField = gameField.points[findPosInArray(gameField.points, destinationId)]
        if(!currentPosField || !destinationField){
            return {test: false, extra: "Ungueltige Feld-ID."}
        }
        if(card.gameValue[0] == 100){
            return {test: false, extra: "Interner Routing error, bitte kontaktiere das DEV-Team!"} //Jack is handeld in swapChecking
        }
        if((!destinationField.isFree() && destinationField.sphereColorOn.toLowerCase() == this.color.toLowerCase())){
            return {test: false, extra: "Das Zielfeld wird durch die eigene Kugel belegt."} //destination occupied by own sphere
        }
        if(currentPosField.isHomeField && destinationField.isHomeExitField && (currentPosField.color.toLowerCase() == destinationField.color.toLowerCase())){ //sphere is in home and destination is home exit field of same color
            if (card.gameValue && card.gameValue.includes(0)) { // card contains exit value
                return {test: true, extra: ""};
            }else{
                return {test: false, extra: "Du kannst mit dieser Karte nicht aus dem Haus gehen."};
            }
        }
        if(destinationField.isFinishPoint && (destinationField.color.toLowerCase() == this.color.toLowerCase())){ //destination is finish point of same color
            let watchField = destinationField
            let walkDisctance = 0
            while (watchField.pointId !== currentPosField.pointId) {
                if(!watchField.isPassable()){
                    return {test: false, extra: "Der angestrebte Pfad kann nicht bestritten werden."}
                }
                watchField = gameField.points[findPosInArray(gameField.points, watchField.prevPointId)];
                walkDisctance++
                if(watchField == undefined){
                    return {test: false, extra: "eigentlich ist dieser Fehler nicht moeglich."}
                }
            }
            if(card.gameValue && card.gameValue.includes(walkDisctance)){
                return {test: true, extra: ""};
            }
        }else if(card.gameValue && card.gameValue.includes(-4)){
            let watchField = destinationField
            let walkDisctance = 0
            while(watchField.pointId !== currentPosField.pointId){
                if(!watchField.isPassable()){
                    return {test: false, extra: "Der angestrebte Pfad kann nicht bestritten werden."}
                }
                watchField = gameField.points[findPosInArray(gameField.points, watchField.nextPointId)]
                walkDisctance--
                if(watchField == undefined){
                    return {test: false, extra: "eigentlich ist dieser Fehler nicht moeglich."}
                }
            }
            if(card.gameValue && card.gameValue.includes(walkDisctance)){
                return {test: true, extra: ""};
            }
        }else{
            let watchField = destinationField
            let walkDisctance = 0
            while (watchField.pointId !== currentPosField.pointId) {
                //console.log(watchField.pointId);
                if(!watchField.isPassable()){
                    return {test: false, extra: "Der angestrebte Pfad kann nicht bestritten werden."}
                }
                watchField = gameField.points[findPosInArray(gameField.points, watchField.prevPointId)];
                walkDisctance++
                if(watchField == undefined){
                    return {test: false, extra: "eigentlich ist dieser Fehler nicht moeglich."}
                }
            }
            if(card.gameValue && card.gameValue.includes(walkDisctance)){
                return {test: true, extra: ""};
            }
        }
        return {test: false, extra: "unberuecksichtigter Extremfall"}
    }
    checkMove(game, moveProfile, player){
        if(!(game.gameStatus == 1)){
            return {test: false, message: "Spiel nicht im Spielmodus"}
        }
        if(!(game.currentPlayer == player)){
            return {test: false, message: "Nicht am Zug"}
        }
        if(!(moveProfile.color.toLowerCase() == this.color)){
            return {test:false, message: "Falsche Kugelfarbe"} //theoretically not possible
        }
        if(!(moveProfile.sphereId == this.sphereId)){
            return {test:false, message: "Falsche Kugel ID"} //theoretically not possible
        }
        if(!(moveProfile.pointId == this.position)){
            return {test:false, message: "Kugel nicht an angegebener Position"}
        }
        // if (!(player.deck.cards.some(card => card.id === moveProfile.cardId))) {
        //     return {test:false, message: "Karte nicht in der Hand des Spielers"};
        // }
        if(!(player.playedCard == moveProfile.cardId)){
            return {test:false, message: "Diese Karte wurde gerade nicht gespielt"};
        }
        var checkedMove = this.checkPath(game.field, moveProfile.destinationId, game.playedCards.find(card => card.id === moveProfile.cardId))

        if(!(checkedMove.test)){
            return {test:false, message: "Ungültiger Zielpunkt für diese Karte, " + checkedMove.extra}
        }
        console.log(this.color, this.sphereId, "moves from", this.position, "to", moveProfile.destinationId, "with", player.deck.cards.find(card => card.id === moveProfile.cardId))
        if(!game.nextPlayer()){
            return {test:false, message: "Naechster Spieler konnte nicht ermittelt werden. " + checkedMove.extra}
        }

        return {test: true, sphere: this, move: {from: this.position, to: moveProfile.destinationId}}
    }
    checkSwap(moveProfile, ownPlayer, foreignPlayer, game){
        var foreignSphere = foreignPlayer.ownedSpheres[(moveProfile.foreignSphereId - 1)]
        var ownSphere = ownPlayer.ownedSpheres[(moveProfile.ownSphereId - 1)]
        if(!(game.gameStatus == 1)){
            return {test: false, message: "Spiel nicht im Spielmodus"}
        }
        if(!(game.currentPlayer == ownPlayer)){
            return {test: false, message: "Nicht am Zug"}
        }
        if(!(moveProfile.ownColor.toLowerCase() == this.color) || !(moveProfile.foreignColor !== foreignPlayer.color)){
            return {test:false, message: "Falsche Kugelfarbe (n)"} //theoretically not possible
        }
        if(!(moveProfile.ownSphereId == this.sphereId) || !(moveProfile.foreignSphereId == foreignSphere.sphereId)){
            return {test:false, message: "Falsche Kugel ID"} //theoretically not possible
        }
        if(!(moveProfile.ownPointId == this.position)){
            return {test:false, message: "Kugel des Tauschenden nicht an angegebener Position"}
        }
        if(!(moveProfile.foreignPointId ==  foreignSphere.position)){
            return {test:false, message: "Kugel des Getauschten nicht an angegebener Position"}
        }
        // if (!(ownPlayer.deck.cards.some(card => card.id === moveProfile.cardId))) {
        //     return {test:false, message: "Karte nicht in der Hand des Spielers"};
        // }
        if(!(ownPlayer.playedCard == moveProfile.cardId)){
            return {test:false, message: "Diese Karte wurde gerade nicht gespielt"};
        }
        var card = game.playedCards.find(card => card.id === moveProfile.cardId)
        if(card.gameValue[0] !== 100){
            return {test:false, message: "Karte kann keine Kugeln tauschen"};
        }
        if(!foreignSphere.isSwappable(true)){
            return {test:false, message: "Deine Kugel kann nicht getauscht werden"};
        }
        if(!ownSphere.isSwappable(false)){
            return {test:false, message: "Diese Kugel kannst du nicht tauschen"};
        }
        var possibleSwapEntry1 = "" + ownSphere.color + ownSphere.sphereId + "to" + foreignSphere.color + foreignSphere.sphereId
        var possibleSwapEntry2 = "" + foreignSphere.color + foreignSphere.sphereId + "to" + ownSphere.color + ownSphere.sphereId

        if (game.roundSwapLog.includes(possibleSwapEntry1) || game.roundSwapLog.includes(possibleSwapEntry2)) {
            return {test: false, message: "Dieser Kugeln wurde in dieser Runde bereits durchgeführt"};
        }
        if(!game.nextPlayer()){
            return {test:false, message: "Naechster Spieler konnte nicht ermittelt werden. " + checkedMove.extra}
        }
        return {test: true, message: ""}
    }
    swapSphere(foreignSphere, game, moveProfile){
        let ownPosField = game.field.points[findPosInArray(game.field.points, moveProfile.ownPointId)]
        let foreignPosField = game.field.points[findPosInArray(game.field.points, moveProfile.foreignPointId)]

        ownPosField.removeSphere()
        foreignPosField.removeSphere()
        ownPosField.placeSphere(foreignSphere.color)
        foreignPosField.placeSphere(this.color)

        this.position = foreignPosField.pointId
        foreignSphere.position = ownPosField.pointId

        game.roundSwapLog.push("" + this.color + this.sphereId + "to" + foreignSphere.color + foreignSphere.sphereId)

        return true
    }
    sendHome(){
        this.home = true
        this._initPos(this.color, this.sphereId)
    }
}
module.exports = { Sphere }