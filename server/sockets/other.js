module.exports = (io, socket) => {
    socket.on('throw_card', (data) => {
        let game = global.games[data.gameId];
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 2100, gameIndex: game.gameId });
            return;
        }
        const player = game.players.find(
            player => player && player.playerid === data.playerId
        );
        if (!(player.deck.cards.some(card => card.id === data.cardId))) {
            io.emit('backend_error', { message: 'Karte nicht in der Hand des Spielers', code: 2200, gameIndex: game.gameId });
            return //{test:false, message: "Karte nicht in der Hand des Spielers"};
        }
        const card = player.deck.cards[data.cardIndex]
        var test = player.checkCardThrowable(data.cardId, data.cardIndex)
        if(!test){
            io.emit('backend_warning', { message: 'Karte nicht Abwerfbar, es kann noch gespielt werden', code: 2200, gameIndex: game.gameId });
            return
        }
        player.throwCard(data.cardId, game.playedCards)
        //CHANGE TURN STATE 2,3,4,5 // CHECK THIS LATER
        game.flowControl.state1.state = 2
        game.flowControl.state2.state = 2
        game.flowControl.state3.state = 2
        game.flowControl.state4.state = 2
        game.flowControl.state5.state = 1
        io.emit('backend_info', {message: 'Zug ausgeführt, Karte Abgeworfen',  code: 9999, gameIndex: game.gameId})
        io.emit('new_game_state', {changeString: 'game', changedObject: player, newGame: game, init: 'player_other'})
    })
    socket.on('play_card', (data) => {
        let game = global.games[data.gameId];
        if(!game){
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 2100, gameIndex: game.gameId });
            return;
        }
        const player = game.players.find(
            player => player && player.playerid === data.playerId
        );
        if (!(player.deck.cards.some(card => card.id === data.cardId))) {
            io.emit('backend_error', { message: 'Karte nicht in der Hand des Spielers', code: 2200, gameIndex: game.gameId });
            return //{test:false, message: "Karte nicht in der Hand des Spielers"};
        }
        var test = game.currentPlayer.checkCardPlayable(data.cardId, data.cardIndex)
        if(!test){
            io.emit('backend_warning', { message: 'Karte nicht Spielbar', code: 2200, gameIndex: game.gameId });
            return
        }
        game.currentPlayer.playCard(data.cardIndex, game.playedCards)
        game.flowControl.state1.state = 2
        game.flowControl.state2.state = 2
        game.flowControl.state3.state = 1
        //CHANGE TURN STATE 2,3 // CHECK THIS LATER
        io.emit('backend_info', {message: 'Zug ausgeführt, Karte gespielt',  code: 9999, gameIndex: game.gameId})
        io.emit('new_game_state', {changeString: 'game', changedObject: player, newGame: game, init: 'player_other'})
    })
    socket.on('requestStateChange', (data) => {
        let game = global.games[data.gameId];
        if(!game){
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 2100, gameIndex: game.gameId });
            return;
        }
        if(data.states.state1 !== undefined){
            game.flowControl.state1.state = data.states.state1
        }
        if(data.states.state2 !== undefined){
            game.flowControl.state2.state = data.states.state2
        }
        if(data.states.state3 !== undefined){
            game.flowControl.state3.state = data.states.state3
        }
        if(data.states.state4 !== undefined){
            game.flowControl.state4.state = data.states.state4
        }
        if(data.states.state5 !== undefined){
            game.flowControl.state5.state = data.states.state5
        }
        
        io.emit('new_game_state', {changeString: 'game', changedObject: game, newGame: game, init: 'other'})
    })
}