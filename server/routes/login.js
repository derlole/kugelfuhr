module.exports = (io) => {
    const express = require('express');
    const router = express.Router();

    router.post('admin', (req, res) => {
        //impl
    })
    router.post('join', (req, res) => {
        var data = req.body
        let game = global.games[data.gameIndex];
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500 });
            return;
        }
        if (!data.name || !data.color) {
            io.emit('backend_error', { message: 'Ungültige Daten', code: 1502 });
            return;
        }
        if(!(game.addPlayer(data.name, data.color.toLowerCase()))){
            io.emit('backend_warning', { message: 'Farbe bereits vergeben', code: 1400 });
            return;
        }
        io.emit('new_game_state', { changeString: 'player', changedObject: targetPlayer, game });
        io.emit('backend_info', { message: `${data.name} dem Spiel beigetreten`, code: 9999 });
    })
    router.post('rejoin', (req, res) => {
        var data = req.body
        let game = global.games[data.gameIndex];
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500 });
            return;
        }
        if(!(game.rejoinPlayer(data.name, data.color.toLowerCase()))){
            io.emit('backend_info', { message: `Spiel wiedereintritt des Spielers ${data.name} wurde verweigert.`, code: 1502})
        }
        io.emit('backend_info', { message: `${data.name} ist dem Spiel wieder beigetreten`, code: 9999 });
        
    })

    return router
}