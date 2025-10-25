// //PATH

// const N = 33;

// // Parametrisierung der Kurve
// function posCurve(theta) {
//   const r = 100 * Math.cos(2 * theta); // cos(2θ) darf negativ sein, Vorzeichen wichtig
//   return [r * Math.cos(theta), r * Math.sin(theta)];
// }
// function negCurve(theta) {
//   const r = 100 * Math.cos(2 * theta); // cos(2θ) darf negativ sein, Vorzeichen wichtig
//   return [-r * Math.cos(theta), -r * Math.sin(theta)];
// }
// function posNegCurve(theta) {
//   const r = 100 * Math.cos(2 * theta); // cos(2θ) darf negativ sein, Vorzeichen wichtig
//   return [r * Math.cos(theta), -r * Math.sin(theta)];
// }
// function negPosCurve(theta) {
//   const r = 100 * Math.cos(2 * theta); // cos(2θ) darf negativ sein, Vorzeichen wichtig
//   return [-r * Math.cos(theta), r * Math.sin(theta)];
// }

// // Ableitung (für Bogenlänge)
// function ds(theta, dTheta = 1e-4) {
//   const [x1, y1] = posCurve(theta);
//   const [x2, y2] = posCurve(theta + dTheta);
//   return Math.hypot(x2 - x1, y2 - y1) / dTheta;
// }

// // Numerische Integration der Bogenlänge
// function arcLength(theta0, theta1, steps = 5000) {
//   const h = (theta1 - theta0) / steps;
//   let sum = 0;
//   for (let i = 0; i <= steps; i++) {
//     const t = theta0 + i * h;
//     const w = i === 0 || i === steps ? 0.5 : 1; // Trapezregel
//     sum += w * ds(t);
//   }
//   return sum * h;
// }

// // Kurvenabschnitt definieren: z.B. von -Math.PI/4 bis Math.PI/4 (ein "Bogen")
// const thetaStart = -Math.PI / 4;
// const thetaEnd = Math.PI / 4;

// // Gesamtlänge
// const L = arcLength(thetaStart, thetaEnd);

// // Zielabstand
// const step = L / (N - 1);

// // Punkte berechnen
// let points = [];
// let s = 0;
// for (let i = 0; i < N; i++) {
//   const target = i * step;

//   // Numerisch invertieren: finde theta für gewünschte Bogenlänge
//   let lo = thetaStart,
//     hi = thetaEnd;
//   for (let iter = 0; iter < 30; iter++) {
//     const mid = (lo + hi) / 2;
//     const smid = arcLength(thetaStart, mid);
//     if (smid < target) lo = mid;
//     else hi = mid;
//   }
//   const theta = (lo + hi) / 2;

//   const pos = posCurve(theta);
//   const neg = negCurve(theta);
//   points.push(pos);
//   points.push(neg);

//   // Reversed Arrays ans Ende hinzufügen
//   points.push([...pos].reverse());
//   points.push([...neg].reverse());
// }
// points.splice(0, 16);
// points.splice(100, 16);

// // OBEN LINKS
// points[1][0] += 1;
// points[1][1] -= 1;
// points[2][0] += 1;
// points[2][1] -= 1;
// points[5][0] -= 1;
// points[5][1] -= 5;
// points[6][0] += 5;
// points[6][1] += 1;
// points[9][0] -= 1;
// points[9][1] -= 4;
// points[10][0] += 4;
// points[10][1] += 1;
// points[13][0] -= 0.5;
// points[13][1] -= 1.5;
// points[14][0] += 1.5;
// points[14][1] += 0.5;

// // UNTEN RECHTS
// points[0][0] -= 1;
// points[0][1] += 1;
// points[3][0] -= 1;
// points[3][1] += 1;
// points[4][0] += 1;
// points[4][1] += 5;
// points[7][0] -= 5;
// points[7][1] -= 1;
// points[8][0] += 1;
// points[8][1] += 4;
// points[11][0] -= 4;
// points[11][1] -= 1;
// points[12][0] += 0.5;
// points[12][1] += 1.5;
// points[15][0] -= 1.5;
// points[15][1] -= 0.5;

// // UNTEN LINKS
// points[97][0] += 1;
// points[97][1] += 1;
// points[99][0] += 1;
// points[99][1] += 1;
// points[93][0] -= 1;
// points[93][1] += 5;
// points[95][0] += 5;
// points[95][1] -= 1;
// points[89][0] -= 1;
// points[89][1] += 4;
// points[91][0] += 4;
// points[91][1] -= 1;
// points[85][0] -= 0.5;
// points[85][1] += 1.5;
// points[87][0] += 1.5;
// points[87][1] -= 0.5;

// // OBEN Rechts
// points[96][0] -= 1;
// points[96][1] -= 1;
// points[98][0] -= 1;
// points[98][1] -= 1;
// points[92][0] += 1;
// points[92][1] -= 5;
// points[94][0] -= 5;
// points[94][1] += 1;
// points[88][0] += 1;
// points[88][1] -= 4;
// points[90][0] -= 4;
// points[90][1] += 1;
// points[84][0] += 0.5;
// points[84][1] -= 1.5;
// points[86][0] -= 1.5;
// points[86][1] += 0.5;

// const graph = document.getElementById("graph");
// const graphWidth = graph.offsetWidth;
// const graphHeight = graph.offsetHeight;

// // Transformiere Kurven-Koordinaten (x,y) in Pixel:
// const originPx = { x: graphWidth * 0.5, y: graphHeight * 0.5 }; // pixel origin
// const scale = 4.5; // groesse

// points.forEach(([x, y], i) => {
//   const px = originPx.x + x * scale;
//   const py = originPx.y - y * scale; // y-Achse nach oben
//   const d = document.createElement("p");
//   d.innerHTML=gameInFront.field.points[i].pointId;
//   d.style.left = px + "px";
//   d.style.top = py + "px";
//   d.title = `#${i + 1}: (${x.toFixed(3)}, ${y.toFixed(3)})`;
//   graph.appendChild(d);
// });


// //FINISH
// nummerationIndex = 0;
// for (let i = 0; i < 4; i++) {
//   let colors = ["Red", "Blue", "Yellow", "Green"];
//   const finish = document.createElement("div");

//   finish.setAttribute("id", "finish" + colors[i]);
//   finish.className = "finish";
//   nummerationIndex += 10;

//   for (let j = 0; j < 4; j++) {
//     let finLast = document.createElement("div");
//     finLast.className = "finMid";
//     let finThird = document.createElement("div");
//     finThird.className = "finLeft";
//     let finSecond = document.createElement("div");
//     finSecond.className = "finLeft";
//     let finFirst = document.createElement("div");
//     finFirst.className = "finMid";
//     let aktDot = document.createElement("div");
//     aktDot.className = colors[i].toLowerCase() + "Dot";

//     switch(j){
//       case 0:
//         finFirst.appendChild(aktDot);
//         finish.appendChild(finFirst);
//         finFirst.style.gridArea = "finFirst";
//         aktDot.dataset.pointId = nummerationIndex + 5;
//         break;
//       case 1:
//         finSecond.appendChild(aktDot);
//         finish.appendChild(finSecond);
//         finSecond.style.gridArea = "finSecond";
//         aktDot.dataset.pointId = nummerationIndex + 6;
//         break;
//       case 2:
//         finThird.appendChild(aktDot);
//         finish.appendChild(finThird);
//         finThird.style.gridArea = "finThird";
//         aktDot.dataset.pointId = nummerationIndex + 7;
//         break;
//       case 3:
//         finLast.appendChild(aktDot);
//         finish.appendChild(finLast);
//         finLast.style.gridArea = "finLast";
//         aktDot.dataset.pointId = nummerationIndex + 8;
//         break;
//     }

//     switch(i){
//       case 0: //Rot
//         finish.style.rotate = "-45deg";
//         finish.classList.add("finRed");
//         break;
//       case 1://Blau
//         finish.style.rotate = "45deg";
//         finish.classList.add("finBlue");
//         break;
//       case 2://gelb
//         finish.style.rotate = "135deg";
//         finish.classList.add("finYellow");
//         break;
//       case 3://Grün
//         finish.style.rotate = "225deg";
//         finish.classList.add("finGreen");
//         break;
//     }
//   }
//   document.querySelector(".plate").appendChild(finish);
// }
