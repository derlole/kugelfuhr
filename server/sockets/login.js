module.exports = (io, socket) => {
    socket.on('admin_join', (data) => {
        let game = global.games[data.gameIndex];
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500, gameIndex: data.gameIndex });
            return;
        }
        if (!data.name || !data.color) {
            io.emit('backend_error', { message: 'Ungültige Daten', code: 1502, gameIndex: data.gameIndex });
            return;
        }
        var player = game.players.filter(player => player.color.toLowerCase() == data.color.toLowerCase());

        if (!player || player.length == 0) {
            io.emit('backend_warning', { message: 'Farbe existiert nicht', code: 1405, gameIndex: data.gameIndex });
            return;
        }
        player = player[0]
        player.name = data.name
        player.regeneratePlayerId()
        game.checkStartable()
        console.log('[PLAYER--] Joined Player ', player.name, 'new PlayerId: ', player.playerid)
        //io.emit('new_game_state', { changeString: 'player', changedObject: player, newGame: game, init: 'none' });
        io.emit('backend_info', { message: `${data.name} dem Spiel beigetreten (Admin)`, code: 9999, gameIndex: data.gameIndex });
    });
    socket.on('join_game', (data) => {

        let game = global.games[data.gameIndex];
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500, gameIndex: data.gameIndex });
            return;
        }
        if (!data.name || !data.color) {
            io.emit('backend_error', { message: 'Ungültige Daten', code: 1502, gameIndex: data.gameIndex });
            return;
        }
        var targetPlayer = game.addPlayer(data.name, data.color.toLowerCase())
        if(game.startableGame){
            game.initStartGame()
        }
        
        if(!targetPlayer){
            io.emit('backend_warning', { message: 'Farbe bereits vergeben', code: 1400, gameIndex: data.gameIndex });
            return;
        }
        if(!global.games.length == 0){
            io.emit("field_baseinit", game)
        }
        io.emit('new_game_state', { changeString: 'player', changedObject: targetPlayer, newGame: game, init: 'all' });
        io.emit('backend_info', { message: `${data.name} dem Spiel beigetreten`, code: 9999, gameIndex: data.gameIndex });
    });

    socket.on('rejoin_player', (data) => {
        let game = global.games[data.gameIndex];
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500, gameIndex: data.gameIndex });
            return;
        }
        if(!(game.rejoinPlayer(data.name, data.color.toLowerCase()))){
            io.emit('backend_info', { message: `Spiel wiedereintritt des Spielers ${data.name} wurde verweigert.`, code: 1502, gameIndex: data.gameIndex})
        }
        io.emit('backend_info', { message: `${data.name} ist dem Spiel wieder beigetreten`, code: 9999, gameIndex: data.gameIndex });
    });
};
