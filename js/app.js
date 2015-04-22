// Sound classes
var Sound = function(mp3FilePath) {
    this.audio = new Audio(mp3FilePath);
};

Sound.prototype.play = function() {
    this.audio.play();
};

Sound.prototype.pause = function() {
    this.audio.pause();
};

Sound.prototype.loop = function() {
    this.audio.loop = true;
};


var GameSounds = function() {
    this.background = new Sound("sounds/autumn.mp3");
    this.youWin = new Sound("sounds/you_win.mp3");
    this.youLose = new Sound("sounds/you_lose.mp3");
};


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
    //console.log("enemy - x:" + this.x + "; y: " + this.y + "; speed: " + this.speed);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * this.speed);
    this.restart(dt);
    this.render();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.restart = function() {
    if (this.x > 500) {
        this.x = -100;
    }
};


// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.width = 101;
    this.height = 171;
    this.x = 250 - Math.round((this.width / 2));
    this.y = 530 - (this.height - 50);
    this.livesRemaining = 3;
    this.gameOn = true;
};

Player.prototype.update = function(dt) {
    this.checkGameStatus(allEnemies);
};

Player.prototype.checkGameStatus = function(allEnemies){
    var isCollision = false;
    collision = new Audio('sounds/collision1.mp3');

    //adjust environment according to game status
    //called by checkGameStatus when game is over
    function adjustGameEnv(status) {
        gameSounds.background.pause();
        document.getElementById('play-again').innerHTML = '<button id="btn" onclick="window.location.href = window.location.href;">Play Again</button>';

        if (status == 'winner') {
            document.getElementById('game-status').innerHTML = 'YOU WIN!';
            gameSounds.youWin.play();
        }
        if (status == 'loser') {
            document.getElementById('lives-remaining').innerHTML = String(this.livesRemaining);
            document.getElementById('game-status').innerHTML = 'GAME OVER!';
            gameSounds.youLose.play();
        }
    }

    //check for collision
    for (var i = 0; i < allEnemies.length; i++){
        if ((this.y < 326 && this.y >= 243) && (allEnemies[i].y + 50 < 326 && allEnemies[i].y + 50 >= 243) ) {
            //console.log("in bottom lane");
            for (var x = allEnemies[i].x; x <= (allEnemies[i].x + allEnemies[i].width); x++){
                if (x > this.x && x < (this.x + this.width)) {
                    //console.log("Collision!");
                    collision.play();
                    isCollision = true;
                }
            }
        }
        if ((this.y < 243 && this.y >= 160) && (allEnemies[i].y + 50 < 243 && allEnemies[i].y + 50 >= 160) ) {
            //console.log("in middle lane");
            for (var x = allEnemies[i].x; x <= (allEnemies[i].x + allEnemies[i].width); x++){
                if (x > this.x && x < (this.x + this.width)) {
                    //console.log("Collision!");
                    collision.play();
                    isCollision = true;
                }
            }
        }
        if ((this.y < 160 && this.y >= 77) && (allEnemies[i].y + 50 < 160 && allEnemies[i].y + 50 >= 77) ) {
            //console.log("in top lane");
            for (var x = allEnemies[i].x; x <= (allEnemies[i].x + allEnemies[i].width); x++){
                if (x > this.x && x < (this.x + this.width)) {
                    //console.log("Collision!");
                    collision.play();
                    isCollision = true;
                }
            }
        }

        //check for a WIN or Next Level
        if (this.y < 77) {
            if (gameLevel.level == 3) {
                adjustGameEnv('winner');
                this.gameOn = false;
            } else {
                //up the level and restart player
                gameLevel.updateLevel();
                this.x = 250 - Math.round((this.width / 2));
                this.y = 530 - (this.height - 50);
            }
        }
    }

    //if collision, update lives and check for a LOSS
    if (isCollision == true) {
        this.x = 250 - Math.round((this.width / 2));
        this.y = 530 - (this.height - 50);
        this.livesRemaining = this.livesRemaining-1;

        if (this.livesRemaining == 0) {
            adjustGameEnv('loser');
            this.gameOn = false;
        }
        document.getElementById("lives-remaining").innerHTML = String(this.livesRemaining);
    }
};


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.handleInput = function(key) {
    var jump = new Audio("sounds/jump.mp3");
    var bumpEdge = new Audio("sounds/blocked.mp3");

    if (this.gameOn == false) {
        return;
    }
    switch(key) {
        case 'left' :
            if (this.x < 0){
                //play blocked sound & do nothing
                bumpEdge.play();
            } else {
                jump.play();
                this.x -= 100;
            }
            break;
        case 'right' :
            if (this.x > 390){
                //play blocked sound & do nothing
                bumpEdge.play();
            } else {
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
            } else {
                jump.play();
                this.y += 83;
            }
            break;
    }
};


/*The GameLevel class manages and tracks which level the Player is on
* and updates game play at each new level with new enemies (including new
* enemy: objects, locations, and speeds)*/
var GameLevel = function(){
    this.level = 0;
    this.updateLevel();
};

GameLevel.prototype.updateLevel = function(){
    this.level = this.level + 1;
    document.getElementById("game-level").innerHTML = this.level;
    this.makeEnemies();
};

//create enemy objects for each corresponding level
GameLevel.prototype.makeEnemies = function() {
    function getEnemyInfo(level) {
        var enemyInfo = {};
        switch(level) {
            case 1:
                enemyInfo = {
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
                };
            break;
            case 2:
                enemyInfo = {
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
                };
            break;
            case 3:
                enemyInfo = {
                    "topLane" : {
                        "xLocs" : [300, 500],
                        "yLoc" : 65,
                        "speed" : 90
                    },
                    "middleLane" : {
                        "xLocs" : [100, 200, 400],
                        "yLoc" : 145,
                        "speed" : 50
                    },
                    "bottomLane" : {
                        "xLocs" : [0, 200],
                        "yLoc" : 225,
                        "speed" : 70
                    }
                }
        }
        return enemyInfo;
    }

    //reset allEnemies[] to prepare for new level enemies
    allEnemies = [];
    enemyInfo = getEnemyInfo(this.level);

    //use enemyInfo as data input to create new level enemies
    for (var i = 0; i < enemyInfo.topLane.xLocs.length; i++) {
        allEnemies[allEnemies.length] = new Enemy(
            enemyInfo.topLane.xLocs[i],
            enemyInfo.topLane.yLoc,
            enemyInfo.topLane.speed);
    }
    for (var i = 0; i < enemyInfo.middleLane.xLocs.length; i++) {
        allEnemies[allEnemies.length] = new Enemy(
            enemyInfo.middleLane.xLocs[i],
            enemyInfo.middleLane.yLoc,
            enemyInfo.middleLane.speed);
    }
    for (var i = 0; i < enemyInfo.bottomLane.xLocs.length; i++) {
        allEnemies[allEnemies.length] = new Enemy(
            enemyInfo.bottomLane.xLocs[i],
            enemyInfo.bottomLane.yLoc,
            enemyInfo.bottomLane.speed);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var gameLevel = new GameLevel();
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