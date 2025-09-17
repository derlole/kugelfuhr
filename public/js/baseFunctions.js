function dgebq(qString) {
    return document.querySelector(qString)
}

function getPlayerFromGameAndColor(game, color){
    var colorF = color.toLowerCase()
    switch (colorF) {
        case 'red':
            return game.player1red;
        case 'blue':
            return game.player2blue;
        case 'yellow':
            return game.player3yellow;
        case 'green':
            return game.player4green;
        default:
            return null;
    }
}
// normal Move also go out of home full check and result to any conncted client
function wantMoveSphere(pid, des, col, sphId, cardIndex){
    //const card = gameInFront.currentPlayer.deck.cards.find(c => Array.isArray(c.gameValue) && c.gameValue.includes(0));
    //console.log(gameInFront.currentPlayer.deck.cards)
    const card = gameInFront.currentPlayer.deck.cards[cardIndex];
    const cardId = card ? card.id : null;
    //console.log('[DEBUG---]', card)
    socket.emit('move_sphere', { pointId: pid, color: col, destinationId: des, cardId: cardId, playerId: gameInFront.currentPlayer.playerid, sphereId: sphId, gameId: gameInFront.gameId });
}