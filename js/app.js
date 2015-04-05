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

    //TODO:  make this.speed random variable within a range
    //of values
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * this.speed);
    this.restart();
    this.render();
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.restart = function() {
    //alert(this.x);
    if (this.x > 500) {
        //alert("Enemy at " + String(this.x));
        this.x = 0;
    }
}



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = "images/char-boy.png";
    this.width = 101;
    this.height = 171;
    this.x = 250 - Math.round((this.width / 2));
    this.y = 530 - (this.height - 50);
}

Player.prototype.update = function(dt) {
    this.checkCollision(allEnemies);
}


Player.prototype.checkCollision = function(allEnemies){

    for(i = 0; i < allEnemies.length; i++){

        if ((this.y < 326 && this.y >= 243) && (allEnemies[i].y + 50 < 326 && allEnemies[i].y + 50 >= 243) ) {
            console.log("in bottom lane");
            //compare x locations
            for ( x = allEnemies[i].x; x <= (allEnemies[i].x + allEnemies[i].width); x++){
                if ( x > this.x && x < (this.x + this.width)) {
                    console.log("Collision!");
                    //reset Player
                    this.x = 250 - Math.round((this.width / 2));
                    this.y = 530 - (this.height - 50);
                }
            }
        }
        if ((this.y < 243 && this.y >= 160) && (allEnemies[i].y + 50 < 243 && allEnemies[i].y + 50 >= 160) ) {
            console.log("in middle lane");
            //compare x locations
            for ( x = allEnemies[i].x; x <= (allEnemies[i].x + allEnemies[i].width); x++){
                if ( x > this.x && x < (this.x + this.width)) {
                    console.log("Collision!");
                    //reset Player
                    this.x = 250 - Math.round((this.width / 2));
                    this.y = 530 - (this.height - 50);
                }
            }
        }
        if ((this.y < 160 && this.y >= 77) && (allEnemies[i].y + 50 < 160 && allEnemies[i].y + 50 >= 77) ) {
            console.log("in top lane");
            //compare x locations
            for ( x = allEnemies[i].x; x <= (allEnemies[i].x + allEnemies[i].width); x++){
                if ( x > this.x && x < (this.x + this.width)) {
                    console.log("Collision!");
                    //reset Player
                    this.x = 250 - Math.round((this.width / 2));
                    this.y = 530 - (this.height - 50);
                }
            }
        }
    }
}


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left' :
            this.x -= 100;
            break;
        case 'right' :
            this.x += 100;
            break;
        case 'up' :
            this.y -= 83;
            break;
        case 'down' :
            this.y += 83;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemy1 = new Enemy(0, 65, 50); //top lane
//var enemy2 = new Enemy(0, 145, 20); //middle lane
//var enemy3 = new Enemy(0, 225, 20); //bottom lane
allEnemies[0] = enemy1;
//allEnemies[1] = enemy2;
//allEnemies[2] = enemy3;
var player = new Player();

//TODO: recycle memory from cleared enemies



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
