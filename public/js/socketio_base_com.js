
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
            dgebq(`[data-point-id="${pointId}"]`).classList.add(`sphere${colors[colorIdx]}`);
        }
    }
    playerHandInit(gameInFront);
});
socket.on('sphere_moved', (data) => {
    console.log("[SOCKETIO] Sphere moved empfangen", data);

    dgebq(`[data-point-id="${data.pointId}"]`).classList.remove(`sphere${data.color}`);
    dgebq(`[data-point-id="${data.destinationId}"]`).classList.add(`sphere${data.color}`);
});
socket.on('game_stats_update', (msg) => {
    console.log("[SOCKETIO] Game State update recived")
    gameInFront = msg
})


// (async () => {
//     for (let i = 1001; i <= 1100; i++) {
//         testMoveSphere(i.toString());
//         await new Promise(resolve => setTimeout(resolve, 1000));
//     }
// })();