function testMoveSphere(pid, des, col, sphId, cardIndex){
    //const card = gameInFront.currentPlayer.deck.cards.find(c => Array.isArray(c.gameValue) && c.gameValue.includes(0));
    const card = gameInFront.currentPlayer.deck.cards[cardIndex];
    const cardId = card ? card.id : null;
    socket.emit('move_sphere', { pointId: pid, color: col, destinationId: des, cardId: cardId, playerId: gameInFront.currentPlayer.playerid, sphereId: sphId, gameId: gameInFront.gameId });
}