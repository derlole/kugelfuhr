const { Game } = require('../server/models/game');


function initDefaultGame(gameId){
    let game = new Game();
    game = (global.games[gameId] = game)
    game.gameId = gameId
    game.currentPlayer = game.player1red
    game.startingPlayer = game.player1red
    game.givingPlayer = game.player4green
    game.deck.shuffle()
    game.player1red.deck.removeUnnecessaryDeckInformation()
    game.player2blue.deck.removeUnnecessaryDeckInformation()
    game.player3yellow.deck.removeUnnecessaryDeckInformation()
    game.player4green.deck.removeUnnecessaryDeckInformation()

    for (let i = 0; i < 5; i++) {
        game.player1red.drawCard(game.deck);
        game.player2blue.drawCard(game.deck);
        game.player3yellow.drawCard(game.deck);
        game.player4green.drawCard(game.deck);
    }
    return game
}
function initGlobals(){
    global.suits = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠'
    };
}
function initGameWithGameConfig(gameConfig){
    return;
}


module.exports = { initDefaultGame, initGlobals, initGameWithGameConfig };