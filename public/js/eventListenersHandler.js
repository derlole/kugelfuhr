let fieldSelectedInState3 = null;
let fieldSelectedInState4 = null;
let fSIS34OSIndex = 0;
let fieldsSlectedInStates34OnSeven = [[null, null],[null, null],[null, null],[null, null],[null, null],[null, null],[null, null]];
function cleanupSevenArrays(){
    fSIS34OSIndex = 0;
    fieldsSlectedInStates34OnSeven = [[null, null],[null, null],[null, null],[null, null],[null, null],[null, null],[null, null]];
}

function sphereClickHandlerSeven(event, pointId){
    if(gameInFront.flowControl.state3.state == 1){
        fieldsSlectedInStates34OnSeven[fSIS34OSIndex][0] = pointId;
        console.log(event.currentTarget)
        event.currentTarget.classList.add('sphereSelected');
        //console.log('Spheres selected in State 3 for Seven:', fieldsSlectedInStates34OnSeven[fSIS34OSIndex][0]);
        socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 2, state2: 2, state3: 2, state4: 1, state5: 0}});
        //request state change to state4
    }else if(gameInFront.flowControl.state4.state == 1){
        fieldsSlectedInStates34OnSeven[fSIS34OSIndex][1] = pointId;
        event.currentTarget.classList.add('sphereSelected');
        //console.log('Spheres selected in State 4 for Seven:', fieldsSlectedInStates34OnSeven[fSIS34OSIndex][1]);
        socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 2, state2: 2, state3: 1, state4: 0, state5: 1}});
        //request state change to state35
        fSIS34OSIndex += 1;
    }
}
const sphereClickHandler = (event) => {
    const pointId = event.currentTarget.getAttribute('data-point-id');
    const foundCard = gameInFront.playedCards.find(
        card => card.id === gameInFront.currentPlayer.playedCard
    );

    if (foundCard) {
        if(foundCard.gameValue.includes(7)){
            sphereClickHandlerSeven(event, pointId);
            return
        }
    }else{
        showAndAutoHide('warning-div', 'Spieler hat keine Karte gespielt', 4001);
        return
    }
    if(gameInFront.flowControl.state3.state == 1){
        if(fieldSelectedInState3 == null){
            fieldSelectedInState3 = pointId;
            event.currentTarget.classList.add('sphereSelected');
        }
        //console.log('Spheres selected in State 3:', fieldSelectedInState3);
        socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 2, state2: 2, state3: 2, state4: 1, state5: 0}});
        //request state change to state4
    }else if(gameInFront.flowControl.state4.state == 1){
        if(fieldSelectedInState4 == null){
            fieldSelectedInState4 = pointId;
            event.currentTarget.classList.add('sphereSelected');
        }
        //console.log('Spheres selected in State 4:', fieldSelectedInState4);
        socket.emit('requestStateChange', {gameId: gameInFront.gameId, states: {state1: 2, state2: 2, state3: 2, state4: 2, state5: 1}});
        //request state change to state5
    }
}

function instanciateOrRemoveSphereEventListeners(gIF){
    document.querySelectorAll('[data-point-id]').forEach(el => {
        el.removeEventListener('click', sphereClickHandler);
        el.classList.remove('sphereSelectionPossible');
    });
    if(gIF.flowControl.state3.state == 1){
        gIF.currentPlayer.ownedSpheres.forEach(sph => {
            const pointEl = dgebq(`[data-point-id="${sph.position}"]`);
            pointEl.addEventListener('click', sphereClickHandler);
            pointEl.classList.add('sphereSelectionPossible');
        });
    }else if(gIF.flowControl.state4.state == 1){
        gIF.field.points.forEach(pt => {
            const pointEl = dgebq(`[data-point-id="${pt.pointId}"]`);
            pointEl.addEventListener('click', sphereClickHandler);
            pointEl.classList.add('sphereSelectionPossible');
        });
    }
            
}
