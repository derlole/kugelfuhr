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

class flowstep{
    constructor(nr){
        this.number = nr;
        this.state = 0;
        this.content = "";
        switch(nr){
            case 1: 
                this.desc = "Karte anwählen";
                break;
            case 2: 
                this.desc = "Karte ablegen";
                break;
            case 3: 
                this.desc = "Kugel auswählen";
                break;
            case 4: 
                this.desc = "Ziel auswählen";
                break;
            case 5: 
                this.desc = "Bestätigen";
                break;
            default:
                this.desc = "Flowstep Nummer nicht vergeben";
                break;
        }
    }

    addContent(content) {
        this.content = content
    }

    changeState(){
        this.state++;
    }

    getCssClass(){
        if(this.state == 0){
            return "flowStep";
        } else if (this.state == 1) {
            return "flowStepActiveRed";
        } else {
            return "flowStepDone"
        }
    }
}

let flowsteps = [];
for(let i = 0; i < 5; i++){
    flowsteps.push(new flowstep(i+1))
}

let currentFlowstep = 0;
function initFlow(lastStepContentValue){
    flowsteps[1].addContent('<button class="stepButton">Karte ablegen</button>')
    flowsteps[4].addContent('<button class="stepButton">Bestätigen</button>')
    if(currentFlowstep === 1){
        flowsteps[1].addContent('<button class="stepButton">Karte ablegen</button>');
    } else if(currentFlowstep === 4){
        flowsteps[4].addContent('<button class="stepButton">Bestätigen</button>');
    }

    if(currentFlowstep > 0){
        flowsteps[currentFlowstep-1].addContent(lastStepContentValue);
        flowsteps[currentFlowstep-1].changeState();
    }
    currentFlowstep++;
    flowsteps[currentFlowstep-1].changeState();


    let flowcontrol = document.getElementById("flowcontrol");
    flowcontrol.innerHTML="";
    const h2 = document.createElement("h2");
    h2.textContent = "Spielzug:";
    flowcontrol.appendChild(h2);
    flowsteps.forEach(step => {

        let stepDiv = document.createElement("div")
        stepDiv.innerHTML =
        `
            <div class="${step.getCssClass()}">
                <p class="stepNr">${step.number}</p>
                ${step.desc}
                <div class="stepInformation">
                    ${step.content}
                </div>
            </div>
        `
        flowcontrol.appendChild(stepDiv)
    })
    // flowcontrol.innerHTML =` 
        
    //     <div class="flowStepDone">
    //         <p class="stepNr">1</p>
    //         Karte anwählen
    //         <div class="stepInformation">
    //             hehehehhe
    //         </div>
    //     </div>
    //     <div class="flowStepActiveGreen">
    //         <p class="stepNr">2</p>
    //         Karte ablegen
    //         <div class="stepInformation">
    //             <button class="stepButton">Karte ablegen</button>
    //         </div>
    //     </div>
    //     <div class="flowStep">
    //         <p class="stepNr">3</p>
    //         Kugel auswählen
    //         <div class="stepInformation">
    //             hehehehhe
    //         </div>
    //     </div>
    //     <div class="flowStep">
    //         <p class="stepNr">4</p>
    //         Ziel auswählen
    //         <div class="stepInformation">
    //             hehehehhe
    //         </div>
    //     </div>
    //     <div class="flowStep">
    //         <p class="stepNr">5</p>
    //         Bestätigen
    //         <div class="stepInformation">
    //             <button class="stepButton">Bestätigen</button>
    //         </div>
    //     </div>
    // `;
}
function flowReset(){
    currentFlowstep = 0;
    flowsteps=[];
    for(let i = 0; i < 5; i++){
        flowsteps.push(new flowstep(i+1))
    }
}