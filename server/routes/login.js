module.exports = (io) => {
    const express = require('express');
    const router = express.Router();

    router.post('/admin', (req, res) => {
        //impl
    })
    router.post('/join', (req, res) => { //display errors properly
        var data = req.body
        let game = global.games[data.gameIndex];
        if (!game) {
            return res.status(400).json({ message: 'Kein Spiel gefunden', code: 1500})
        }
        if (!data.name || !data.color) {
            return res.status(400).json({ message: 'Ungültige Daten', code: 1502})
        }
        if(!(game.checkColorFree(data.color.toLowerCase()))){
            return res.status(400).json({ message: 'Farbe bereits vergeben', code: 1400 });
        }
        return res.sendStatus(200)
    })

    return router
}