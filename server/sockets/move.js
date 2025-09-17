
module.exports = (io, socket) => {
    let game
    function simulateMove(data, player){
        const playerExists = !!player;
        if (!playerExists) {
            io.emit('backend_error', { message: 'Spieler nicht gefunden', code: 1501 });
            return {test: false, message: "Spieler nicht gefunden"};
        }
        return player.ownedSpheres[(data.sphereId-1)].checkMove(game, data, player)
    }
    socket.on("move_sphere", (data) => {

        game = global.games[data.gameId]
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500 });
            return;
        }
        const player = game.players.find(
            player => player && player.playerid === data.playerId
        );
        //console.log("test sub1")
        let test = simulateMove(data, player)
        //console.log("test sub2", test)
        if(!test.test){
            io.emit('backend_warning', { message: 'Ungültiger Zug ' + 'Grund: ' + test.message, code: 1600 });
            return;
        }
        if(!player.ownedSpheres[(data.sphereId-1)].moveSphere(game, data)){ 
            io.emit('backend_warning', { message: 'Zug konnte nicht ausgeführt werden', code: 1401 });
            return;
        }
        io.emit('backend_info', { message: 'Zug ausgeführt', code: 9999 });
        io.emit("sphere_moved", {data: data, dataInfo: {gameIndex: data.gameId}});
        io.emit('new_game_state', {changeString: 'player', changedObject: player.ownedSpheres[(data.sphereId-1)], newGame: game, init: 'none'})
    });
};

