let handSpace = document.getElementById("hand");
//Anzahl Handkarten
let n = 5;

function genCard(value, suit){
    let role;
    let color;

    switch(value){
        case 1:
            role = "1 / 11";
            break;
        case 2:
            role = "2";
            break;
        case 3:
            role = "3";
            break;
        case 4:
            role = "-4";
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
            role = "<->";
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
            color = "<3";
            break;
        case "diamonds":
            color = "♦";
            break;
        case "clubs":
            color = "♣";
            break;
        case "spades":
            color = "♠";
            break;
        default:
            color = "NV";
    }

    let card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <div class="cardTop">
            <p class="cardCorner">${role}</p>
            <p class="cardCorner">${role}</p>
        </div>
        <div class="cardMid">${color}</div>
        <div class="cardBot">
            <p class="cardCorner rotated">${role}</p>
            <p class="cardCorner rotated">${role}</p>
        </div>`;
    return card;
}

for (let i = 0; i < n; i++) {
  let card = genCard("J", "diamonds"); // ersteres: value zweiteres: suit
  handSpace.appendChild(card);
}
