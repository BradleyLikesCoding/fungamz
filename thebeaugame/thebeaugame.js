const beauBlue = "#394FBF"; // the best color ever

c = document.getElementById("out"); // canvas for game output
ctx = c.getContext("2d"); // draw on canvas

const defaultHeight = 400; // height of canvas without fullscreen
const defaultWidth = 400; // width of canvas without fullscreen

var ableToShoot = true; // is shot cooldown over?
var shotCooldown = 0; // time until player can shoot

var playerX = -30; // player y
var playerY = -30; // player x

var playerKills = 0;

var keys = [false, false, false, false]; // keys pressed - WASD

var playerXv = 0; // player x velocity
var playerYv = 0; // player y velocity

var ticking = false; // ticking game

const diagnalSpeed = 0.70710678118; // speed to move diagnaly along each axis

const assetAmmount = 3; // the total amount of assets
var collisionMapLoaded = false; // boolean to determine wether the collision map has been loaded
var assetsLoaded = 0; // the amount of assets that have been loaded
var doneLoadingAssets = false; // have all assets been loaded
var collisionMap = new Image(); // load collision map
collisionMap.src = "/thebeaugame/collision-map.png"
var visualMap = new Image(); // load visual map
visualMap.src = "/thebeaugame/visual.png";
var staple = new Image(); // load stapel weapon
staple.src = "/thebeaugame/bullets/staple.png";
visualMap.onload = function() { // tell the game when asset has been loaded
  assetsLoaded++;
}
collisionMap.onload = function() { // tell the game when asset has been loaded
  assetsLoaded++;
  collisionMapLoaded = true;
}
staple.onload = function() { // tell the game when asset has been loaded
  assetsLoaded++;
}

drawLoadingScreen();

var fullScreen = false; // true if user is in fullscreen - user cannot exit fullscreen

var spawnXs = []; // to be filled with x positions enemys can spawn in
var spawnYs = []; // to be filled with y positions enemys can spawn in

const mapWidth = 5000;
const mapHeight = 5000;

var health = 1000;

const waves = [10, 15, 20, 30, 40, 60, 80, 120, 150, 200, 275, 400, 550, 725, 1000, 1300, 1600, 2000, 2600, 3000, 4000, 5250, 6500, 8000, 10000, 1000000]; // the amount of enemys in each wave
var waveIndex = -1; // current wave



function nextWave() {
  waveIndex++;
  if (waveIndex === waves.length) {
    waveIndex = 0;
    wavesComplete();
  } else {
    for (var i = 0; i < waves[waveIndex]; i++) {
      spawnEnemy(waveIndex + 1);
    }
  }
}

function wavesComplete() {
  ticking = false;
  setInterval(drawWin, 1);
}

class Enemy {
  constructor(startx,starty,strength,health) {
    this.color="#FF0000";
    this.strength=strength;
    this.x=startx;
    this.y=starty;
    this.health = health;
  }
}

class Bullet {
  constructor(type, click) {
    this.x = playerX;
    this.y = playerY;
    this.traveled = 0;
    switch (type) {
      case ("staple"):
        this.image = staple;
        this.strength = 1;
        this.travelCap = 150;
        this.xv = click.x * 4 + playerXv;
        this.yv = click.y * 4 + playerYv;
        this.width = staple.width;
        this.height = staple.height;
    }
  }
    tick() {
      this.x += this.xv;
      this.y += this.yv;
      this.traveled++;
      if(this.traveled > this.travelCap) {
        return(false);
      }
      return(true);
    }
}

var enemys = [];
var bullets = [];

function draw() {
  if (fullScreen) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, screen.width, screen.height);
    ctx.drawImage(visualMap, 0 - playerX, 0 - playerY);
    ctx.fillStyle = "#03fc6f";
    ctx.fillRect((screen.width / 2) - 10, (screen.height / 2) - 10, 20, 20);
  } else {
    ctx.clearRect(0, 0, defaultWidth, defaultHeight);
    ctx.drawImage(visualMap, 0 - playerX, 0 - playerY);
    ctx.fillStyle = "#03fc6f";
    ctx.fillRect(190, 190, 20, 20);
  }
}

function touch(x2, y2) {
  if (fullScreen) {
    ctx.clearRect(0, 0, screen.width, screen.height);
    ctx.drawImage(collisionMap, 0 - x2, 0 - y2);
    var imgData1 = ctx.getImageData((screen.width / 2) - 10, (screen.height / 2) - 10, 20, 20);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect((screen.width / 2) - 10, (screen.height / 2) - 10, 20, 20);
    var imgData2 = ctx.getImageData((screen.width / 2) - 10, (screen.height / 2) - 10, 20, 20);
    return (!compare(imgData1.data, imgData2.data));
  } else {
    ctx.clearRect(0, 0, defaultWidth, defaultHeight);
    ctx.drawImage(collisionMap, 0 - x2, 0 - y2);
    var imgData1 = ctx.getImageData(190, 190, 20, 20);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(190, 190, 20, 20);
    var imgData2 = ctx.getImageData(190, 190, 20, 20);
    return (!compare(imgData1.data, imgData2.data));
  }
}

function compare(data1, data2) {
  for (var i = 0; i < data1.length; i++) {
    if (data1[i] !== data2[i]) {
      return (false);
    }
  }
  return (true);
}

function drawLoadingScreen() {
  ctx.clearRect(0, 0, defaultWidth, defaultHeight);
  ctx.font = "50px Arial";
  ctx.fillText("Loading...", 100, 200);
}

document.addEventListener("keydown", function(event) {
  if (event.keyCode === 83) {
    keys[0] = true;
  }
  if (event.keyCode === 87) {
    keys[1] = true;
  }
  if (event.keyCode === 68) {
    keys[2] = true;
  }
  if (event.keyCode === 65) {
    keys[3] = true;
  }
});

document.addEventListener("keyup", function(event) {
  if (event.keyCode === 83) {
    keys[0] = false;
  }
  if (event.keyCode === 87) {
    keys[1] = false;
  }
  if (event.keyCode === 68) {
    keys[2] = false;
  }
  if (event.keyCode === 65) {
    keys[3] = false;
  }
  if (event.keyCode === 84) {
    ticking = !ticking;
  }
  if (event.keyCode === 67) {
    eval(prompt("Code:"));
  }
  if (event.keyCode === 70 && doneLoadingAssets) {
    enterFullscreen();
  }
});

function tickPlayer() {
  if (keys[0] === true) {
    if (keys[2] + keys[3] === 1) {
      playerYv += diagnalSpeed / 10;
    } else {
      playerYv += 0.1;
    }
  }
  if (keys[1] === true) {
    if (keys[2] + keys[3] === 1) {
      playerYv -= diagnalSpeed / 10;
    } else {
      playerYv -= 0.1;
    }
  }
  if (keys[2] === true) {
    if (keys[0] + keys[1] === 1) {
      playerXv += diagnalSpeed / 10;
    } else {
      playerXv += 0.1;
    }
  }
  if (keys[3] === true) {
    if (keys[0] + keys[1] === 1) {
      playerXv -= diagnalSpeed / 10;
    } else {
      playerXv -= 0.1;
    }
  }
  playerX += playerXv;
  if (touch(playerX, playerY)) {
    playerX -= playerXv;
    playerXv = 0;
  }
  playerY += playerYv
  if (touch(playerX, playerY)) {
    playerY -= playerYv;
    playerYv = 0;
  }
  playerXv = playerXv * 0.965;
  playerYv = playerYv * 0.965;
}

function tick() {
  if (assetsLoaded === assetAmmount && !doneLoadingAssets) {
    if (collisionMapLoaded) {
      findEnemySpawnPositions();
    }
    doneLoadingAssets = true;
    ticking = true;
    nextWave();
    var pos = getRandomSpawnPos();
    playerX = 30;
    playerY = 30;
  } else if (assetsLoaded < assetAmmount) {
    drawLoadingScreen();
  }
  if (ticking) {
    try {
      tickPlayer();
      tickPlayer();
      tickEnemys();
      tickEnemys();
      tickBullets();
      tickBullets();
      draw();
      drawEnemys();
      drawBullets();
      drawHealthBar();
    } catch (err) {
      alert(err.message);
    }
  }
}
setInterval(tick, 30);


function findEnemySpawnPositions() {
  for (var i1 = 0; i1 < 5000; i1 += 50) {
    for (var i2 = 0; i2 < 5000; i2 += 50) {
      if (!touch(i1, i2)) {
        spawnXs.push(i1);
        spawnYs.push(i2);
      }
    }
  }
  assetsLoaded++;
}

function getRandomSpawnPos() {
  var i = Math.round(Math.random() * spawnXs.length);
  return ([spawnXs[i], spawnYs[i]]);
}

function calculateDist(x1, y1, x2, y2) {
  return (Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
}

function spawnEnemy(strength) {
  var pos = getRandomSpawnPos();
  enemys.push(new Enemy(pos[0], pos[1], strength, strength * 2));
}

function tickEnemys() {
  var newEnemys = [];
  for (var i = 0; i < enemys.length; i++) {
    var diagnal = false;
    if (playerX - enemys[i].x > 0 && playerX - enemys[i].x > 3) {
      if (Math.abs(playerY - enemys[i].y) < 3) {
        enemys[i].x += diagnalSpeed;
        diagnal = true;
      } else {
        enemys[i].x += 1;
      }
    } else if (playerX - enemys[i].x < 0 && playerX - enemys[i].x < -3) {
      if (Math.abs(playerY - enemys[i].y) < 3) {
        enemys[i].x -= diagnalSpeed;
        diagnal = true;
      } else {
        enemys[i].x -= 1;
      }
    }

    if (playerY - enemys[i].y > 0 && playerY - enemys[i].y > 3) {
      if (diagnal) {
        enemys[i].y += diagnalSpeed;
      } else {
        enemys[i].y += 1;
      }
    } else if (playerY - enemys[i].y < 0 && playerY - enemys[i].y < -3) {
      if (diagnal) {
        enemys[i].y -= diagnalSpeed;
      } else {
        enemys[i].y -= 1;
      }
    }
    enemys[i].health -= enemyBulletCheck(enemys[i]);
    if(enemys[i].health > 0) {newEnemys.push(enemys[i]) } else { playerKills++;}
  }
  enemys = newEnemys;
  checkEnemysHitPlayer();
  if (enemys.length < 1) {
    nextWave();
  }
}

function tickBullets() {
  var newBullets = [];
  for(var i = 0; i < bullets.length; i++) {
    if(bullets[i].tick()) newBullets.push(bullets[i]);
  }
  bullets = newBullets;
}

function drawEnemys() {
  for (var i = 0; i < enemys.length; i++) {
    if (fullScreen) {
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(((screen.width / 2) - 10) + (enemys[i].x - playerX), ((screen.height / 2) - 10) + (enemys[i].y - playerY), 20, 20);
    } else {
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(190 + (enemys[i].x - playerX), 190 + (enemys[i].y - playerY), 20, 20);
    }
  }
}

function drawBullets() {
  for (var i = 0; i < bullets.length; i++) {
    if (fullScreen) {
      ctx.drawImage(staple, ((screen.width / 2) - 10) + (bullets[i].x - playerX), ((screen.height / 2) - 10) + (bullets[i].y - playerY));
    } else {
      ctx.drawImage(staple, 190 + (bullets[i].x - playerX), 190 + (bullets[i].y - playerY));
    }
  }
}

function checkEnemysHitPlayer() {
  for (var i = 0; i < enemys.length; i++) {
    if (Math.abs(enemys[i].x - playerX) < 20 && Math.abs(enemys[i].y - playerY) < 20) {
      health -= enemys[i].strength;
    }
  }
}

function drawStartMenu() {
  ctx.fillStyle = beauBlue;
  ctx.fillRect(0, 0, c.width, c.height);
  if (fullScreen) {

  } else {

  }
}

function drawHealthBar() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(c.width / 4 - 15, (c.height - (c.height / 10)) - 15, c.width / 2 + 30, c.height);
  ctx.fillStyle = "#FF0000";
  if (health > 0) {
    ctx.fillRect(c.width / 4, c.height - (c.height / 10), (health / 1000) * c.width / 2, c.height);
  } else {
    died();
  }
}

function died() {
  ticking = false;
  setInterval(drawDeathScreen, 1);
}

function drawDeathScreen() {
  ctx.fillStyle = "#000000"
  if (fullScreen) {
    ctx.fillRect(0, 0, screen.width, screen.height);
    ctx.fillStyle = "#FF0000";
    ctx.font = "150px Arial";
    ctx.fillText("You Died. Imagine.", 100, 200);
  } else {
    ctx.fillRect(0, 0, defaultHeight, defaultWidth);
    ctx.fillStyle = "#FF0000";
    ctx.font = "50px Arial";
    ctx.fillText("You Died. Imagine.", 100, 200);
  }
}

//FINISH CREATESTAPEL FUNCTION THEN MAKE SHOOTIFABLE CALL IT :D
//FIX CLEARINTERVAL

//function createstapel(pos) {
//  return;
//}
//addEventListener("mousedown", function() {
//  setInterval(shootIfAble, 1);
//});
//addEventListener("mouseup", function() {
//  clearInterval(shootIfAble);
//});
//function shootIfAble() {
//  if(shotCooldown === 0) {
//    shotCooldown = 100;
//  }
//}
//
//function shootClock() {
//  if(shotCooldown > 0) {
//    shotCooldown--;
//  }
//}

function handleClick(event) {
  var pos = {
    y: Math.floor(((event.clientY + window.scrollY) - c.offsetTop)),
    x: Math.floor(((event.clientX + window.scrollX) - c.offsetLeft))
  }
  bullets.push(new Bullet("staple", getMovementRatio(pos)));
}

function getMovementRatio(pos) {
  var angle;
  if(fullScreen) {
    angle = Math.atan2(pos.x - (screen.width / 2), pos.y - (screen.height / 2));
  } else {
    angle = Math.atan2(pos.x - 200, pos.y - 200);
  }
  return ({
	x: Math.sin(angle), 
  y: Math.cos(angle),
  a: angle * 57.2958
});
}

function enemyBulletCheck(e) {
  var damage = 0;
  for(var i = 0; i < bullets.length; i++) {
    if(hitboxCollision({
      x1:bullets[i].x, y1:bullets[i].y,
      x2:bullets[i].x + bullets[i].width,
      y2:bullets[i].y + bullets[i].height
      }, {x1:e.x, y1:e.y, x2:e.x + 20, y2:e.y + 20})) {
        damage += bullets[i].strength;
        bullets[i].traveled = bullets[i].travelCap + 1;
     }
  }
  return(damage);
}

function hitboxCollision(pos1, pos2) {
  if (pos2.x1 > pos1.x2 || pos1.x1 > pos2.x2 || pos2.y1 > pos1.y2 || pos1.y1 > pos2.y2) {
    return(false);
  } else {
    return(true);
  }
}

function drawWin() {
  //FINISH
}

function checkFullscreen() {
  fullScreen = Boolean(document.fullscreenElement);
}

function enterFullscreen() {
  if(c.requestFullscreen) {
    c.requestFullscreen();
    c.width = screen.width;
    c.height = screen.height;
    if (!fullScreen) {
      playerX -= screen.width / 2 - (defaultWidth / 2);
      playerY -= screen.height / 2 - (defaultHeight / 2);
      for (var i = 0; i < enemys.length; i++) {
        enemys[i].x -= screen.width / 2 - (defaultWidth / 2);
        enemys[i].y -= screen.height / 2 - (defaultHeight / 2);
      }
      for (var i = 0; i < bullets.length; i++) {
        bullets[i].x -= screen.width / 2 - (defaultWidth / 2);
        bullets[i].y -= screen.height / 2 - (defaultHeight / 2);
      }
    }
    fullScreen = true;
  }
}