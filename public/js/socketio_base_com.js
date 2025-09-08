
socket.on('field_baseinit', (msg) => {
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
            DGEBQ(`[data-point-id="${pointId}"]`).classList.add(`sphere${colors[colorIdx]}`);
        }
    }
    playerHandInit(gameInFront);
});
socket.on('sphere_moved', (data) => {
    console.log("[SOCKETIO] Sphere moved empfangen", data);

    DGEBQ(`[data-point-id="${data.pointId}"]`).classList.remove(`sphere${data.color}`);
    DGEBQ(`[data-point-id="${data.destinationId}"]`).classList.add(`sphere${data.color}`);
});

function testMoveSphere(pid, des, col, sphId){
    const card = gameInFront.currentPlayer.deck.cards.find(c => Array.isArray(c.gameValue) && c.gameValue.includes(0));
    const cardId = card ? card.id : null;
    console.log('[DEBUG---]', card)
    socket.emit('move_sphere', { pointId: pid, color: col, destinationId: des, cardId: cardId, playerId: `null_${col.toLowerCase()}`, sphereId: sphId });
}
// (async () => {
//     for (let i = 1001; i <= 1100; i++) {
//         testMoveSphere(i.toString());
//         await new Promise(resolve => setTimeout(resolve, 1000));
//     }
// })();