function generateExchangeBox(){
    var removeEl = document.getElementById('exchangeBox')
    if (removeEl) {
        removeEl.remove();
    }
    if(gameInFront.gameStatus != 5){
        return
    }
    let partnerColor;
    switch(wantedColor.toLowerCase()){
        case 'red':
            partnerColor = 'yellow'
            break;
        case 'blue':
            partnerColor = 'green'
            break;
        case 'yellow':
            partnerColor = 'red'
            break;
        case 'green':
            partnerColor = 'blue'
            break;
    }

    let exchangeBox = document.createElement('div')
    exchangeBox.innerHTML = "";
    exchangeBox.id = 'exchangeBox'
    exchangeBox.classList.add('exchangeBox')

    let title = document.createElement('h2')
    title.innerText = 'Karten tauschen'

    let player = document.createElement('p')
    for (let p of gameInFront.players){
        let color = p.color.toLowerCase();
        console.log(color, partnerColor)
        if(color === partnerColor){
            player.innerText = `Du tauschst mit ${p.name} (${capitalizeFirst(partnerColor)})`
        }
    }

    let exchangeCardsContainer = document.createElement('div')
    exchangeCardsContainer.id = 'exchangeCardsContainer'
    exchangeCardsContainer.classList.add('bg' + capitalizeFirst(partnerColor))
    exchangeCardsContainer.classList.add('border' + capitalizeFirst(partnerColor))
    let card = document.createElement('div')
    card.id = 'exchangeCard'
    exchangeCardsContainer.appendChild(card)


    let confirmButton = document.createElement('button')
    confirmButton.classList.add('stepButton')
    confirmButton.id = 'changeCardConfirm'
    confirmButton.innerText = 'Tauschen'
    confirmButton.onclick = () => {confirmExchange()}

    let infoText = document.createElement('p')
    infoText.innerHTML = '<i style="font-size: 0.8em">Wähle eine Karte per Klick auf die Karte aus.</i>'


    exchangeBox.append(title, player, exchangeCardsContainer, infoText, confirmButton)
    
    document.body.appendChild(exchangeBox);
}

