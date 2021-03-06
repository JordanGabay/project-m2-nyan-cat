// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
    // We add the background image to the game
    addBackground(this.root);
    // Creating a score property
    this.score = 0;
    //Text 
    this.scoreText = new Text(document.getElementById('app'), '20px', '20px');
    this.resultText= new Text(document.getElementById('app'), '85px', '100px');
    this.scoreText.update(this.score);
  }

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      if(enemy.destroyed === true) {
        this.score = this.score +1;
        this.scoreText.update(this.score);
        return false;
      } else if(enemy.destroyed === false) {return true;}
    });
  
    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
    }

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)
    if (this.isPlayerDead()) {
      window.alert('Game over');
      return;
    }

    // Creating a shooting (bullet) sort of thing.
    if(this.player.canShoot) {
      if(this.player.bulletY < 0) {
        this.player.bulletY = this.player.baseBulletY;
        this.player.bulletDomElement.style.left = `${this.player.x + 30}px`
        this.player.bulletDomElement.style.visibility = 'hidden';
        this.player.canShoot = false;
      } else
      this.player.bulletDomElement.style.visibility = 'unset';
      this.player.bulletY -= timeDiff * 1;
      this.player.bulletDomElement.style.top = `${this.player.bulletY}px`;
    }

    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

  // This method is not implemented correctly, which is why
  // the burger never dies. In your exercises you will fix this method.
  isPlayerDead = () => {
    let isDead = false;
    this.enemies.forEach(enemy => {
      if (enemy.x === this.player.x && enemy.y + ENEMY_HEIGHT > this.player.getY()) {
        isDead = true;
        return;
      }
    });
    return isDead;
  };
}

  
// Restart Button

  var button = document.createElement('button');
  button.innerHTML = 'Restart';

  var body = document.getElementsByTagName('body')[0];
  body.appendChild(button);

  button.addEventListener('click', function refreshPage() {
    if(confirm('Are you sure you want to try again?')) {
      location.reload();
    }
  });

var myElements = document.querySelector('button');
myElements.style.background = 'darkgrey';
myElements.style.marginLeft = '-20';
myElements.style.marginTop = '-20';
myElements.style.fontSize ='50';
myElements.style.borderRadius ='10px';
myElements.style.fontFamily = 'poppins';

//Creating a timer for how long you're alive.

var sec = 0;
    function pad ( timer ) { return timer > 9 ? timer : "0" + timer; }
    setInterval( function(){
        document.getElementById("seconds").innerHTML=pad(++sec%60);
        document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
    }, 1000);

// Twilight Town Music

    var audio = new Audio('twilighttown.mp3');
audio.play();