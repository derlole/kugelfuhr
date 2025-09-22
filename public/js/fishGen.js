const canvas = document.getElementById('aquarium');
const ctx = canvas.getContext('2d');
const sharkImg = document.getElementById('sharkGif');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const fishImages = [];
for (let i = 1; i < 12; i++) {
  const img = new Image();
  img.src = '/img/fischies/' + i + '.png';
  fishImages.push(img);
}

let shark = {
  x: -1300,
  y: Math.random() * canvas.height,
  speed: 1 + Math.random() * 6,
  wiggle: 1 + Math.random() * 2
};

function createFish() {
  const dir = Math.random() < 0.5 ? 1 : -1;
  return {
    x: dir === 1 ? -50 : canvas.width + 50,
    baseY: Math.random() * canvas.height,    
    y: 0,
    speed: dir * (1 + Math.random() * 2),        
    amplitude: 20 + Math.random() * 80,       
    frequency: 0.005 + Math.random() * 0.02,    
    phase: Math.random() * Math.PI * 2,          
    image: fishImages[Math.floor(Math.random() * fishImages.length)],
    dir: dir
  };
}
const gifFish = new Image();
gifFish.src = '/img/schnappishark.gif'; 

let simpleFish = {
  x: -50,
  y: Math.random() * canvas.height,
  speed: 2 
};

let fishes = Array.from({length: 20}, createFish);

function animate(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fishes.forEach(f => {
    f.x += f.speed;
    f.y = f.baseY +
          f.amplitude * Math.sin(f.frequency * f.x + f.phase);

    if (f.dir === 1 && f.x > canvas.width + 50 ||
        f.dir === -1 && f.x < -50) {
      Object.assign(f, createFish());
    }

    if (f.dir === 1) {
      ctx.drawImage(f.image, f.x, f.y, 50, 30);
    } else {
      ctx.save();
      ctx.translate(f.x + 50, f.y);
      ctx.scale(-1, 1);
      ctx.drawImage(f.image, 0, 0, 50, 30);
      ctx.restore();
    }
  });
  shark.x += shark.speed;
  shark.y += Math.sin(shark.x * 0.02) * shark.wiggle;

  if (shark.x > canvas.width + 320) {
    shark.x = -3000;
    shark.y = Math.random() * canvas.height;
    shark.speed = 1 + Math.random() * 6;
    shark.wiggle = 1 + Math.random() * 2;
  }

  sharkImg.style.left = shark.x + 'px';
  sharkImg.style.top = shark.y + 'px';

  requestAnimationFrame(animate);
}

Promise.all(fishImages.map(img => new Promise(res => img.onload = res)))
  .then(() => animate());