function dgebq(qString) {
    return document.querySelector(qString)
}
function cleanupClassesFromAllSpheres(){
    document.querySelectorAll('.sphereSelected').forEach(el => {
        el.classList.remove('sphereSelected');
    });
}
function getSphereIdAtPoint(pointId){
    let sphere = null;
    gameInFront.players.forEach(player => {
        //console.log(player)
        //console.log(pointId)
        const sph = player.ownedSpheres.find(s => s.position == pointId);
        //console.log(sph)
        if(sph){
            sphere = sph;
        }
    });
    return sphere ? sphere.sphereId : null;
}
function getSphereColorAtPoint(pointId){
    let sphereColor = null;
    gameInFront.players.forEach(player => {
        const sph = player.ownedSpheres.find(s => s.position === pointId);
        if(sph){
            sphereColor = sph.color;
        }
    });
    return sphereColor;
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
function wantMoveSphere(pid, des, col, sphId, cardI){
    if((col.toLowerCase() !== gameInFront.currentPlayer.color.toLowerCase())){
        showAndAutoHide('warning-div', 'Du bist nicht dran!', 3000);
        return
    }
    
    const card = cardI;
    const cardId = card ? card.id : null;

    socket.emit('move_sphere', { pointId: pid, color: col, destinationId: des, cardId: cardId, playerId: gameInFront.currentPlayer.playerid, sphereId: sphId, gameId: gameInFront.gameId });
}
function wantSwapSphere(pidY, pidF, colY, colF, sphIdY, sphIdF, cardI){
    if((colY.toLowerCase() !== gameInFront.currentPlayer.color.toLowerCase())){
        showAndAutoHide('warning-div', 'Du bist nicht dran!', 3000);
        return
    } 
    const card = cardI
    const cardId = card ? card.id : null;

    socket.emit('swap_sphere', { ownPointId: pidY, foreignPointId: pidF, ownColor: colY, foreignColor: colF, ownSphereId: sphIdY, foreignSphereId: sphIdF, cardId: cardId, playerId: gameInFront.currentPlayer.playerid, gameId: gameInFront.gameId }) // eigentlich foriegn <3
}
function wantMoveSpheresSeven(cardI, col, spheresMoveProfiles){
    if((col.toLowerCase() !== gameInFront.currentPlayer.color.toLowerCase())){
        showAndAutoHide('warning-div', 'Du bist nicht dran!', 3000);
        return
    }
    let allFilled = true;
    console.log(spheresMoveProfiles)
    spheresMoveProfiles.forEach(smp => {
        if(!(smp.sphereId) || !(smp.destinationId) || !(smp.pointId)){
            showAndAutoHide('warning-div', 'Deine angaben sind nicht vollstaendig', 4000);
            return allFilled = false;
        }
    });
    if(!allFilled) return;
    const card = cardI
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
let cardThrown = false
function wantThrowCard(cardIndex, col){
    if((col.toLowerCase() !== gameInFront.currentPlayer.color.toLowerCase())){
        showAndAutoHide('warning-div', 'Du bist nicht dran!', 3000);
        return
    }
    const card = gameInFront.currentPlayer.deck.cards[cardIndex];
    const cardId = card ? card.id : null;
    socket.emit('throw_card', {gameId: gameInFront.gameId, cardId: cardId, cardIndex: cardIndex, playerId: gameInFront.currentPlayer.playerid})
    cardThrown = true
}

function layCardTrigger(){
    if(!(document.getElementById('step2').classList.contains('flowStepActive' + gameInFront.currentPlayer.color[0].toUpperCase() + gameInFront.currentPlayer.color.substring(1)))){
        showAndAutoHide('warning-div', 'Keine Karte ausgewählt!, Code: 3001', 3000);
        return
    }
    if(activeCardId === null || activeCardIndex === null){
        showAndAutoHide('warning-div', 'Internal frontend Errro, Code: 3002', 3000);
        return
    }
    wantLayCard(activeCardIndex, gameInFront.currentPlayer.color)
}

function throwCardTrigger(){
    if(!(document.getElementById('step2').classList.contains('flowStepActive' + gameInFront.currentPlayer.color[0].toUpperCase() + gameInFront.currentPlayer.color.substring(1)))){
        showAndAutoHide('warning-div', 'Keine Karte ausgewählt!, Code: 3001', 3000);
        return
    }
    if(activeCardId === null || activeCardIndex === null){
        showAndAutoHide('warning-div', 'Internal frontend Errro, Code: 3002', 3000);
        return
    }
    wantThrowCard(activeCardIndex, gameInFront.currentPlayer.color)
}
function checkoutTurn(){

    if(gameInFront.flowControl.state5.state !== 1){
        showAndAutoHide('warning-div', 'Du kannst deinen Zug noch nicht beenden!, Code: 3003', 3000);
        socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 1, state2: 0, state3: 0, state4: 0, state5: 0}});
        return
    }
    if(gameInFront.currentPlayer.playedCard === null){
        showAndAutoHide('error-div', 'hdwgh? (NoPlayedCard), Code: 3004', 30000);
        socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 2, state2: 2, state3: 2, state4: 2, state5: 2}});
        return
    }
    const foundCard = gameInFront.playedCards.find(
        card => card.id === gameInFront.currentPlayer.playedCard
    );
    if (!foundCard) {
        showAndAutoHide('error-div', 'hdwgh? (NoPlayedCardFound), Code: 3005', 30000);
        socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 2, state2: 2, state3: 2, state4: 2, state5: 2}});
        return
    }
    if(cardThrown){
        cardThrown = false
        socket.emit('end_turn_and_do_nothing', {gameId: gameInFront.gameId, playerId: gameInFront.currentPlayer.playerid})
        return
    }
    if(foundCard.gameValue.includes(7)){

        let allSelected = true;
        fieldsSlectedInStates34OnSeven.forEach(selectionPair => {
            const [first, second] = selectionPair;
            if ((first === null) !== (second === null)) {
                allSelected = false;
            }
        });
        if(!allSelected){
            showAndAutoHide('warning-div', 'Du hast nicht alle Bewegungen für die 7 ausgewählt!, Code: 3006', 3000);
            socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 2, state2: 2, state3: 1, state4: 0, state5: 0}});
            cleanupSevenArrays();
            return
        }

        let moveProfiles = [];
        fieldsSlectedInStates34OnSeven.forEach(selectionPair => {
            const [from, to] = selectionPair;
            if(from === null || to === null){
                return;
            }
            moveProfiles.push({
                pointId: from,
                destinationId: to,
                sphereId: getSphereIdAtPoint(from)
            });
        });
        wantMoveSpheresSeven(foundCard, gameInFront.currentPlayer.color, moveProfiles);

        fieldsSlectedInStates34OnSeven = [[null, null],[null, null],[null, null],[null, null],[null, null],[null, null],[null, null]];
        fSIS34OSIndex = null;
        cleanupClassesFromAllSpheres();
    }else if(foundCard.gameValue.includes(100)){

        if(fieldSelectedInState3 === null || fieldSelectedInState4 === null){
            showAndAutoHide('warning-div', 'Du hast nicht beide Kugeln für den Tausch ausgewählt!, Code: 3007', 3000);
            socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 2, state2: 2, state3: 1, state4: 0, state5: 0}});
            return
        }
        const ownSphereId = getSphereIdAtPoint(fieldSelectedInState3);
        const foreignSphereId = getSphereIdAtPoint(fieldSelectedInState4);
        const ownColor = gameInFront.currentPlayer.color;
        const foreignColor = getSphereColorAtPoint(fieldSelectedInState4);
        if(!foreignColor || !ownColor || !ownSphereId || !foreignSphereId){
            showAndAutoHide('warning-div', 'Fehler beim Ermitteln der Kugeln für den Tausch!, Code: 3071', 3000);
            socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 2, state2: 2, state3: 1, state4: 0, state5: 0}});
            return
        }
        wantSwapSphere(fieldSelectedInState3, fieldSelectedInState4, ownColor, foreignColor, ownSphereId, foreignSphereId, foundCard);

        fieldSelectedInState3 = null;
        fieldSelectedInState4 = null;
        cleanupClassesFromAllSpheres();
    }else{

        if(fieldSelectedInState3 === null || fieldSelectedInState4 === null){
            showAndAutoHide('warning-div', 'Du hast nicht beide Punkte für eine Bewegung ausgewählt!, Code: 3008', 3000);
            socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 2, state2: 2, state3: 1, state4: 0, state5: 0}});
            return
        }
        const sphereId = getSphereIdAtPoint(fieldSelectedInState3);
        if(!sphereId){
            showAndAutoHide('warning-div', 'Fehler beim Ermitteln der Kugel für die Bewegung!, Code: 3081', 3000);
            socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 2, state2: 2, state3: 1, state4: 0, state5: 0}});
            return
        }
        //console.log('WANTS MOVE SPHERE WITH', fieldSelectedInState3, fieldSelectedInState4, gameInFront.currentPlayer.color, sphereId, foundCard);
        wantMoveSphere(fieldSelectedInState3, fieldSelectedInState4, gameInFront.currentPlayer.color, sphereId, foundCard);

        fieldSelectedInState3 = null;
        fieldSelectedInState4 = null;
        cleanupClassesFromAllSpheres();
    }
}
function confirmExchange(){
    if(gameInFront.gameStatus != 5){
        return showAndAutoHide('warning-div', 'Es werden gerade keine Karten getauscht, Code: 7000', 3000);
    }
    if(!activeCardIndex || !activeCardId){
        return showAndAutoHide('warning-div', 'Karte nicht richtig ausgewählt, Code: 7001', 3000);
    }
    console.log(activeCardId, activeCardIndex, wantedColor)
    socket.emit('confirm_exchange', { cardIndex: activeCardIndex, cardId: activeCardId, col: wantedColor, gameId: gameInFront.gameId})
}