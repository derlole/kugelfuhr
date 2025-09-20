

let wantCol = null
let wantGameNr = null
let wantedName
function setWantColor(col, element){
    wantCol = col
    const options = element.parentElement.querySelectorAll('div')
    options.forEach(div => {
        div.classList.remove('colorChoosen');
    });
    element.classList.add("colorChoosen")
}
function setWantGame(gameNr, element){
    console.log(element)
    wantGameNr = gameNr 

    const options = element.parentElement.querySelectorAll('h4')
    options.forEach(div => {
        div.classList.remove('chosenGame');
    });
    element.classList.add("chosenGame")
}
function devLogon(){
    wantCol = 'Red'
    wantGameNr = 0
    wantedName = 'MyName'
}
function requestGameJoin(){
    //console.log("station1",wantCol,wantGameNr, wantedName )
    //uncomment in real application
    //devLogon()
    if(!(wantCol) || wantGameNr == null){
        showAndAutoHide('warning-div', `Wähle ein Spiel und die Farbe an, die du spielen willst`, 7000);
        return
    }
    if(!wantedName){
        wantedName = document.getElementById('playerName').value
    }
    if(!wantedName){
        showAndAutoHide('warning-div', `Du benötigst einen Namen, um dem Spiel beizutreten`, 7000);
        return
    }
    const data = {name: wantedName, color: wantCol, gameIndex: wantGameNr}
    fetch('/logonGame/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(async response => {
        let json;
        try {
            json = await response.json();
        } catch (e) {
            json = null; // falls gar kein Body kommt
        }
        if (response.ok) {
            const params = new URLSearchParams({
            color: wantCol,
            gameIndex: wantGameNr,
            name: wantedName
            });
            window.location.href = `/dashboard?${params.toString()}`;
            return; 
        } else {
            return json
        }
    })
    .then(result => {
        if(!result) return
        if(result.code == 1500 || result.code == 1502){
            showAndAutoHide('error-div', `Error-Message: ${result.message}, Error-code: ${result.code}, Thrown by backend`, 7000);
            return
        }else{
            return window.location.href = '/index'
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}