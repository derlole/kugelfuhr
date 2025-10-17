function dgebq(qString) {
    return document.querySelector(qString)
}

function getPlayerFromGameAndColor(game, color){
    var colorF = color.toLowerCase()
    switch (colorF) {
        case 'red':
            return game.player1red;
        case 'blue':
            return game.player2blue;
        case 'yellow':
            return game.player3yellow;
        case 'green':
            return game.player4green;
        default:
            return null;
    }
}
// normal Move also go out of home full check and result to any conncted client
function wantMoveSphere(pid, des, col, sphId, cardIndex){
    //console.log(!(col.toLowerCase !== gameInFront.currentPlayer.color.toLowerCase()))
    if((col.toLowerCase() !== gameInFront.currentPlayer.color.toLowerCase())){
        showAndAutoHide('warning-div', 'Du bist nicht dran!', 3000);
        return
    }
    
    const card = gameInFront.currentPlayer.deck.cards[cardIndex];
    const cardId = card ? card.id : null;

    socket.emit('move_sphere', { pointId: pid, color: col, destinationId: des, cardId: cardId, playerId: gameInFront.currentPlayer.playerid, sphereId: sphId, gameId: gameInFront.gameId });
}
function wantSwapSphere(pidY, pidF, colY, colF, sphIdY, sphIdF, cardIndex){
    if((colY.toLowerCase() !== gameInFront.currentPlayer.color.toLowerCase())){
        showAndAutoHide('warning-div', 'Du bist nicht dran!', 3000);
        return
    } 
    const card = gameInFront.currentPlayer.deck.cards[cardIndex];
    const cardId = card ? card.id : null;

    socket.emit('swap_sphere', { ownPointId: pidY, foreignPointId: pidF, ownColor: colY, foreignColor: colF, ownSphereId: sphIdY, foreignSphereId: sphIdF, cardId: cardId, playerId: gameInFront.currentPlayer.playerid, gameId: gameInFront.gameId }) // eigentlich foriegn <3
}
function wantMoveSpheresSeven(cardIndex, col, spheresMoveProfiles){
    if((col.toLowerCase() !== gameInFront.currentPlayer.color.toLowerCase())){
        showAndAutoHide('warning-div', 'Du bist nicht dran!', 3000);
        return
    }
    spheresMoveProfiles.forEach(smp => {
        if(!(smp.sphereId) || !(smp.destinationId) || !(smp.pointId)){
            showAndAutoHide('warning-div', 'Deine angaben sind nicht vollstaendig', 4000);
            return 
        }
    });
    const card = gameInFront.currentPlayer.deck.cards[cardIndex];
    const cardId = card ? card.id : null;
    socket.emit('move_spheres_seven', {spheres: spheresMoveProfiles, gameId: gameInFront.gameId, playerId: gameInFront.currentPlayer.playerid, color: gameInFront.currentPlayer.color, cardId: cardId})
}
function wantLayCard(cardIndex, col){
    if((col.toLowerCase() !== gameInFront.currentPlayer.color.toLowerCase())){
        showAndAutoHide('warning-div', 'Du bist nicht dran!', 3000);
        return
    }
    const card = gameInFront.currentPlayer.deck.cards[cardIndex];
    const cardId = card ? card.id : null;
    socket.emit('play_card', {gameId: gameInFront.gameId, cardId: cardId, cardIndex: cardIndex, playerId: gameInFront.currentPlayer.playerid})
    //create eventListeners for Spheres of col
}
function wantThrowCard(cardIndex, col){
    if((col.toLowerCase() !== gameInFront.currentPlayer.color.toLowerCase())){
        showAndAutoHide('warning-div', 'Du bist nicht dran!', 3000);
        return
    }
    const card = gameInFront.currentPlayer.deck.cards[cardIndex];
    const cardId = card ? card.id : null;
    socket.emit('throw_card', {gameId: gameInFront.gameId, cardId: cardId, cardIndex: cardIndex, playerId: gameInFront.currentPlayer.playerid})
}

function layCardTrigger(){
    if(!(document.getElementById('step2').classList.contains('flowStepActive' + gameInFront.currentPlayer.color[0].toUpperCase() + gameInFront.currentPlayer.color.substring(1)))){
        showAndAutoHide('warning-div', 'Keine Karte ausgewählt!', 3000);
        return
    }
    if(activeCardId === null || activeCardIndex === null){
        showAndAutoHide('warning-div', 'Internal frontend Errro', 3000);
        return
    }
    wantLayCard(activeCardIndex, gameInFront.currentPlayer.color)
}

function throwCardTrigger(){
    if(!(document.getElementById('step2').classList.contains('flowStepActive' + gameInFront.currentPlayer.color[0].toUpperCase() + gameInFront.currentPlayer.color.substring(1)))){
        showAndAutoHide('warning-div', 'Keine Karte ausgewählt!', 3000);
        return
    }
    if(activeCardId === null || activeCardIndex === null){
        showAndAutoHide('warning-div', 'Internal frontend Errro', 3000);
        return
    }
    wantThrowCard(activeCardIndex, gameInFront.currentPlayer.color)
}