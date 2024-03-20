const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
ctx.font = '50px Impact';

let timeToNextraven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];
class Raven {
  constructor(){
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.delationMark = false;
    this.image = new Image();
    this.image.src = '/assets/images/raven.png';
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    this.color = 'rgb('+ this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';

  }
  update(deltaTime){
    if(this.y < 0 || this.y > canvas.height - this.height){
      this.directionY = this.directionY * -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if(this.x < 0 - this.width) this.delationMark = true;
    this.timeSinceFlap += deltaTime;
    if(this.timeSinceFlap > this.flapInterval ){
      if(this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;

    }
  }
  draw(){
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);

    ctx.drawImage(this.image,this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

function drawScore(){
  ctx.fillStyle = 'black';
  ctx.fillText('Score: '+ score , 55 , 83);

  ctx.fillStyle = 'white';
  ctx.fillText('Score: '+ score , 52 , 80);
}

window.addEventListener('click', function(r){
  const detectPixelColor = collisionCtx.getImageData(r.x, r.y, 1, 1);
  const pc = detectPixelColor.data;
  ravens.forEach(raven => {
    if(raven.randomColors[0] === pc[0] && raven.randomColors[1] === pc[1] && raven.randomColors[2] === pc[2]){
      raven.delationMark = true;
      score++;
    }
  })

  console.log(detectPixelColor);
});

function animate(timeStamp)
{
  ctx.clearRect(0,0, canvas.width, canvas.height);
  collisionCtx.clearRect(0,0, canvas.width, canvas.height);

  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  timeToNextraven += deltaTime;
  if(timeToNextraven > ravenInterval){
    ravens.push(new Raven());
    timeToNextraven = 0;
    ravens.sort(function(a, b){
      return a.width - b.width;
    });
  };
  drawScore();
  [...ravens].forEach(raven => raven.update(deltaTime));
  [...ravens].forEach(raven => raven.draw());
  ravens = ravens .filter(raven => !raven.delationMark);

  requestAnimationFrame(animate); //infinite loop
}
animate(0);