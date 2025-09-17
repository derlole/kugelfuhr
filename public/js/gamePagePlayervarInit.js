let wantedColor = null // Red, Blue, Yellow, Green
let wantedName = null
let joinMethod = null // admin for no checks, rejoin, join
let joinedGame = null

const data = JSON.parse(document.getElementById('playerVars').textContent)

wantedColor = data.color
joinedGame = data.gameIndex
wantedName = data.name
joinMethod = data.mehtod
async function getGame(){
    try {
        const response = await fetch(`/requestData/game?gameIndex=${encodeURIComponent(joinedGame)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const gameData = await response.json();
        return gameData;
    } catch (error) {
        console.error('Error fetching game data:', error);
        return null;
    }
}
function finalRegistry(){
    console.log(joinMethod)
    if((!wantedColor)||(!joinedGame)||(!wantedName)){
        showAndAutoHide('error-div', `Error-Message: Ein unbehandelter Frontend error wurde erkannt, Error-code: 4444`, 7000);
        return
    }
    if (joinMethod == 'admin'){
        socket.emit('admin_join', {name: wantedName, color: wantedColor, gameIndex: joinedGame})
    }else if (joinMethod == 'rejoin'){
        socket.emit('rejoin_player', {name: wantedName, color: wantedColor, gameIndex: joinedGame})
        getGame().then(gameData => {
            gameInFront = gameData;
            reInit('all', gameInFront)
        });
        
    }else if(joinMethod == 'join'){
        socket.emit('join_game', {name: wantedName, color: wantedColor, gameIndex: joinedGame})
    }else{
        showAndAutoHide('error-div', `Error-Message: Ein unbehandelter Frontend error wurde erkannt (Auth), Error-code: 4444`, 7000);
    }
}
finalRegistry()