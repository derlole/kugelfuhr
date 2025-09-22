
module.exports = (io, socket) => {
    function simulateMove(data, player, game){
        const playerExists = !!player;
        if (!playerExists) {
            io.emit('backend_error', { message: 'Spieler nicht gefunden', code: 1501, gameIndex: game.gameId });
            return {test: false, message: "Spieler nicht gefunden"};
        }
        return player.ownedSpheres[(data.sphereId-1)].checkMove(game, data, player)
    }
    function simulateSwapSpheres(data, ownPlayer, foreignPlayer, game){
        const ownPlayerExists = !!ownPlayer
        const foreignPlayerExists = !!foreignPlayer
        if(!ownPlayerExists || !foreignPlayerExists){
            io.emit('backend_error', { message: 'Spieler nicht gefunden', code: 1501, gameIndex: game.gameId });
            return {test: false, message: "Spieler nicht gefunden"};
        }
        return ownPlayer.ownedSpheres[(data.ownSphereId-1)].checkSwap(data, ownPlayer, foreignPlayer, game)
    }
    function simulateMoveSeven(data, player, game){
        const playerExists = !!player;
        if (!playerExists) {
        console.log('[SEVEN--]', playerExists)
            io.emit('backend_error', { message: 'Spieler nicht gefunden', code: 1501, gameIndex: game.gameId });
            return {test: false, message: "Spieler nicht gefunden"};
        }
        return player.checkMoveSpheresSeven(game, data)
    }
    socket.on("move_sphere", (data) => {

        var game = global.games[data.gameId]
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500});
            return;
        }
        const player = game.players.find(
            player => player && player.playerid === data.playerId
        );
        let test = simulateMove(data, player, game)
        console.log(test, game.gameId)
        if(!test.test){
            io.emit('backend_warning', { message: 'Ungültiger Zug ' + 'Grund: ' + test.message, code: 1600, gameIndex: game.gameId });
            return;
        }
        var execution = game.executeKillBumpDestroySendHomeTurnLightOffKnockOffMurderAssasinateSlaughterSlaySphere(data.destinationId)
        if(!execution.exec){
            io.emit('backend_error', { message: (execution.message + 'Folgefehler sind wahrscheinlich'), code: 1602, gameIndex: data.gameId });
        }
        if(!player.ownedSpheres[(data.sphereId-1)].moveSphere(game, data)){ 
            io.emit('backend_error', { message: 'Zug konnte nicht ausgeführt werden', code: 1601, gameIndex: game.gameId });
            return;
        }

        io.emit('backend_info', { message: 'Zug ausgeführt, Kugel bewegt', code: 9999, gameIndex: data.gameId });
        io.emit("sphere_moved", {data: data, dataInfo: {gameIndex: data.gameId}});

        io.emit('new_game_state', {changeString: 'sphere', changedObject: player.ownedSpheres[(data.sphereId-1)], newGame: game, init: 'all'})
    });
    socket.on("swap_sphere", (data) => {
        console.log(data)
        var game = global.games[data.gameId]
        if(!game){
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500});
            return;
        }
        const ownPlayer = game.players.find(
            player => player && player.color === data.ownColor.toLowerCase()
        );
        const foreignPlayer = game.players.find(
            player => player && player.color === data.foreignColor.toLowerCase()
        )

        if(!(ownPlayer.color.toLowerCase() == data.ownColor.toLowerCase()) || !(foreignPlayer.color.toLowerCase() == data.foreignColor.toLowerCase())){
            io.emit('backend_warning', { message: 'Ungültiger Zug' + 'Grund: Spieler Farben stimmen nicht mit der bewegungsanfrage überein' , code: 2100, gameIndex: game.gameId })
            return
        }

        let test = simulateSwapSpheres(data, ownPlayer, foreignPlayer, game)
        if(!test.test){
            io.emit('backend_warning', { message: 'Ungültiger Zug' + ' Grund: ' + test.message, code: 1700, gameIndex: game.gameId })
            return
        }
        if(!(ownPlayer.ownedSpheres[(data.ownSphereId - 1)].swapSphere(foreignPlayer.ownedSpheres[(data.foreignSphereId - 1)], game, data))){
            io.emit('backend_error', { message: 'Zug konnte nicht ausgeführt werden', code: 1701, gameIndex: game.gameId });
            return;
        }
        io.emit('backend_info', { message: 'Zug ausgeführt, Kugeln Getauscht', code: 9999, gameIndex: data.gameId });
        io.emit("spheres_swapped", {data: data, dataInfo: {gameIndex: data.gameId}});
        io.emit('new_game_state', {changeString: 'spheres', changedObject: [ownPlayer.ownedSpheres[(data.ownSphereId - 1)], foreignPlayer.ownedSpheres[(data.foreignSphereId - 1 )] ], newGame: game, init: 'all'})
    })
    socket.on("move_spheres_seven", (data) => {
        var game = global.games[data.gameId]
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500});
            return;
        }
        const player = game.players.find(
            player => player && player.playerid === data.playerId
        );
        console.log('[SEVEN--]' + game, player, data)
        let test = simulateMoveSeven(data, player, game)

        if(!test.test){
            io.emit('backend_warning', { message: 'Ungültiger Zug ' + 'Grund: ' + test.message, code: 1600, gameIndex: game.gameId });
            return;
        }
        data.spheres.forEach(sph => {
            var rSph =  player.ownedSpheres[sph.sphereId - 1]
            var m = rSph.moveSphere(game, {destinationId: sph.destinationId})
            if(!m){
                io.emit('backend_error', { message: 'Zug konnte nicht ausgeführt werden', code: 1601, gameIndex: game.gameId });
                return;
            }
            
        });

        test.killFields.forEach(f => {
            var execution = game.executeKillBumpDestroySendHomeTurnLightOffKnockOffMurderAssasinateSlaughterSlaySphere(f)
            if(!execution.exec){
                io.emit('backend_error', { message: (execution.message + 'Folgefehler sind wahrscheinlich'), code: 1603, gameIndex: data.gameId });
            }
        });

        io.emit('backend_info', { message: 'Zug ausgeführt, Kugel bewegt', code: 9999, gameIndex: data.gameId });
        //io.emit("sphere_moved", {data: data, dataInfo: {gameIndex: data.gameId}});
        io.emit('new_game_state', {changeString: 'sphere', changedObject: null, newGame: game, init: 'all'})

    })
};

