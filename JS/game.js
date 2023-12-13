const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


canvas.width = 1280
canvas.height = 720
let timeElapsed = 0;
let isGameOver = false;


const gravity = 0.6
const HEALTH_FULL_WIDTH = parseFloat(window.getComputedStyle(document.querySelector('#health')).width);
const SHIELD_FULL_WIDTH = parseFloat(window.getComputedStyle(document.querySelector('#shield')).width);
const backgroundImage = new Image();

// Set the source of the image
backgroundImage.src = '';

// Ensure the image is loaded before drawing it
backgroundImage.onload = function () {
    // Draw the image on the canvas
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
};

class Enemy {
    constructor({ position, velocity, color, width, height }) {
        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.width = width;
        this.height = height;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        // Update position based on velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class TrackingEnemy extends Enemy {
    constructor({ position, color, width, height }) {
        super({ position, velocity: { x: 0, y: 0 }, color, width, height });
    }

    update() {
        // Update velocity to target the player
        const angle = Math.atan2(player.position.y - this.position.y, player.position.x - this.position.x);
        this.velocity.x = Math.cos(angle);
        this.velocity.y = Math.sin(angle);

        super.update(); // Call the update method of the base class
    }
}


const enemies = [];

let spawnInterval = 1500; // Start with an interval of 1500 milliseconds

function spawnEnemies() {
    function spawn() {
        if (isGameOver){
            return;
        }
        const size = 30;
        const position = { x: 0, y: 0 };
        const edge = Math.floor(Math.random() * 4); // 0 - top, 1 - right, 2 - bottom, 3 - left
        let speedMultiplier = 3;
        switch (edge) {
            case 0: // Top
                position.x = Math.random() * canvas.width;
                position.y = -size;
                break;
            case 1: // Right
                position.x = canvas.width;
                position.y = Math.random() * (canvas.height - 15 - size); // Spawn above the bottom with a buffer
                break;
            case 3: // Left
                position.x = -size;
                position.y = Math.random() * (canvas.height - 15 - size); // Spawn above the bottom with a buffer
                break;
        }

        let color, enemyType;
        const randomSelection = Math.random();
        if (timeElapsed < 60 * 1000) {
            color = 'purple';
            enemyType = Enemy;
        } else if (timeElapsed < 120 * 1000) {
            if (randomSelection < 0.5) {
                color = 'purple';
                enemyType = Enemy;
            } else {
                color = 'orange';
                enemyType = TrackingEnemy;
                speedMultiplier = 4.5; // Adjust speed for tracking enemies
            }
        } else {
            color = randomSelection < 0.3 ? 'purple' : 'orange';
            enemyType = color === 'purple' ? Enemy : TrackingEnemy;
            speedMultiplier = color === 'purple' ? 3 : 4.5; // Adjust speed based on enemy type
        }

        // Set the velocity
        const angle = Math.atan2(player.position.y - position.y, player.position.x - position.x);
        const velocity = {
            x: Math.cos(angle) * speedMultiplier,
            y: Math.sin(angle) * speedMultiplier
        };

        enemies.push(new enemyType({ position, velocity, color, width: size, height: size }));
        setTimeout(spawn, spawnInterval);
    }

    setTimeout(spawn, 5000); // Delay the first spawn by 5 seconds
}


// Update the spawn interval every 10 seconds
setInterval(() => {
    if (spawnInterval > 500) { // Prevent it from going too low
        spawnInterval -= 100; // Decrease the interval
    }
}, 10000); // Check every 10 seconds

setInterval(() => {
    timeElapsed += 1000;
}, 1000);



class Sprite {
    constructor({ position, velocity, color, height, width }) {
        this.health = 100;
        this.position = position
        this.velocity = velocity
        this.color = color
        this.reachedEdgeRight = false
        this.reachedEdgeLeft = false
        this.width = width
        this.height = height
        this.isAttacking
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 150,
            offset: 0,
            facing: 'right'
        }
    }
    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        if (this.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x - this.attackBox.offset, this.attackBox.position.y - 50, this.attackBox.width, this.attackBox.height)
        }
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.attackBox.facing == 'left' && this.attackBox.offset == 0) this.attackBox.offset = this.width
        else if (this.attackBox.facing == 'right' && this.attackBox.offset == this.width) this.attackBox.offset = 0
        if (this.position.y + this.height + this.velocity.y >= canvas.height)
            this.velocity.y = 0
        else this.velocity.y += gravity
        if (this.position.x <= 0) this.reachedEdgeLeft = true
        else this.reachedEdgeLeft = false
        if (this.position.x + this.width >= canvas.width) this.reachedEdgeRight = true
        else this.reachedEdgeRight = false
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

//create main character
const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    width: 50,
    height: 75
})

//create helper character
const helper = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    width: 50,
    height: 75
})

// Start spawning enemies
spawnEnemies();

// check if key is being pressed or not
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    left: {
        pressed: false
    },
    right: {
        pressed: false
    },
    up: {
        count: 0,
        pressed: false
    }

}
function decreaseShieldWidth() {
    // Get the shield element and its computed style
    var shield = document.querySelector('#shield');
    var shieldStyle = window.getComputedStyle(shield);
    var shieldWidth = parseFloat(shieldStyle.width);

    // Check if the shield width is greater than the width corresponding to 20% of the parent's width
    var parentWidth = parseFloat(window.getComputedStyle(shield.parentNode).width);
    if (shieldWidth > parentWidth * 0.4) {
        // Decrease the width by 100px
        player.attack();
        var newWidth = shieldWidth - 300;
        newWidth = Math.max(newWidth, 0); // Make sure the new width is not negative
        shield.style.width = newWidth + 'px';
    }
}

function regenerateShield() {
    var shield = document.querySelector('#shield');
    var shieldWidth = parseFloat(window.getComputedStyle(shield).width);

    // Only regenerate if the shield is not already at full width
    if (shieldWidth < SHIELD_FULL_WIDTH) {
        // Increment the shield's width
        var newWidth = shieldWidth + 1; // Increase the width by 1px per frame or at desired rate
        newWidth = Math.min(newWidth, SHIELD_FULL_WIDTH); // Ensure the new width does not exceed full width
        shield.style.width = newWidth + 'px';
    }
}

function handleGameOver() {
    isGameOver = true;
    document.querySelector('#gameOver').style.display = 'flex';
    // Stop the score timer
    clearTimeout(scoreTimer); // assuming the timer ID is stored in `scoreTimer`
}

// This function should be called when the player takes damage
function takeDamage(amount) {
    player.health -= amount;
    player.health = Math.max(player.health, 0); // Ensure health doesn't go below 0
    updateHealthBar(); // Update the health bar every time the health changes
    if (player.health <= 0) {
        handleGameOver();
    }
}
function updateHealthBar() {
    var health = document.querySelector('#health');
    var healthPercentage = (player.health / 100) * HEALTH_FULL_WIDTH;
    health.style.width = healthPercentage + 'px';
}
function regenerateHealth() {
    if (player.health < 100) {
        player.health += 0.01; // Regenerate health very slowly
        player.health = Math.min(player.health, 100); // Ensure health doesn't exceed 100
        updateHealthBar();
    }
}

let score = -1
let scoreTimer;

function increaseScoreWithTime() {
    if (!isGameOver) {
        score++;
        document.querySelector('#score').innerHTML = score;
        document.querySelector('#finalScore').innerHTML = score;
        scoreTimer = setTimeout(increaseScoreWithTime, 1000);
    }
}

increaseScoreWithTime();


function animate() {
    if (isGameOver) {
        return; // Stop the game loop if the game is over
    }
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    helper.update()
    regenerateShield()
    regenerateHealth()
    player.velocity.x = 0
    helper.velocity.x = 0

    enemies.forEach((enemy, index) => {
        enemy.update();

        if (player.isAttacking) {
            // Calculate attack box position based on facing direction
            const attackBox = {
                x: player.attackBox.facing === 'left' ? player.position.x - player.attackBox.width/2 : player.position.x,
                y: player.position.y -50,
                width: player.attackBox.width,
                height: player.attackBox.height
            };

            // Check if enemy is within the attack box
            if (enemy.position.x < attackBox.x + attackBox.width &&
                enemy.position.x + enemy.width > attackBox.x &&
                enemy.position.y < attackBox.y + attackBox.height &&
                enemy.position.y + enemy.height > attackBox.y) {
                setTimeout(() => {
                    enemies.splice(index, 1); // Remove enemy from array
                }, 0);
            }
        }

        function updateScoreDisplay() {
            document.querySelector('#score').innerHTML = score;
            document.querySelector('#finalScore').innerHTML = score;
        }
        // Check for collision with helper's attack
        if (helper.isAttacking) {
            const attackBox = {
                x: helper.attackBox.facing === 'left' ? helper.position.x - helper.attackBox.width/2 : helper.position.x,
                y: helper.position.y - 50,
                width: helper.attackBox.width,
                height: helper.attackBox.height
            };
        
            if (enemy.position.x < attackBox.x + attackBox.width &&
                enemy.position.x + enemy.width > attackBox.x &&
                enemy.position.y < attackBox.y + attackBox.height &&
                enemy.position.y + enemy.height > attackBox.y) {
        
                if (!isGameOver) {  // Check if the game is not over
                    if (enemy.color === 'purple') {
                        score += 10;
                    } else if (enemy.color === 'orange') {
                        score += 30;
                    }
                    updateScoreDisplay();
                }
        
                setTimeout(() => {
                    enemies.splice(index, 1);
                }, 0);
            }
        }

        // Check for collision with player
        if (enemy.position.x < player.position.x + player.width &&
            enemy.position.x + enemy.width > player.position.x &&
            enemy.position.y < player.position.y + player.height &&
            enemy.position.y + enemy.height > player.position.y) {
            setTimeout(() => {
                enemies.splice(index, 1); // Remove enemy from array
                player.health -= 10; // Reduce player health
                takeDamage(10)
                if (player.health <= 0) {
                    document.querySelector('#gameOver').style.display = 'flex'
                }
            }, 0);
        }
    });
    //player movement
    if (keys.d.pressed && lastkeyp === 'd' && player.reachedEdgeRight == false) player.velocity.x = 3
    else if (keys.a.pressed && lastkeyp === 'a' && player.reachedEdgeLeft == false) player.velocity.x = -3

    //helper movement
    if (helper.velocity.y == 0) keys.up.count = 0
    if (keys.up.pressed == true && helper.velocity.y >= 0 && keys.up.count < 2) {
        helper.velocity.y = -14
        keys.up.count += 1
    }
    if (keys.right.pressed && lastkeyh === 'right' && helper.reachedEdgeRight == false) helper.velocity.x = 4
    else if (keys.left.pressed && lastkeyh === 'left' && helper.reachedEdgeLeft == false) helper.velocity.x = -4
    updateHealthBar()
}

animate()

//check for key press
window.addEventListener('keydown', (event) => {
    switch (event.key) {

        case 'a':
            keys.a.pressed = true
            player.attackBox.facing = 'left'
            lastkeyp = 'a'
            break
        case 'd':
            keys.d.pressed = true
            player.attackBox.facing = 'right'
            lastkeyp = 'd'
            break

        case 's':
            decreaseShieldWidth();
            break
        case 'w':
            if (player.velocity.y == 0) player.velocity.y = -14
            break
        case 'ArrowLeft':
            keys.left.pressed = true
            helper.attackBox.facing = 'left'
            lastkeyh = 'left'
            break
        case 'ArrowRight':
            keys.right.pressed = true
            helper.attackBox.facing = 'right'
            lastkeyh = 'right'
            break
        case 'ArrowUp':
            keys.up.pressed = true
            break
        case 'ArrowDown':
            if (!helper.isAttacking) helper.attack()
            break
    }
})

//check for key releases
window.addEventListener('keyup', (event) => {

    switch (event.key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'ArrowLeft':
            keys.left.pressed = false
            helper.attackBox.facing = 'left'
            break
        case 'ArrowRight':
            keys.right.pressed = false
            break
        case 'ArrowUp':
            keys.up.pressed = false
            break
    }
})
