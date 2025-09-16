
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
    if(!(wantCol) || wantGameNr == null){
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
        if (response.ok) {
            // 200–299
            const params = new URLSearchParams({
            color: wantCol,
            gameIndex: wantGameNr,
            name: wantedName
            });
            window.location.href = `/dashboard?${params.toString()}`;
            return; 
        } else {
            return response.json(); 
        }
    })
    .then(result => {
        if (result) {
            console.log("testpre");
            showAndAutoHide('error-div', `Error-Message: ${result.message}, Error-code: ${result.code}, Thrown by backend`, 7000);
            console.log(result);
            console.log("testafter");
            return
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}