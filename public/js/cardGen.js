let handSpace = document.getElementById("hand");
let avCards;
let activeCardId = null;
let activeCardIndex = null;
let playerChangeState = null
//Anzahl Handkarten

function eventListenersInit() {
  const cards = document.querySelectorAll(".card");

  // Infofeld einmalig erzeugen und ins Body hängen
  const infoBox = document.createElement("div");
  infoBox.className = "card-info";
  infoBox.style.display = "none";
  document.body.appendChild(infoBox);
  let info = document.getElementById("cardInfoBox");
  cards.forEach(card => {
    switch(wantedColor.toLowerCase()){
        case 'red':
            playerChangeState = gameInFront.players[0].changingState
            break
        case 'blue':
            playerChangeState = gameInFront.players[1].changingState
            break
        case 'yellow':
            playerChangeState = gameInFront.players[2].changingState
            break
        case 'green':
            playerChangeState = gameInFront.players[3].changingState
            break
    }
    card.addEventListener("click", () => {
        activeCardId = null;
        activeCardIndex = null;

        
        
        if (card.classList.contains("cardActive")) {
            card.classList.remove("cardActive");
            infoBox.style.display = "none";
            info.innerHTML= "";
            if(gameInFront.currentPlayer.color.toLowerCase() == wantedColor.toLowerCase() && gameInFront.flowControl.states[1].state == 1){
                gameInFront.flowControl.states[0].state = 1
                gameInFront.flowControl.states[1].state = 0 
                reInitOther(gameInFront)
            }else if(gameInFront.gameStatus == 5 && playerChangeState == 1){
                playerChangeState = 0
                removeRenderExchangeCard();
            }

            return;
        }
        cards.forEach(innerCard => innerCard.classList.remove("cardActive"));
        card.classList.add("cardActive");
        activeCardId = card.id;
        activeCardIndex = card.dataset.index;

        if(gameInFront.currentPlayer.color.toLowerCase() == wantedColor.toLowerCase() && gameInFront.flowControl.states[0].state == 1 && gameInFront.gameStatus == 1){
            gameInFront.flowControl.states[0].state = 2
            gameInFront.flowControl.states[1].state = 1  
            reInitOther(gameInFront) 
        }else if(gameInFront.gameStatus == 5){
            playerChangeState = 1
            renderExchangeCard(card);
        }

      avCards.forEach(avCard => {
        if(avCard.id === card.id){
            //infoBox.textContent = avCard.description;
            info.innerHTML= `<p>${avCard.description}</p>`
        }
      })
      //Infofeld
    //   const rect = card.getBoundingClientRect();
    //   infoBox.style.display = "block";
    //   infoBox.style.fontSize = "0.8em";
    //   infoBox.style.position = "absolute";
    //   infoBox.style.top = (window.scrollY + rect.top - infoBox.offsetHeight - 8) + "px";
    //   infoBox.style.left = (window.scrollX + rect.left + rect.width / 2) + "px";
    //   infoBox.style.transform = "translateX(-50%)";
    });
  });
}


function genCardContent(value, suit) {

    let content = document.createElement("div");
    let strokeColor = suit === "♥" || suit === "♦" ? "red" : "black";

    switch (value) {
        case "A":
            content.innerHTML = `<p class="ass">${suit}</p>`;
            break;
        case "2":
            content.innerHTML = `
            <div class="cardFontSize two">
                <p>${suit}</p>
                <p class="rotated">${suit}</p>
            </div>
            `;
            break;
        case "3":
            content.innerHTML = `
            <div class="cardFontSize three">
                <p>${suit}</p>
                <p>${suit}</p>
                <p class="rotated">${suit}</p>
            </div>
            `;
            break;
        case "4":
            content.innerHTML = `
            <div class="cardFontSize four">
                <div><p>${suit}</p><p>${suit}</p></div>
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>                
            </div>
            `;
            break;
        case "5":
            content.innerHTML = `
            <div class="cardFontSize five">
                <div><p>${suit}</p><p>${suit}</p></div>
                <p>${suit}</p>
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>                
            </div>
            `;
            break;
        case "6":
            content.innerHTML = `
            <div class="cardFontSize six">
                <div><p>${suit}</p><p>${suit}</p></div>
                <div><p>${suit}</p><p>${suit}</p></div>
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>                
            </div>
            `;
            break;
        case "7":
            content.innerHTML = `
            <div class="cardFontSize seven">
                <div><p>${suit}</p><p>${suit}</p></div>
                <p>${suit}</p>
                <div><p>${suit}</p><p>${suit}</p></div>
                <div></div>
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>                
            </div>
            `;
            break;
        case "8":
            content.innerHTML = `
            <div class="cardFontSize eight">
                <div><p>${suit}</p><p>${suit}</p></div>
                <p>${suit}</p>
                <div><p>${suit}</p><p>${suit}</p></div>
                <p class="rotated">${suit}</p>
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>                
            </div>
            `;
            break;
        case "9":
            content.innerHTML = `
            <div class="cardFontSize nine">
                <div><p>${suit}</p><p>${suit}</p></div>
                <div><p>${suit}</p><p>${suit}</p></div>
                <p>${suit}</p>
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>    
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>                
            </div>
            `;
            break;
        case "10":
            content.innerHTML = `
            <div class="cardFontSize ten">
                <div><p>${suit}</p><p>${suit}</p></div>
                <p>${suit}</p>
                <div><p>${suit}</p><p>${suit}</p></div>
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>
                <p class="rotated">${suit}</p>  
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>                
            </div>
            `;
            break;
        case "J":
            content.innerHTML = `
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 100 100" version="1.1">
                    <g id="surface1">
                        <path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke:${strokeColor};stroke-opacity:1;stroke-miterlimit:4;" d="M 20.999998 7.499999 L 7.999687 7.499999 M 20.999998 7.499999 L 16.666874 3 M 20.999998 7.499999 L 16.666874 11.999999 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
                        <path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke:${strokeColor};stroke-opacity:1;stroke-miterlimit:4;" d="M 4.000312 16.499999 L 16.999686 16.499999 M 4.000312 16.499999 L 8.333437 20.999998 M 4.000312 16.499999 L 8.333437 11.999999 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
                    </g>
                </svg>
            </div>`;
            break;
        case "Q":
            content.innerHTML = `
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="80px" height="80px" viewBox="0 0 80 80" version="1.1">
                    <g id="surface1">
                        <path style=" stroke:none;fill-rule:nonzero;fill:${strokeColor};fill-opacity:1;" d="M 38.9375 0.265625 C 38.546875 0.453125 37.609375 1.640625 35.28125 4.90625 C 33.546875 7.328125 32.03125 9.578125 31.90625 9.921875 C 31.578125 10.859375 31.8125 11.390625 33.8125 14.203125 L 35.59375 16.703125 L 35.234375 16.9375 C 34.0625 17.703125 32.5 19.703125 31.5 21.6875 C 31.0625 22.5625 30.859375 22.8125 30.671875 22.75 C 29.84375 22.421875 28.25 22.296875 27.203125 22.453125 C 23.1875 23.078125 19.984375 26.640625 18.453125 32.1875 C 18.28125 32.8125 18.09375 33.359375 18.0625 33.390625 C 18.03125 33.4375 17.578125 33.34375 17.078125 33.203125 C 15.859375 32.84375 13.875 32.734375 12.765625 32.953125 C 10.421875 33.453125 8.484375 35.03125 7.359375 37.390625 C 6.234375 39.71875 5.953125 42.671875 6.546875 45.75 C 6.84375 47.25 7.484375 49.34375 7.90625 50.1875 C 8.234375 50.8125 8.1875 50.984375 7.546875 51.40625 C 7.234375 51.625 6.296875 52.421875 5.484375 53.203125 C -3.15625 61.4375 -1.40625 71.953125 9.8125 79.0625 C 11.421875 80.078125 12.28125 80.234375 13.109375 79.65625 C 13.96875 79.078125 14.296875 78.515625 14.296875 77.65625 C 14.296875 76.625 13.96875 76.234375 12.125 74.984375 C 7.390625 71.8125 5.046875 68.640625 4.734375 65.046875 C 4.109375 57.6875 14 50.609375 28.4375 48.0625 C 32.484375 47.34375 35.171875 47.140625 40 47.140625 C 50.625 47.140625 59.625 49.1875 66.671875 53.21875 C 77.703125 59.53125 78.15625 68.34375 67.8125 75.015625 C 66.53125 75.828125 66.1875 76.140625 65.921875 76.6875 C 65.375 77.796875 65.71875 78.859375 66.875 79.640625 C 67.921875 80.359375 68.84375 80.0625 71.59375 78.125 C 75.5625 75.328125 78.328125 71.78125 79.484375 68.015625 C 79.84375 66.8125 79.890625 66.375 79.890625 64.453125 C 79.890625 62.515625 79.84375 62.109375 79.46875 60.859375 C 78.953125 59.140625 78.015625 57.34375 76.859375 55.78125 C 75.953125 54.5625 73.453125 52.09375 72.453125 51.40625 C 72.140625 51.1875 71.875 50.9375 71.875 50.859375 C 71.875 50.765625 72.078125 50.203125 72.328125 49.578125 C 72.578125 48.96875 72.984375 47.703125 73.234375 46.765625 C 73.625 45.25 73.671875 44.828125 73.65625 42.578125 C 73.65625 40.296875 73.625 39.96875 73.234375 38.828125 C 72.171875 35.625 70.046875 33.546875 67.234375 32.953125 C 66.140625 32.734375 64 32.84375 62.84375 33.203125 C 62.375 33.34375 61.96875 33.4375 61.9375 33.40625 C 61.90625 33.359375 61.703125 32.71875 61.484375 31.953125 C 60.25 27.6875 58.078125 24.671875 55.265625 23.28125 C 53.625 22.46875 52.15625 22.203125 50.640625 22.46875 C 50.0625 22.5625 49.46875 22.6875 49.328125 22.75 C 49.140625 22.8125 48.9375 22.5625 48.5 21.6875 C 47.5 19.703125 45.9375 17.703125 44.765625 16.9375 L 44.40625 16.703125 L 46.1875 14.203125 C 48.1875 11.390625 48.421875 10.859375 48.09375 9.921875 C 47.96875 9.578125 46.453125 7.3125 44.71875 4.90625 C 41.40625 0.265625 41.140625 0 39.96875 0 C 39.6875 0 39.21875 0.125 38.9375 0.265625 Z M 41.359375 20.328125 C 42.375 20.8125 43.546875 22.21875 44.3125 23.828125 C 46.421875 28.28125 46.40625 34.203125 44.296875 38.53125 C 43.140625 40.90625 41.515625 42.34375 39.984375 42.34375 C 39.171875 42.34375 37.921875 41.65625 37.109375 40.75 C 36.234375 39.765625 35.109375 37.515625 34.6875 35.875 C 33.328125 30.515625 34.515625 24.15625 37.40625 21.328125 C 38.765625 19.984375 40.015625 19.671875 41.359375 20.328125 Z M 29.125 27.203125 C 29.71875 27.359375 29.71875 27.375 29.625 28.015625 C 28.984375 32.78125 29.96875 38.3125 32.0625 41.734375 C 32.609375 42.625 32.609375 42.8125 32.09375 42.8125 C 31.390625 42.8125 28.484375 43.265625 25.875 43.78125 C 23.8125 44.1875 23.375 44.21875 23.265625 44.046875 C 22.90625 43.453125 22.453125 40.890625 22.375 38.953125 C 22.171875 33.4375 24.328125 28.3125 27.296875 27.25 C 28.03125 27 28.34375 26.984375 29.125 27.203125 Z M 53.265625 27.484375 C 54.109375 27.921875 55.359375 29.375 56 30.6875 C 57.1875 33.09375 57.75 36.0625 57.609375 39.140625 C 57.53125 40.875 57.0625 43.515625 56.734375 44.046875 C 56.625 44.21875 56.1875 44.1875 54.140625 43.765625 C 52.78125 43.5 50.765625 43.15625 49.625 43.015625 C 48.5 42.875 47.546875 42.734375 47.515625 42.71875 C 47.5 42.6875 47.890625 41.8125 48.421875 40.75 C 50.28125 37.03125 50.96875 32.46875 50.375 28.015625 C 50.28125 27.375 50.296875 27.359375 50.796875 27.203125 C 51.5 26.984375 52.515625 27.109375 53.265625 27.484375 Z M 16.671875 38.03125 L 17.609375 38.453125 L 17.71875 39.875 C 17.84375 41.4375 18.171875 43.375 18.546875 44.65625 C 18.671875 45.125 18.71875 45.5625 18.65625 45.625 C 18.578125 45.703125 17.8125 46.015625 16.953125 46.328125 C 16.09375 46.65625 14.671875 47.25 13.796875 47.65625 L 12.21875 48.40625 L 11.890625 47.515625 C 11.1875 45.609375 11.015625 44.671875 11.015625 42.578125 C 11.015625 40.625 11.03125 40.5 11.5 39.515625 C 11.96875 38.53125 12.46875 38.015625 13.296875 37.65625 C 13.953125 37.375 15.625 37.578125 16.671875 38.03125 Z M 67.3125 38 C 67.765625 38.3125 68.09375 38.71875 68.46875 39.484375 C 68.96875 40.515625 68.984375 40.578125 68.984375 42.578125 C 68.96875 44.65625 68.8125 45.578125 68.109375 47.515625 L 67.78125 48.40625 L 66.203125 47.65625 C 65.328125 47.25 63.90625 46.65625 63.046875 46.328125 C 62.1875 46.015625 61.421875 45.703125 61.34375 45.625 C 61.28125 45.5625 61.328125 45.125 61.453125 44.65625 C 61.828125 43.375 62.15625 41.4375 62.28125 39.875 L 62.390625 38.453125 L 63.265625 38.078125 C 64.4375 37.546875 64.609375 37.515625 65.71875 37.5625 C 66.46875 37.578125 66.828125 37.6875 67.3125 38 Z M 67.3125 38 "/>
                    </g>
                </svg>
            </div>`;
            break;
        case "K":
            content.innerHTML = `
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 100 100" version="1.1">
                    <g id="surface1">
                        <path style=" stroke:none;fill-rule:nonzero;fill:${strokeColor};fill-opacity:1;" d="M 48.417969 20.703125 C 48.027344 20.898438 47.578125 21.269531 47.421875 21.523438 C 47.265625 21.777344 43.847656 27.773438 39.84375 34.863281 C 35.859375 41.953125 32.460938 47.949219 32.304688 48.183594 C 32.011719 48.652344 33.066406 49.121094 19.628906 42.578125 C 13.652344 39.667969 12.96875 39.394531 12.03125 39.511719 C 10.605469 39.707031 9.375 41.054688 9.375 42.460938 C 9.375 42.910156 11.074219 51.015625 13.144531 60.507812 C 15.878906 72.988281 17.03125 77.890625 17.324219 78.261719 C 17.519531 78.554688 17.949219 78.964844 18.242188 79.179688 L 18.769531 79.589844 L 81.035156 79.589844 L 81.5625 79.179688 C 81.855469 78.964844 82.265625 78.574219 82.460938 78.300781 C 82.890625 77.714844 90.625 43.691406 90.625 42.363281 C 90.625 41.269531 90.058594 40.332031 89.0625 39.824219 C 87.617188 39.042969 87.5 39.101562 77.324219 44.023438 C 70.175781 47.480469 67.8125 48.554688 67.65625 48.378906 C 67.539062 48.242188 64.296875 42.558594 60.449219 35.742188 C 56.601562 28.925781 53.164062 22.832031 52.792969 22.207031 C 51.71875 20.429688 50.039062 19.84375 48.417969 20.703125 Z M 48.417969 20.703125 "/>
                    </g>
                </svg>
            </div>`;
            break;
        default:
            content.innerHTML = `<p>?</p>`;
    }
    return content;
}
// ily
function genCard(role, symbol, cssClass, cardId, index){   
    let card = document.createElement("div");
    card.classList.add(cssClass);
    card.id = cardId
    card.dataset.index = index;

    card.innerHTML = `
        <div class="cardTop">
            <div class="cardCorner">
                <p>${role}</p>
                <p>${symbol}</p>
            </div>
            <div></div>
        </div>
        <div class="cardMid"></div>
        <div class="cardBot">
            <div></div>
            <div class="cardCorner rotated">
                <p>${role}</p>
                <p>${symbol}</p>
            </div>
        </div>`;

    symbol === "♥" || symbol === "♦" ? card.classList.add("red") : card.classList.add("black");
    let cardMid = card.getElementsByClassName("cardMid")[0];
    cardMid.innerHTML = ""; // vorher leeren
    cardMid.appendChild(genCardContent(role, symbol));
    return card;
}


function renderHand(n, handCards) {
    avCards = handCards;
    let symbolArray =[];
    handCards.forEach(card => {
        symbolArray.push(card.suit.symbol);
    });
    
    let valueArray =[];
    handCards.forEach(card => {
        valueArray.push(card.value);
    });

    const handSpace = document.getElementById("hand");
    handSpace.innerHTML = ""; // reset
    
    const overlap = 0.4;
    const cardWidth = 8; 
    const totalWidth = (n - 1) * cardWidth * (1 - overlap) + cardWidth;

    for (let i = 0; i < n; i++) {
        // // ♥ ♦ ♣ ♠ hearts diamonds clubs spades
        // let symbolArray = ["♥", "♦", "♣", "♠"];
        let symbol = symbolArray[i];
        // // A 2 3 4 5 6 7 8 9 10 J Q K
        // let valueArray = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        let value = valueArray[i];

        let card = genCard(value, symbol, "card", handCards[i].id, i);
        const left = (i * cardWidth * (1 - overlap)) / totalWidth * 100;
        
        card.style.left = `${left}%`;
        card.style.zIndex = i + 1;

        handSpace.appendChild(card);
    }
}


function playerHandInit(gameInFrontend) {
    //console.log(gameInFrontend, wantedColor)
    var playertoRender = getPlayerFromGameAndColor(gameInFrontend, wantedColor) //wantedColor is from gamePagePlayervarInit.js and is more or less the global idetifier of the PlayerColor in the Frontend
    const handPlayer = playertoRender.deck.cards;
    const numCards = handPlayer.length;
    renderHand(numCards, handPlayer);
    renderAblage(gameInFrontend.playedCards)
    eventListenersInit()

}
let cardToLayDown = 1;
function renderAblage(cardsLayed){
    var len = cardsLayed.length
    cardToLayDown = 1
    for (let i = 0; i < len; i++) {
        renderAblagee(cardsLayed[i]);
    }
}


function renderAblagee(ablageCard) {
    //console.log(ablageCard)
    if(ablageCard.length == 0) return
    let symbol = ablageCard.suit.symbol;
    let value = ablageCard.value;
    let cardSpace = document.getElementById("ablageCard"+cardToLayDown);
    cardSpace.innerHTML = "";
    cardSpace.classList.remove("hidden");

    let card = genCard(value, symbol, "ablageCard", ablageCard.id);
    switch(cardToLayDown){
        case 1:
            document.getElementById("ablageCard2").style.zIndex = 1;
            document.getElementById("ablageCard3").style.zIndex = 2;
            break;
        case 2:
            document.getElementById("ablageCard3").style.zIndex = 1;
            document.getElementById("ablageCard1").style.zIndex = 2;
            break;
        case 3:
            document.getElementById("ablageCard1").style.zIndex = 1;
            document.getElementById("ablageCard2").style.zIndex = 2;
            break;
    }

    cardSpace.style.zIndex = 3;

    cardSpace.appendChild(card);

    cardToLayDown = cardToLayDown % 3 + 1;
}

function renderExchangeCard(exchangeCard){
    document.getElementById('changeCardConfirm').classList.add('butPointer')
    let cardSpace = document.getElementById("exchangeCardsContainer");
    const copyCard = exchangeCard.cloneNode(true);
    cardSpace.innerHTML = "";
    cardSpace.appendChild(copyCard);
}
function removeRenderExchangeCard(){
    document.getElementById('changeCardConfirm').classList.remove('butPointer')
    let cardSpace = document.getElementById("exchangeCardsContainer");
    cardSpace.innerHTML = "";
}
