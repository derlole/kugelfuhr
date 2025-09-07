
module.exports = (io, socket) => {
    let game = global.games[0]; 
    function simulateMove(data, player){
        const playerExists = !!player;
        if (!playerExists) {
            io.emit('backend_error', { message: 'Spieler nicht gefunden', code: 1501 });
            return false;
        }
        return player.ownedSpheres[(data.sphereId-1)].checkMove(game, data, player)
    }
    socket.on("move_sphere", (data) => {
        
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500 });
            return;
        }
        const player = game.players.find(
            player => player && player.playerid === data.playerId
        );
        let test = simulateMove(data, player)
        if(!test.test){
            io.emit('backend_warning', { message: 'Ungültiger Zug ' + 'Grund: ' + test.message, code: 1400 });
            return;
        }
        if(!player.ownedSpheres[0].moveSphere(game, data)){
            io.emit('backend_warning', { message: 'Zug konnte nicht ausgeführt werden', code: 1401 });
            return;
        }
        io.emit('backend_info', { message: 'Zug ausgeführt', code: 9999 });
        io.emit("sphere_moved", data);
    });
};

