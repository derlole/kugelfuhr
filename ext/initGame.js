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
    global.homeExitFields =      [1001, 1026, 1051, 1076],
    global.finishEntryPoints =   [1023, 1048, 1073, 1098],
    global.finishPoints =        [15,16,17,18,25,26,27,28,35,36,37,38,45,46,47,48],
    global.homeFields =          [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44]
}
function initGameWithGameConfig(gameConfig, gameId){
    return;
}
function forcePlayableNoChecks(gameId){
    game = global.games[gameId]
    game.round = 1
    game.gameStatus = 1
}


module.exports = { initDefaultGame, initGlobals, initGameWithGameConfig, forcePlayableNoChecks };