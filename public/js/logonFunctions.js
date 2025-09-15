
wantCol = null
wantGameNr = null

function setWantColor(col){
    wantCol = col
}
function setWantGame(gameNr){
    wantGameNr = gameNr 
}
function requestGameJoin(){
    if(!(wantCol) || !(wantGameNr)){
        return
    }
    wantedName = document.getElementById('playerName').value
    socket.emit('join_game', {name: wantedName, color: wantCol, gameIndex: wantGameNr})
}