module.exports = (io) => {
    const express = require('express');
    const router = express.Router();


    router.get('/game', (req,res) => {
        const gameIndex = req.query.gameIndex;
        const gameData = global.games[gameIndex]
        if (gameData) {
            res.json(gameData);
        } else {
            res.status(404).json({ error: 'Game not found' });
        }
    })
    return router
}