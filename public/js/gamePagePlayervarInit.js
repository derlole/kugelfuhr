let wantedColor = null // Red, Blue, Yellow, Green
let wantedName = null
let joinMethod = 'join' // admin for no checks, rejoin, join
let joinedGame = null

const data = JSON.parse(document.getElementById('playerVars').textContent)

wantedColor = data.color
joinedGame = data.gameIndex
wantedName = data.name

function finalRegistry(){
    if((!wantedColor)||(!joinedGame)||(!wantedName)){
        showAndAutoHide('error-div', `Error-Message: Ein unbehandelter Frontend error wurde erkannt, Error-code: 4444`, 7000);
        return
    }
    if (joinMethod == 'admin'){
        socket.emit('admin_join', {name: wantedName, color: wantedColor, gameIndex: joinedGame})
    }else if (joinMethod == 'rejoin'){
        socket.emit('rejoin_player', {name: wantedName, color: wantedColor, gameIndex: joinedGame})
    }else{
        socket.emit('join_game', {name: wantedName, color: wantedColor, gameIndex: joinedGame})
    }
}
finalRegistry()