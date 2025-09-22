function cleanUpField(){
    document.querySelectorAll('[data-point-id]').forEach(el => {
        el.classList.remove('sphereRed', 'sphereGreen', 'sphereYellow', 'sphereBlue');
    });
}
function cleanUpCards(){
    playerHand = document.getElementById('hand')
    playerHand.innerHTML = ''
}
function cleanUpOther(){

    return
}

function reInitField(newGame){
    cleanUpField()
    newGame.players.forEach(player => {
        player.ownedSpheres.forEach(sph => {
            dgebq(`[data-point-id="${sph.position}"]`).classList.add(`sphere${sph.color.charAt(0).toUpperCase() + sph.color.slice(1)}`);
        })
    });
}
function reInitCards(newGame){
    cleanUpCards()
    playerHandInit(newGame)
}
function reInitOther(newGame){
    cleanUpOther()
    displayPlayerNames(newGame.player1red.name, newGame.player2blue.name, newGame.player3yellow.name, newGame.player4green.name, wantedColor.toLowerCase())
    frameInit(newGame);
    initFlow();
}
function reInitAll(newGame){
    reInitField(newGame)
    reInitCards(newGame)
    reInitOther(newGame)
}


function reInit(string, newGame){
    switch (string) {
        case 'none':
            // No action needed
            break;
        case 'all':
            reInitAll(newGame);
            break;
        case 'field':
            reInitField(newGame);
            break;
        case 'player':
            reInitCards(newGame);
            break;
        case 'other':
            reInitOther(newGame);
            break;
        default:
            // Unknown option
            break;
    }
}
