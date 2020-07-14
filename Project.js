const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

width = 800;
height = 600;

canvas.width = 800;
canvas.height = 600;
FPS = 60;

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

class Enemy {
    static x = 0;
    static y = 0;
    static width = 32;
    static height = 64;
    static color = "red";
    static image = new Image();
    static damage = 5;
    static health = 100;
    set = function (x, y, image, damage, health) {
        Enemy.x = x;
        Enemy.y = y;
        Enemy.image.src = image;
        Enemy.damage = damage;
        Enemy.health = health;
    }
}

var player = {
    xPrev: 0,
    yPrev: 0,
    width: 32,
    height: 64,
    x: 0,
    y: 0,
    xVelocity: 0,
    yVelocity: 0,
    jump: false
};

var a = 0;
var k = 1;
var dir;

var enemyes = [];

enemyes[0] = new Enemy();
enemyes[0].set();

var obstacles = [];

obstacles[0] = new Obstacle();
obstacles[0].set(100, 500, "img/pf.png");
obstacles[1] = new Obstacle();
obstacles[1].set(200, 400, "img/pf.png");
obstacles[2] = new Obstacle();
obstacles[2].set(300, 300, "img/pf.png");



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
        update();
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

var segmentAnimation = function () {

    const random = Math.floor(Math.random() * 2);
    var handL = {
        x: player.x + player.width / 4,
        y: player.y + 1.5 * player.height / 4,
        width: player.width / 8,
        height: player.height / 4
    };
    var handR = {
        x: player.x + 2.5 * player.width / 4,
        y: player.y + 1.5 * player.height / 4,
        width: player.width / 8,
        height: player.height / 4
    };
    var legL = {
        x: player.x + 1.5 * player.width / 4,
        y: player.y + 3 * player.height / 4,
        width: player.width / 8,
        height: player.height / 4
    };
    var legR = {
        x: player.x + 2 * player.width / 4,
        y: player.y + 3 * player.height / 4,
        width: player.width / 8,
        height: player.height / 4
    };

    ctx.fillStyle = '#000000';

    var drawControllerAnimation = function (hl, hr, ll, lr) {
        if(hl) drawRect(handL, handL.x + handL.width / 2, handL.y + handL.width / 2, a)
        if(hr) drawRect(handR, handR.x + handR.width / 2, handR.y + handR.width / 2, -a)
        if(ll) drawRect(legL, legL.x + legL.width / 2, legL.y + legL.width / 2, a)
        if(lr) drawRect(legR, legR.x + legR.width / 2, legR.y + legR.width / 2, -a)
    }

    if((controller.left || controller.right) && player.jump === false){
        if(controller.right) {
            a += player.xVelocity * k;
            if (a >= 30) k = -1;
            else if (a <= -30) k = 1;
        } else {
            a -= player.xVelocity * k;
            if (a >= 30) k = -1;
            else if (a <= -30) k = 1;
        }
        drawControllerAnimation(1, 1, 1, 1);
    } else if(player.yVelocity !== 0){
        a -= player.yVelocity;
        if(a > 90) a = 90;
        if(a < 20) a = 20;
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
    } else {
        a = 5;
        drawControllerAnimation(1, 1, 1, 1);
    }

}

var update = function () {
    player.xPrev = player.x;
    player.yPrev = player.y;

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


    player.yVelocity += 0.66;
    player.x += player.xVelocity;
    player.y += player.yVelocity;
    player.xVelocity *= 0.7;

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

var draw = function (then) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + player.width/4, player.y, player.width/2, player.height/4)
    ctx.fillRect(player.x + 1.5 * player.width/4, player.y + player.height/4, player.width/4, player.height/2)
    segmentAnimation();

    for(var i = 0; i < obstacles.length; i++){
        ctx.drawImage(obstacles[i].image, obstacles[i].x, obstacles[i].y);
    }
}

startAnimation(FPS);

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);