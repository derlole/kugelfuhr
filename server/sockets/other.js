module.exports = (io, socket) => {
    socket.on('throw_card', (data) => {
        let game = global.games[data.gameIndex];
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 2100, gameIndex: data.gameIndex });
            return;
        }
        const player = game.players.find(
            player => player && player.playerid === data.playerId
        );
        if (!(player.deck.cards.some(card => card.id === data.cardId))) {
            io.emit('backend_error', { message: 'Karte nicht in der Hand des Spielers', code: 2200, gameIndex: data.gameIndex });
            return //{test:false, message: "Karte nicht in der Hand des Spielers"};
        }
        const card = player.deck.cards.find(card => card.id === data.cardId)
        var test = player.checkCardThrowable(card)
        if(!test){
            io.emit('backend_warning', { message: 'Karte nicht Abwerfbar, es kann noch gespielt werden', code: 2200, gameIndex: data.gameIndex });
            return
        }
        player.throwCard(card)
        io.emit('backend_info', {message: 'Zug ausgeführt, Karte Abgeworfen',  code: 9999, gameIndex: game.gameId})
        //io.emit('card_thrown', {data:data, dataInfo: {gameIndex: game.gameId}})
        io.emit('new_game_state', {changeString: 'game', changedObject: player, newGame: game, init: 'all'})
    })
}