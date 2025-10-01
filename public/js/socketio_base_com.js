
socket.on('field_baseinit', (msg) => {
    //console.log((gameInFront !== undefined && gameInFront !== null))
    console.log('[BASEINIT]', gameInFront)
    if(!(gameInFront == undefined)){
        if(( gameInFront.gameId !== msg.gameId)){
            console.log('[BASEINIT]', "field baseinit for wrong game, returning")
            return
        }
    }
    console.log("[SOCKETIO] Field Baseinit empfangen", msg);
    gameInFront = msg
    document.querySelectorAll('[data-point-id]').forEach(el => {
        el.classList.remove('sphereRed', 'sphereGreen', 'sphereYellow', 'sphereBlue');
        void el.offsetWidth;
    });
    const colors = ['Red', 'Blue', 'Yellow', 'Green'];
    for (let colorIdx = 0; colorIdx < colors.length; colorIdx++) {
        for (let i = 1; i <= 4; i++) {
            const pointId = `${(colorIdx + 1)}${i}`;
            dgebq(`[data-point-id="${pointId}"]`).classList.add(`sphere${colors[colorIdx]}`);
        }
    }
    playerHandInit(gameInFront);
    displayPlayerNames(gameInFront.player1red.name, gameInFront.player2blue.name, gameInFront.player3yellow.name, gameInFront.player4green.name, wantedColor.toLowerCase())
    frameInit(gameInFront);
    initFlow(gameInFront);
});
socket.on('sphere_moved', (data) => {
    if(gameInFront.gameId !== data.dataInfo.gameIndex) return
    var sphData = data.data
    console.log("[SOCKETIO] Sphere moved empfangen", sphData);

    dgebq(`[data-point-id="${sphData.pointId}"]`).classList.remove(`sphere${sphData.color}`);
    dgebq(`[data-point-id="${sphData.destinationId}"]`).classList.add(`sphere${sphData.color}`);
});
socket.on('spheres_swapped', (data) => {
    if(gameInFront.gameId !== data.dataInfo.gameIndex) return
    console.log(data.data)

    ownPoint = dgebq(`[data-point-id="${data.data.ownPointId}"]`)
    foreignPoint = dgebq(`[data-point-id="${data.data.foreignPointId}"]`)
    
    ownPoint.classList.remove(`sphere${data.data.ownColor}`)
    foreignPoint.classList.remove(`sphere${data.data.foreignColor}`)
    void ownPoint.offsetWidth;
    void foreignPoint.offsetWidth;
    ownPoint.classList.add(`sphere${data.data.foreignColor}`)
    foreignPoint.classList.add(`sphere${data.data.ownColor}`)
})
socket.on('lifecycle', (data) =>{
    if(gameInFront == undefined) return
    if(gameInFront.lifecycleId !== data.lfc){
        window.location.href = '/serverRestartError'
    }
})
socket.on('new_game_state', (data) => {
    console.log('[newGS---]', data)
    if(!(data.newGame && ( data.newGame.gameId == gameInFront.gameId))) return
    gameInFront = data.newGame
    console.log(data.newGame)
    reInit(data.init, gameInFront)
})
