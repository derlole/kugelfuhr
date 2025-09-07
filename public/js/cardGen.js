let handSpace = document.getElementById("hand");
//Anzahl Handkarten

function genCardContent(value, suit) {

    let content = document.createElement("div");

    switch (value) {
        case 1:
            content.innerHTML = `<p class="ass">${suit}</p>`;
            break;
        case 2:
            content.innerHTML = `
            <div class="cardFontSize two">
                <p>${suit}</p>
                <p class="rotated">${suit}</p>
            </div>
            `;
            break;
        case 3:
            content.innerHTML = `
            <div class="cardFontSize three">
                <p>${suit}</p>
                <p>${suit}</p>
                <p class="rotated">${suit}</p>
            </div>
            `;
            break;
        case 4:
            content.innerHTML = `
            <div class="cardFontSize four">
                <div><p>${suit}</p><p>${suit}</p></div>
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>                
            </div>
            `;
            break;
        case 5:
            content.innerHTML = `
            <div class="cardFontSize five">
                <div><p>${suit}</p><p>${suit}</p></div>
                <p>${suit}</p>
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>                
            </div>
            `;
            break;
        case 6:
            content.innerHTML = `
            <div class="cardFontSize six">
                <div><p>${suit}</p><p>${suit}</p></div>
                <div><p>${suit}</p><p>${suit}</p></div>
                <div><p class="rotated">${suit}</p><p class="rotated">${suit}</p></div>                
            </div>
            `;
            break;
        case 7:
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
        case 8:
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
        case 9:
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
        case 10:
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
            <div class="jack">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>swap-horizontal</title>
                    <path d="M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z" />
                </svg>
            </div>`;
            break;
        default:
            content.innerHTML = `<p>?</p>`;
    }
    return content;
}

function genCard(value, suit){
    let role;
    console.log(suit)
    let symbol;

    switch(value){
        case 1:
            role = "A";
            break;
        case 2:
            role = "2";
            break;
        case 3:
            role = "3";
            break;
        case 4:
            role = "4";
            break;
        case 5:
            role = "5";
            break;
        case 6:
            role = "6";
            break;
        case 7:
            role = "7";
            break;
        case 8:
            role = "8";
            break;
        case 9:
            role = "9";
            break;
        case 10:
            role = "10";
            break;
        case "J":
            role = "J";
            break;
        case "Q":
            role = "12";
            break;
        case "K":
            role = "13";
            break;
        default:
            role = "NV";
    }

    switch(suit){
        case "hearts":
            symbol = "♥";
            break;
        case "diamonds":
            symbol = "♦";
            break;
        case "clubs":
            symbol = "♣";
            break;
        case "spades":
            symbol = "♠";
            break;
        default:
            symbol = "NV";
    }

    let card = document.createElement("div");
    card.classList.add("card");
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

    suit === "hearts" || suit === "diamonds" ? card.classList.add("red") : card.classList.add("black");
    let cardMid = card.getElementsByClassName("cardMid")[0];
    cardMid.innerHTML = ""; // vorher leeren
    cardMid.appendChild(genCardContent(value, symbol));
    return card;
}


function renderHand(n) {
  const handSpace = document.getElementById("hand");
  handSpace.innerHTML = ""; // reset
  
  const overlap = 0.4;
  const cardWidth = 8; 
  const totalWidth = (n - 1) * cardWidth * (1 - overlap) + cardWidth;
  let symbol = "hearts";
  let value = "J";
  
  for (let i = 0; i < n; i++) {
    let card = genCard(value, symbol);
    const left = (i * cardWidth * (1 - overlap)) / totalWidth * 100;
    
    card.style.left = `${left}%`;
    card.style.zIndex = i + 1;

    handSpace.appendChild(card);
  }
}

renderHand(5); // Beispiel mit 5 Karten
