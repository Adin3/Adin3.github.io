
const ARROW_KEYS = {
    ESCAPE : 27,
}

const GAME_STATE = {
    RUNNING : 1,
    PAUSED : 2,
}

const PHOTO_STATE = {
    FIRST : 0,
    SECOND : 1,
    THIRD : 2,
    FORTH : 3,
    FIFTH : 4,
}

class Player {
    constructor(gameWidth, gameHeight) {

        this.image = document.getElementById("lada");
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 70;
        this.height = 50;

        this.maxSpeed = 2;
        this.Quit = false;

        this.health = 3;

        this.gameState = GAME_STATE.RUNNING;

        this.position = {
            x : gameWidth / 2,
            y : this.gameHeight - this.height,
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime) {
        if(!deltaTime) return;

        this.position.x = x;

        if(this.position.x < 0) this.position.x = 0;
        if(this.position.x + this.width > this.gameWidth) this.position.x = this.gameWidth - this.width;
        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y + this.height > this.gameHeight) this.position.y = this.gameHeight - this.height;

        if(this.health <= 0) {
            this.health = 0;
            if(this.Quit == false) {
              alert("Ai pierdut Qmetre\nPoate alta data");
              this.Quit = true;
              location.reload();
            }

        }
    }
}

class Bere {
    constructor(gameWidth, gameHeight, speed) {

        this.image = document.getElementById("bere");
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.height = 80;
        this.width = 40;

        this.speed = speed;

        this.isHit = false;

        this.position = {
            x : Math.random() * (this.gameWidth - this.width),
            y : -this.height,
        }

    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    collision() {

        if(this.position.x < player.position.x + player.width &&
            this.position.x + this.width > player.position.x &&
            this.position.y < player.position.y + player.height &&
            this.position.y + this.height > player.position.y) {
                this.isHit = true;
                score += 100;
                document.getElementById("score").innerHTML = score.toString();
        }

    }

    update(deltaTime, index) {
        if(!deltaTime) return;

        this.position.y += this.speed * deltaTime;

        this.collision();

        if(this.position.y > this.gameHeight) {
            player.health--;
            document.getElementById("health").innerHTML = player.health.toString() + " &#10084";
            bere.splice(index, 1);
        }


    }
}

class Input {
    constructor(player) {
        document.addEventListener("keydown", event => {
            switch(event.keyCode) {
                case ARROW_KEYS.ESCAPE :
                    //alert("ESCAPE");
                    pause();
                    break;
            }})

        window.addEventListener('mousemove', function (e) {
            x = e.clientX - (1920 - GAME_WIDTH) / 2;
        })
    }
}

let canvas = document.getElementById ("GameScreen");
let ctx = canvas.getContext ('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 800;

let x;
let score = 0;
let time = 500;
let speed = 0.5;
let isTrue = []; isTrue[0] = true;
var intervalID;
let player = new Player(GAME_WIDTH, GAME_HEIGHT);
//let bere = new Bere(GAME_WIDTH, GAME_HEIGHT);
let bere = [];

new Input(player);
let lastTime = 0;


let photoState = PHOTO_STATE.FIRST;
function photoChange() {
    switch(photoState) {
        case PHOTO_STATE.FIRST :
            document.getElementById("poza").src = "img/poz1.png";
			photoState = PHOTO_STATE.SECOND;
        break;
		case PHOTO_STATE.SECOND :
			document.getElementById("poza").src = "img/poz2.png";
			photoState = PHOTO_STATE.THIRD;
		break;
		case PHOTO_STATE.THIRD :
			document.getElementById("poza").src = "img/poz3.png";
			photoState = PHOTO_STATE.FORTH;
		break;
		case PHOTO_STATE.FORTH :
			document.getElementById("poza").src = "img/poz4.png";
			photoState = PHOTO_STATE.FIFTH;
		break;
		case PHOTO_STATE.FIFTH :
			document.getElementById("poza").src = "img/poz5.png";
		break;
    }
}

photoChange();

function startInterval(time) {
    intervalID = setInterval(spawnBere, time);
}

function spawnBere() {
    bere.push(new Bere(GAME_WIDTH, GAME_HEIGHT, speed));
}

startInterval(time);

function pause() {
    if(player.gameState == GAME_STATE.PAUSED) {
        player.gameState = GAME_STATE.RUNNING;
        startInterval(time);
    }
    else {
        player.gameState = GAME_STATE.PAUSED;
        clearInterval(intervalID);
    }
}

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    gameUpdate(deltaTime);
    gameDraw();
    gameLevel();

    requestAnimationFrame(gameLoop);
}

function gameUpdate(deltaTime) {

    if(player.gameState == GAME_STATE.PAUSED) {
        ctx.font = "30px Comic Sans MS";
        ctx.fillStyle = "White";
        ctx.textAlign = "center";
        ctx.fillText("Pauza", GAME_WIDTH / 2, GAME_HEIGHT / 2);
        return;
    }

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    player.update(deltaTime);
    if(bere != undefined) {
        for(var i = 0; i < bere.length; i++) {
            if(bere[i].isHit) {
                bere.splice(i, 1);
            }
            if(bere[i] != undefined)
                bere[i].update(deltaTime, i);
        }
    }

}

function gameDraw() {
    player.draw(ctx);
    if(bere != undefined) {
        for(var i = 0; i < bere.length; i++) {
            bere[i].draw(ctx);
        }
    }

}

function gameLevel() {
    if(score >= 2000 && isTrue[0] == true) {
        levelTemplate(0.6,200);
        isTrue[0] = false;
        isTrue[1] = true;
    }
    if(score >= 4000 && isTrue[1] == true) {
        levelTemplate(0.7,50);
        isTrue[1] = false;
        isTrue[2] = true;
    }
    if(score >= 7000 && isTrue[2] == true) {
        levelTemplate(0.8,50);
        isTrue[2] = false;
        isTrue[3] = true;
    }
    if(score >= 10000 && isTrue[3] == true) {
        levelTemplate(1, 50);
        isTrue[3] = false;
        isTrue[4] = true;
    }
}

function levelTemplate(spd, tp) {
	photoChange();
    speed = spd;
    bere.speed = speed;
    clearInterval(intervalID)
    time -= tp;
    startInterval(time);
}

gameLoop();
