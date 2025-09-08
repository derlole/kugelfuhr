module.exports = (io, socket) => {
    socket.on('admin_join', (data) => {
        let game = global.games[data.gameIndex];
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500 });
            return;
        }
        if (!data.name || !data.color) {
            io.emit('backend_error', { message: 'Ungültige Daten', code: 1502 });
            return;
        }
        var player = game.players.filter(player => player.color.toLowerCase() == data.color.toLowerCase());
        console.log(player)
        if (!player || player.length == 0) {
            io.emit('backend_warning', { message: 'Farbe existiert nicht', code: 1405 });
            return;
        }
        player = player[0]
        player.name = data.name
        player.regeneratePlayerId()

        io.emit('new_game_state', { changeString: 'player', changedObject: player, game });
        io.emit('backend_info', { message: `${data.name} dem Spiel beigetreten`, code: 9999 });
    });
    socket.on('join_game', (data) => {
        let game = global.games[data.gameIndex];
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500 });
            return;
        }
        if (!data.name || !data.color) {
            io.emit('backend_error', { message: 'Ungültige Daten', code: 1502 });
            return;
        }
        targetPlayer = game.players.find(
            player => player && player.color.toLowerCase() === data.color.toLowerCase()
        );
        const colorAvailable = targetPlayer.playerFree();
        if (!colorAvailable) {
            io.emit('backend_warning', { message: 'Farbe bereits vergeben', code: 1400 });
            return;
        }
        targetPlayer.name = data.name
        targetPlayer.regeneratePlayerId()
        io.emit('new_game_state', { changeString: 'player', changedObject: targetPlayer, game });
        io.emit('backend_info', { message: `${data.name} dem Spiel beigetreten`, code: 9999 });
    });

    socket.on('rejoin_player', (data) => {
        let game = global.games[data.gameIndex];
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500 });
            return;
        }
        const player = game.players.find(
            player => player && player.name === data.name && player.color === data.color.toLowerCase()
        );
        if (!player) {
            io.emit('backend_error', { message: 'Spieler nicht gefunden', code: 1501 });
            return;
        }
        player.playerid = socket.id;
        io.emit('backend_info', { message: `${data.name} ist dem Spiel wieder beigetreten`, code: 9999 });
    });
};
