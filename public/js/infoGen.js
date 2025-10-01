function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function displayPlayerNames(red, blue, yellow, green, playercolor){
    let content = document.getElementById("playerNames");

    let partner, opp1, opp2, playername, partnername, opp1Name, opp2Name;
    switch(playercolor){
        case "red":
            partner = "yellow";
            partnername = yellow;
            opp1 = "blue";
            opp1Name = blue;
            opp2 = "green";
            opp2Name = green;
            playername = red;
            break;
        case "yellow":
            partner = "red";
            partnername = red;
            opp1 = "blue";
            opp1Name = blue;
            opp2 = "green";
            opp2Name = green;
            playername = yellow;
            break;
        case "blue":
            partner="green";
            partnername = green;
            opp1 = "red";
            opp1Name = red;
            opp2 = "yellow";
            opp2Name = yellow;
            playername = blue;
            break;
        case "green":
            partner="blue";
            partnername = blue;
            opp1 = "red";
            opp1Name = red;
            opp2 = "yellow";
            opp2Name = yellow;
            playername = green;
    }
    
    content.innerHTML=`
        <p id="playerName${capitalizeFirst(playercolor)}">${playername} (Du)</p>
        <p id="playerName${capitalizeFirst(partner)}">${partnername} (Dein Partner)</p>
        <p id="playerName${capitalizeFirst(opp1)}">${opp1Name} (Gegnerteam)</p>
        <p id="playerName${capitalizeFirst(opp2)}">${opp2Name} (Gegnerteam)</p>`;
}

function frameInit(game){
    let frame = document.getElementById("frame");
    frame.removeAttribute('class');
    let currentPlayerColor = game.currentPlayer.color.toLowerCase();
    let screenPlayerColor = wantedColor.toLowerCase();
    if(currentPlayerColor === screenPlayerColor){
        frame.classList.add(`indicator${capitalizeFirst(currentPlayerColor)}`);
    } else {
        frame.classList.add(`colorInfo${capitalizeFirst(currentPlayerColor)}`);
    }
    let currentPlayerName = document.getElementById("playerTurn");
    currentPlayerName.innerText = game.currentPlayer.name; 
}

function initFlow(game){
    for(let i = 0; i < 5; i++){
        let currentStepData = game.flowControl.states[i]
        let outerDiv = document.getElementById("step"+ (i + 1));
        outerDiv.classList = '';

        if(currentStepData.state == 1){
            outerDiv.classList.add("flowStepActive" + capitalizeFirst(game.currentPlayer.color))
        } else if (currentStepData.state == 0){
            outerDiv.classList.add("flowStep")
        } else {
            outerDiv.classList.add("flowStepDone")
        }

        document.getElementById("desc"+ (i + 1)).innerText = currentStepData.text;
        document.getElementById("content"+ (i + 1)).innerHTML = currentStepData.subText;
    }
}