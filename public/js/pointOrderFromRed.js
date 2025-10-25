const order = [49,45,41,37,33,29,25,21,17,13,9,5,1,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100,98,94,90,86,82,78,74,70,66,62,58,54,50,46,42,38,34,30,26,22,18,14,10,6,2,3,7,11,15,19,23,27,31,35,39,43,47,51,55,59,63,67,71,75,79,83,87,91,95,99,97,93,89,85,81,77,73,69,65,61,57,53];
const pointsToAddSomethingFuckingSortingToDontBeAnoying = document.getElementById("graph").children;

for (let i = 0; i < order.length; i++) {
    const idx = order[i] - 1;
    if (pointsToAddSomethingFuckingSortingToDontBeAnoying[idx]) {
        pointsToAddSomethingFuckingSortingToDontBeAnoying[idx].dataset.pointId = (1001 + i).toString();
    }
}
// basic error screen on connection problems
const redDotTemp = document.querySelector('[data-point-id="1002"]');
redDotTemp.classList.add("sphereRed");
const redDotTemp2 = document.querySelector('[data-point-id="1003"]');
redDotTemp2.classList.add("sphereRed");