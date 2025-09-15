module.exports = (io) => {
    const express = require('express');
    const router = express.Router();

    router.post('/admin', (req, res) => {
        //impl
    })
    router.post('/join', (req, res) => {
        var data = req.body
        let game = global.games[data.gameIndex];
        if (!game) {
            //io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500 });
            return res.status(400).json({ message: 'Kein Spiel gefunden', code: 1500})
        }
        if (!data.name || !data.color) {
            //io.emit('backend_error', { message: 'Ungültige Daten', code: 1502 });
            return res.status(400).json({ message: 'Ungültige Daten', code: 1502})
        }
        if(!(game.addPlayer(data.name, data.color.toLowerCase()))){
            //io.emit('backend_warning', { message: 'Farbe bereits vergeben', code: 1400 });
            return res.status(400).json({ message: 'Farbe bereits vergeben', code: 1400 });
        }
        res.status(200)
    })

    return router
}