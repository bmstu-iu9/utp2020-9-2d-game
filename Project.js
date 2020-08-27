const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

width = 800;
height = 600;

canvas.width = 800;
canvas.height = 600;
FPS = 60;
level = 1;

var then, now, elapsed, fpsInterval;

class Obstacle{
    x = 0;
    y = 0;
    width = 100;
    height = 20;
    color = "brown"
    image = new Image();
    set = function (x, y, image) {
        this.x = x;
        this.y = y;
        this.image.src = image;
    }
}

var Enemy = {
    xPrev: 200,
    yPrev: 200,
    width: 32 * 1.5,
    height: 64 * 1.5,
    x: 200,
    y: 200,
    xVelocity: 0,
    yVelocity: 0,
    jump: true,
    color: "red",
    a: 0
}

var player = {
    xPrev: 0,
    yPrev: 0,
    width: 32 * 1.5,
    height: 64 * 1.5,
    x: 0,
    y: 0,
    xVelocity: 0,
    yVelocity: 0,
    jump: false,
    color: "grey",
    a: 0
};

var a = 0;
var k = 1;
var dir;

var obstacles = [];




var controller = {
    left: false,
    right: false,
    up: false,
    keyListener: function (evt) {
        var keyState = (evt.type === "keydown");
        switch (evt.keyCode) {
            case 37:
                controller.left = keyState;
                break;
            case 38:
                controller.up = keyState;
                break;
            case 39:
                controller.right = keyState;
                break;
            case 65:
                controller.hit = keyState;
                break;
        }
    }
}

var startAnimation = function(fps) {
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    animation(then);
}

var animation = function (newTime) {
    window.requestAnimationFrame(animation);
    now = newTime;
    elapsed = now - then;
    if(elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        update(player);
        updateEnemy(Enemy);
        draw();
    }
}

var isCollided = function(obst, obj) {
    return obj.x + obj.width > obst.x
        && obj.x < obst.x + obst.width
        && obj.y < obst.y + obst.height
        && obj.y + obj.height > obst.y;
}

var collideHandler = function (obst, obj) {
    if (isCollided(obst, obj)) {
        if (obj.xPrev >= obst.x + obst.width) {
            obj.x = obst.x + obst.width;
            obj.xVelocity = 0;
        }
        if(obj.xPrev + obj.width <= obst.x) {
            obj.x = obst.x - obj.width;
            obj.xVelocity = 0;
        }
        if (obj.yPrev + obj.height <= obst.y) {
            obj.y = obst.y - obj.height;
            obj.yVelocity = 0;
            obj.jump = false;
        }
        if(obj.yPrev >= obst.y + obst.height) {
            obj.y = obst.y + obst.height;
            obj.yVelocity = 0;
        }
    }
}

var drawRect = function (obj, x, y, a) {
    a = a * (Math.PI / 180);
    var dx = x,
        dy = y;
    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(a);
    ctx.translate(-dx, -dy);
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    ctx.restore();
}



var segmentAnimation = function (obj) {

    var handL = {
        x: obj.x + obj.width / 4,
        y: obj.y + 1.5 * obj.height / 4,
        width: obj.width / 8,
        height: obj.height / 4
    };
    var handR = {
        x: obj.x + 2.5 * obj.width / 4,
        y: obj.y + 1.5 * obj.height / 4,
        width: obj.width / 8,
        height: obj.height / 4
    };
    var legL = {
        x: obj.x + 1.5 * obj.width / 4,
        y: obj.y + 3 * obj.height / 4,
        width: obj.width / 8,
        height: obj.height / 4
    };
    var legR = {
        x: obj.x + 2 * obj.width / 4,
        y: obj.y + 3 * obj.height / 4,
        width: obj.width / 8,
        height: obj.height / 4
    };

    ctx.fillStyle = obj.color;

    var drawControllerAnimation = function (hl, hr, ll, lr) {
        if(hl) drawRect(handL, handL.x + handL.width / 2, handL.y + handL.width / 2, obj.a)
        if(hr) drawRect(handR, handR.x + handR.width / 2, handR.y + handR.width / 2, -obj.a)
        if(ll) drawRect(legL, legL.x + legL.width / 2, legL.y + legL.width / 2, obj.a)
        if(lr) drawRect(legR, legR.x + legR.width / 2, legR.y + legR.width / 2, -obj.a)
    }

    if(obj.xVelocity !== 0 && obj.jump === false){
        if(obj.xVelocity > 0) {
            obj.a += obj.xVelocity * k;
            if (obj.a >= 30) k = -1;
            else if (obj.a <= -30) k = 1;
        } else if(obj.xVelocity < 0) {
            obj.a -= obj.xVelocity * k;
            if (obj.a >= 30) k = -1;
            else if (obj.a <= -30) k = 1;
        }
        drawControllerAnimation(1, 1, 1, 1);
    } else if(obj.yVelocity !== 0){
        obj.a -= obj.yVelocity;
        if(obj.a > 90) obj.a = 90;
        if(obj.a < 20) obj.a = 20;
        drawControllerAnimation(1, 1, 1, 1);

    
          
    
    } else if(controller.hit){
         if(dir === "left"){
             if(random === 1) {
                 drawRect(handL, handL.x + handL.width / 2, handL.y + handL.width / 2, 90)
                drawRect(handR, handR.x + handR.width / 2, handR.y + handR.width / 2, -5)
                 drawRect(legL, legL.x + legL.width / 2, legL.y + legL.width / 2, 5)
                 drawRect(legR, legR.x + legR.width / 2, legR.y + legR.width / 2, -5)
             }
             else {
                 drawRect(handL, handL.x + handL.width / 2, handL.y + handL.width / 2, 5)
                 drawRect(handR, handR.x + handR.width / 2, handR.y + handR.width / 2, -5)
                 drawRect(legL, legL.x + legL.width / 2, legL.y + legL.width / 2, 90)
                 drawRect(legR, legR.x + legR.width / 2, legR.y + legR.width / 2, -5)
             }
         }
         if(dir === "right"){
             if(random === 1) {
                 drawRect(handL, handL.x + handL.width / 2, handL.y + handL.width / 2, 5)
                 drawRect(handR, handR.x + handR.width / 2, handR.y + handR.width / 2, -90)
                 drawRect(legL, legL.x + legL.width / 2, legL.y + legL.width / 2, 5)
                 drawRect(legR, legR.x + legR.width / 2, legR.y + legR.width / 2, -5)
             }
             else {
                 drawRect(handL, handL.x + handL.width / 2, handL.y + handL.width / 2, 5)
                 drawRect(handR, handR.x + handR.width / 2, handR.y + handR.width / 2, -5)
                 drawRect(legL, legL.x + legL.width / 2, legL.y + legL.width / 2, 5)
                 drawRect(legR, legR.x + legR.width / 2, legR.y + legR.width / 2, -90)
             }
         }
    } else if(obj.xVelocity === 0 && !obj.jump) {
        obj.a = 5;
        drawControllerAnimation(1, 1, 1, 1);
    }

}
//var h = document.getElementById("h");
var update = function () {
    player.xPrev = player.x;
    player.yPrev = player.y;var n=100;
if(player.x-Enemy.x==0&&Enemy.color != "green"&&Enemy.color != "blue"){alert("you won");
    player.x=200;
    Enemy.x=700;Enemy.color = "green";
    var h = document.getElementById(h).innerHTML;
h='2';
    
}if(player.x-Enemy.x==0&&Enemy.color == "green" ){alert("you won");Enemy.color = "blue";player.x=200;
    Enemy.x=700;}if(player.x-Enemy.x==0&&Enemy.color == "blue" ){alert("you won");Enemy.color = "yellow";player.x=200;
    Enemy.x=700;}

    if (controller.up && player.jump === false) {
        player.yVelocity -= 15;
        player.jump = true;
    }
    if (controller.left) {
        player.xVelocity -= 3;
        dir = "left";
    }
    if (controller.right) {
        player.xVelocity += 3;
        dir = "right"
    }
    if (controller.hit) {
        if (dir === "left"){
        }
        if (dir === "right"){
        }
    }

    if (player.x - Enemy.x > 50)
  {

    Enemy.x += 5;

    }

    else if (player.x - Enemy.x < -50)
  {

    Enemy.x -= 5;

    }
while(player.x-Enemy.x==0){n=n-10;}

    player.yVelocity += 0.66;
    player.x += player.xVelocity;
    player.y += player.yVelocity;
    if(player.xVelocity > 0) player.xVelocity = Math.floor(player.xVelocity * 0.8);
    else if(player.xVelocity < 0) player.xVelocity = Math.ceil(player.xVelocity * 0.8)

    if(player.yVelocity > 1) player.jump = true;

    if (player.x < 0) player.x = 0;

    if (player.x > width - player.width) player.x = width - player.width;

    if (player.y > height - player.height) {
        player.y = height - player.height;
        player.yVelocity = 0;
        player.jump = false;
    }
    for(var i = 0; i < obstacles.length; i++) {
        collideHandler(obstacles[i], player);
    }
}

var updateEnemy = function (obj) {
    obj.xPrev = obj.x;
    obj.yPrev = obj.y;

    if (obj.dir === "jump" && !obj.jump) {
        obj.yVelocity -= 15;
        obj.jump = true;
    }
    if (obj.dir === "left") {
        obj.xVelocity -= 3;
    }
    if (obj.dir === "right") {
        obj.xVelocity += 3;
        dir = "right"
    }
     if (controller.hit) {
         if (dir === "left"){
         }
         if (dir === "right"){
         }
     }


    obj.yVelocity += 0.66;
    obj.x += obj.xVelocity;
    obj.y += obj.yVelocity;
    if(obj.xVelocity > 0) obj.xVelocity = Math.floor(obj.xVelocity * 0.8);
    else if(obj.xVelocity < 0) obj.xVelocity = Math.ceil(obj.xVelocity * 0.8)

    if(obj.yVelocity > 1) obj.jump = true;

    if (obj.x < 0) obj.x = 0;

    if (obj.x > width - obj.width) obj.x = width - obj.width;

    if (obj.y > height - obj.height) {
        obj.y = height - obj.height;
        obj.yVelocity = 0;
        obj.jump = false;
    }
    if (obj.y < 0) obj.y  = 0;
    for(var i = 0; i < obstacles.length; i++) {
        collideHandler(obstacles[i], obj);
    }
}

var drawObj = function (obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x + 1.5 * obj.width/4, obj.y + obj.height/4, obj.width/4, obj.height/2);
    ctx.beginPath();
    ctx.fillStyle = obj.color;
    ctx.arc(obj.x + obj.width/2, obj.y + obj.width/2.5, obj.width/4, Math.PI * 2, false);
    ctx.fill();
    segmentAnimation(obj);
}

var draw = function (then) {
    ctx.fillStyle = '#50F1FC';
    ctx.fillRect(0, 0, width, height);

    drawObj(player);

    drawObj(Enemy);

    for(var i = 0; i < obstacles.length; i++){
        ctx.drawImage(obstacles[i].image, obstacles[i].x, obstacles[i].y);
    }
}


startAnimation(FPS);

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
var platforms = [];
var platThickness = 10;

// left wall
platforms.push({
    x: 0,
    y: 0,
    width: 10,
    height: height
});
// right wall
platforms.push({
    x: width - 10,
    y: 0,
    width: 10,
    height: height
});
// floor
platforms.push({
    x: 0,
    y: height - 10,
    width: width,
    height: 50
});
// ceiling
platforms.push({
    x: 0,
    y: 0,
    width: width,
    height: platThickness
});
// platforms
document.onreadystatechange = _ => {
    if(document.readyState === 'complete') {
        
        
        
        
        let controlledProgressBar = document.querySelector('.controll');
        let upButton = document.querySelector('#up');
        let downButton = document.querySelector('#down');
        let output = document.querySelector('output');
        
        
        
       
        
        downButton.addEventListener('click', function() {
            controlledProgressBar.value -= 5;
            output.value = controlledProgressBar.value;
        });
        
        upButton.addEventListener('click', function() {
            controlledProgressBar.value += 5;
            output.value = controlledProgressBar.value;
        });
        
        // console.dir(controlledProgressBar)
        
    }
};

function minus(){
    var x = document.getElementById("bar").value;
    document.getElementById("bar").value = x - 5;
}
function plus(){
    var x = document.getElementById("bar").value;
    document.getElementById("bar").value = x + 5;
}
function reset(){
    var x = 0;
    document.getElementById("bar").value = x;
}