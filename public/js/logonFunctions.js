
let wantCol = null
let wantGameNr = null
let wantedName

function setWantColor(col){
    wantCol = col
}
function setWantGame(gameNr){
    wantGameNr = gameNr 
}
function devLogon(){
    wantCol = 'Red'
    wantGameNr = 0
    wantedName = 'MyName'
}
function requestGameJoin(){
    //uncomment in real application
    devLogon()

    if(!(wantCol) || !(wantGameNr)){
        return
    }
    if(!wantedName){
        wantedName = document.getElementById('playerName').value
    }
    const data = {name: wantedName, color: wantCol, gameIndex: wantGameNr}
    fetch('/logonGame/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 200) {
            const params = new URLSearchParams({
                color: wantCol,
                gameIndex: wantGameNr,
                name: wantedName
            });
            window.location.href = `/dashboard?${params.toString()}`;
            return;
        }
    })
    .then(result => {
        if(result && result.message){
            alert(result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}