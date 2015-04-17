// Sound classes
var Sound = function(mp3FilePath) {
    this.audio = new Audio(mp3FilePath);
}

Sound.prototype.play = function() {
    this.audio.play();
}

Sound.prototype.pause = function() {
    this.audio.pause();
}

Sound.prototype.loop = function() {
    this.audio.loop = true;
}

var GameSounds = function() {
    this.background = new Sound("sounds/autumn.mp3");
    this.youWin = new Sound("sounds/you_win.mp3");
    this.youLose = new Sound("sounds/you_lose.mp3");
}


// Enemies our player must avoid
var Enemy = function(xCoord, yCoord, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = xCoord;
    this.y = yCoord;
    this.width = 101;
    this.height = 171;
    this.speed = speed;
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * this.speed);
    this.restart(dt);
    this.render();
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


Enemy.prototype.restart = function() {
    if (this.x > 500) {
        this.x = -100;
    }
}


// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = "images/char-boy.png";
    this.width = 101;
    this.height = 171;
    this.x = 250 - Math.round((this.width / 2));
    this.y = 530 - (this.height - 50);
    this.livesRemaining = 3;
    this.isWinner = false;
}


Player.prototype.update = function(dt) {
    this.checkGameStatus(allEnemies);
}


Player.prototype.checkGameStatus = function(allEnemies){
    isCollision = false;
    collision = new Audio("sounds/collision1.mp3");

    for(i = 0; i < allEnemies.length; i++){
        if ((this.y < 326 && this.y >= 243) && (allEnemies[i].y + 50 < 326 && allEnemies[i].y + 50 >= 243) ) {
            //console.log("in bottom lane");
            for ( x = allEnemies[i].x; x <= (allEnemies[i].x + allEnemies[i].width); x++){
                if ( x > this.x && x < (this.x + this.width)) {
                    console.log("Collision!");
                    collision.play();
                    isCollision = true;
                }
            }
        }
        if ((this.y < 243 && this.y >= 160) && (allEnemies[i].y + 50 < 243 && allEnemies[i].y + 50 >= 160) ) {
            //console.log("in middle lane");
            for ( x = allEnemies[i].x; x <= (allEnemies[i].x + allEnemies[i].width); x++){
                if ( x > this.x && x < (this.x + this.width)) {
                    console.log("Collision!");
                    collision.play();
                    isCollision = true;
                }
            }
        }
        if ((this.y < 160 && this.y >= 77) && (allEnemies[i].y + 50 < 160 && allEnemies[i].y + 50 >= 77) ) {
            //console.log("in top lane");
            for ( x = allEnemies[i].x; x <= (allEnemies[i].x + allEnemies[i].width); x++){
                if ( x > this.x && x < (this.x + this.width)) {
                    console.log("Collision!");
                    collision.play();
                    isCollision = true;
                }
            }
        }
        if (this.y < 77) {

            if(gameLevel == 3) {
                //console.log("you made it!");
                document.getElementById("game_status").innerHTML = "YOU WIN!";
                document.getElementById("play_again").innerHTML = "<button id='btn' onclick='window.location.href = window.location.href;''>Play Again</button>";
                this.isWinner = true;
                gameSounds.background.pause();
                gameSounds.youWin.play();
                return game_over;

            }else {
                //up the level and restart player
                gameLevel = gameLevel + 1;
                document.getElementById("game_level").innerHTML = gameLevel;
                this.x = 250 - Math.round((this.width / 2));
                this.y = 530 - (this.height - 50);
                allEnemies = [];
                makeEnemies(allEnemies, gameLevel);
            }

        }
    }
    if (isCollision == true) {
        this.x = 250 - Math.round((this.width / 2));
        this.y = 530 - (this.height - 50);
        this.livesRemaining = this.livesRemaining-1;

        if (this.livesRemaining == 0) {
            //"GAME OVER"
            document.getElementById("lives_remaining").innerHTML = String(this.livesRemaining);
            document.getElementById("game_status").innerHTML = "GAME OVER!";
            document.getElementById("play_again").innerHTML = "<button id='btn' onclick='window.location.href = window.location.href;''>Play Again</button>";
            gameSounds.background.pause();
            gameSounds.youLose.play();
            return game_over;
        }
        document.getElementById("lives_remaining").innerHTML = String(this.livesRemaining);
    }
}


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
    jump = new Audio("sounds/jump.mp3");
    bumpEdge = new Audio("sounds/blocked.mp3");

    if(this.isWinner == true) {
        return;
    }
    switch(key) {
        case 'left' :
            if (this.x < 0){
                //play blocked sound & do nothing
                bumpEdge.play();
            }else{
                jump.play();
                this.x -= 100;
            }
            break;
        case 'right' :
            if (this.x > 390){
                //play blocked sound & do nothing
                bumpEdge.play();
            }else{
                jump.play();
                this.x += 100;
            }
            break;
        case 'up' :
            jump.play();
            this.y -= 83;
            break;
        case 'down' :
            if (this.y == 409){
                //play blocked sound & do nothing
                bumpEdge.play();
            }else{
                jump.play();
                this.y += 83;
            }
            break;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
function getLevelInfo(level) {
    var levelInfo = {};
    switch(level) {
        case 1:
            levelInfo = {
                "topLane" : {
                    "xLocs" : [100, 300],
                    "yLoc" : 65,
                    "speed" : 60
                },
                "middleLane" : {
                    "xLocs" : [200, 400],
                    "yLoc" : 145,
                    "speed" : 20
                },
                "bottomLane" : {
                    "xLocs" : [0, 100],
                    "yLoc" : 225,
                    "speed" : 40
                }
            }
        break;
        case 2:
            levelInfo = {
                "topLane" : {
                    "xLocs" : [100, 300],
                    "yLoc" : 65,
                    "speed" : 75
                },
                "middleLane" : {
                    "xLocs" : [200, 400],
                    "yLoc" : 145,
                    "speed" : 35
                },
                "bottomLane" : {
                    "xLocs" : [0, 100],
                    "yLoc" : 225,
                    "speed" : 55
                }
            }
        break;
        case 3:
            levelInfo = {
                "topLane" : {
                    "xLocs" : [100, 300, 500],
                    "yLoc" : 65,
                    "speed" : 90
                },
                "middleLane" : {
                    "xLocs" : [100, 200, 400],
                    "yLoc" : 145,
                    "speed" : 50
                },
                "bottomLane" : {
                    "xLocs" : [0, 100, 300],
                    "yLoc" : 225,
                    "speed" : 70
                }
            }
    }
    return levelInfo;
}

function makeEnemies(allEnemies, level) {
    var levelInfo = getLevelInfo(level);

    for (i = 0; i < levelInfo.topLane.xLocs.length; i++) {
        allEnemies[allEnemies.length] = new Enemy(
            levelInfo.topLane.xLocs[i],
            levelInfo.topLane.yLoc,
            levelInfo.topLane.speed);
    }
    for (i = 0; i < levelInfo.middleLane.xLocs.length; i++) {
        allEnemies[allEnemies.length] = new Enemy(
            levelInfo.middleLane.xLocs[i],
            levelInfo.middleLane.yLoc,
            levelInfo.middleLane.speed);
    }
    for (i = 0; i < levelInfo.bottomLane.xLocs.length; i++) {
        allEnemies[allEnemies.length] = new Enemy(
            levelInfo.bottomLane.xLocs[i],
            levelInfo.bottomLane.yLoc,
            levelInfo.bottomLane.speed);
    }
}

var gameLevel = 1;
var allEnemies = [];
makeEnemies(allEnemies, gameLevel);
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
