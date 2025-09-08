let wantedColor = 'Red' // Red, Blue, Yellow, Green
let wantedName = 'MyName'
let joinMethod = 'admin' // admin for no checks, rejoin, join
let joinedGame = 0

socket.on('who_are_you', () => {
    if (joinMethod == 'admin'){
        socket.emit('admin_join', {name: wantedName, color: wantedColor, gameIndex: joinedGame})
    }else if (joinMethod == 'rejoin'){
        socket.emit('rejoin_player', {name: wantedName, color: wantedColor, gameIndex: joinedGame})
    }else{
        socket.emit('join_game', {name: wantedName, color: wantedColor, gameIndex: joinedGame})
    }
})