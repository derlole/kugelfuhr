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
        //change fields states
        let currentPosField = game.field.points[findPosInArray(game.field.points, this.position)]
        let destinationField = game.field.points[findPosInArray(game.field.points, moveProfile.destinationId)]
        currentPosField.removeSphere()
        destinationField.placeSphere(this.color)
        //some if's
        return true
    } 
    checkPath(gameField, destinationId, card){
        //console.log(card)
        let currentPosField = gameField.points[findPosInArray(gameField.points, this.position)]
        let destinationField = gameField.points[findPosInArray(gameField.points, destinationId)]
        if((!destinationField.isFree() && destinationField.sphereColorOn.toLowerCase() == this.color.toLowerCase())){
            return false //destination occupied by own sphere
        }
        if(currentPosField.isHomeField && destinationField.isHomeExitField && (currentPosField.color.toLowerCase() == destinationField.color.toLowerCase())){ //sphere is in home and destination is home exit field of same color
            if (card.gameValue && card.gameValue.includes(0)) { // card contains exit value
                return true;
            }
        }
        if(destinationField.isFinishPoint && (destinationField.color.toLowerCase() == this.color.toLowerCase())){ //destination is finish point of same color
            let watchField = destinationField
            let walkDisctance = 0
            while (watchField.pointId !== currentPosField.pointId) {
                console.log(watchField.pointId);
                if(!watchField.isPassable()){
                    return false
                }
                watchField = gameField.points[findPosInArray(gameField.points, watchField.prevPointId)];
                walkDisctance++
                if(watchField == undefined){
                    return false
                }
            }
            if(card.gameValue && card.gameValue.includes(walkDisctance)){
                return true
            }
        }else{
            let watchField = destinationField
            let walkDisctance = 0
            while (watchField.pointId !== currentPosField.pointId) {
                //console.log(watchField.pointId);
                if(!watchField.isPassable()){
                    return false
                }
                watchField = gameField.points[findPosInArray(gameField.points, watchField.prevPointId)];
                walkDisctance++
                if(watchField == undefined){
                    return false
                }
            }
            if(card.gameValue && card.gameValue.includes(walkDisctance)){
                return true
            }
        }
        return false
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
        //console.log(moveProfile.cardId)
        //console.log(player.deck.cards)
        if (!(player.deck.cards.some(card => card.id === moveProfile.cardId))) {
            return {test:false, message: "Karte nicht in der Hand des Spielers"};
        }
        if(!(this.checkPath(game.field, moveProfile.destinationId, player.deck.cards.find(card => card.id === moveProfile.cardId)))){
            return {test:false, message: "Ungültiger Zielpunkt für diese Karte"}
        }
        console.log(this.color, this.sphereId, "moves from", this.position, "to", moveProfile.destinationId, "with", player.deck.cards.find(card => card.id === moveProfile.cardId))
        //some if's
        return {test: true, sphere: this, move: {from: this.position, to: moveProfile.destinationId}}
    }
}
module.exports = { Sphere }