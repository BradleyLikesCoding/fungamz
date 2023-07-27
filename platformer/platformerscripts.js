 c = document.getElementById("out");
ctx = c.getContext("2d");
var x = 30;
var y = 30;
var keys = [false, false, false, false];
var xv = 0;
var yv = 0;
var inAir = true;
var level = [
  "WWWWWWWWWWWWWWWWWWWW",
  "WBBBBBBBBBBBBBBBBBBW",
  "WBBBBBBBBBBBBBBBBBBW",
  "WBBBBBBBBBBBBBBBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBWBBBBW",
  "WBBBBBBBBBBBBBBBBBBW",
  "WBBBBBBBBBBBBBBBBBBW",
  "WWWWWWWWWWWWWWWWWWWW",
]

function draw() {
  ctx.clearRect(0, 0, 400, 400);
  for (var xLoop = 0; xLoop < level[0].length; xLoop++) {
    for (var yLoop = 0; yLoop < level.length; yLoop++) {
      if (level[yLoop][xLoop] == "W") {
        ctx.fillStyle = "#000000"
        ctx.fillRect((xLoop * 20) - (x - 200), (yLoop * 20) - (y - 200), 20, 20);
      } else if (level[yLoop][xLoop] == "G") {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect((xLoop * 20) - (x - 200), (yLoop * 20) - (y - 200), 20, 20);
      }
    }
  }
  ctx.fillStyle = "#03fc6f"
  ctx.fillRect(190, 190, 20, 20);
}
setInterval(draw, 1);

function check(x2, y2) {
  if (level[y2][x2] == "W") {
    return true;
  }
  return false;
}

function touch(x2, y2) {
  var val = false;
  for (var xLoop = 0; xLoop < 20; xLoop++) {
    for (var yLoop = 0; yLoop < 20; yLoop++) {
      if (xLoop == 19 && yLoop == 19) {}
      if (Math.abs(x2 - ((xLoop * 20) + 10)) < 20 && Math.abs(y2 - ((yLoop * 20) + 10)) < 20) {
        if (check(xLoop, yLoop)) {
          val = true;
        }
      }
    }
  }
  return val;
}

document.addEventListener("keydown", function(event) {
  if (event.keyCode == 87) {
    keys[0] = true;
  }
  if (event.keyCode == 65) {
    keys[1] = true;
  }
  if (event.keyCode == 83) {
    keys[2] = true;
  }
  if (event.keyCode == 68) {
    keys[3] = true;
  }
});

document.addEventListener("keyup", function(event) {
  if (event.keyCode == 87) {
    keys[0] = false;
  }
  if (event.keyCode == 65) {
    keys[1] = false;
  }
  if (event.keyCode == 83) {
    keys[2] = false;
  }
  if (event.keyCode == 68) {
    keys[3] = false;
  }
});

function movePlayer() {
  yv += 0.05;
  if (keys[0] == true && inAir == false) {
    yv = -3;
  }
  if (keys[1] == true) {
    xv -= 0.1;
  }
  if (keys[3] == true) {
    xv += 0.1;
  }
  y += yv;
  inAir = true;
  if (touch(x, y)) {
    if (yv > 0) {
      inAir = false;
    }
    y -= yv;
    yv = 0;
  }
  x += xv;
  if (touch(x, y)) {
    x -= xv;

    if (keys[0] == true) {
      yv = -2;
      if (xv > 0) {
        xv = -3;
      } else {
        xv = 3;
      }
    } else {
      xv = 0;
    }
  }
  xv = xv * 0.965;
}
setInterval(movePlayer, 1);
