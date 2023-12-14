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
backgroundImage.src = '../Images/Backgrounds/Background.png';

// Ensure the image is loaded before drawing it
backgroundImage.onload = function () {
    // Draw the image on the canvas
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
};

class Enemy {
    constructor({ position, velocity, color, width, height, edge }) {
        this.position = position;
        this.initialPositionX = this.position.x;
        this.velocity = velocity;
        this.color = color;
        this.width = width;
        this.height = height;
        this.frameCounter = 0;
        this.currentFrame = 0;
        this.frames = [];
        this.edge = edge;

        // Load images for animation based on enemy color
        if (this.color === 'purple') {
            this.frames = [
                '../Images/Enemies/purple1.png',
                '../Images/Enemies/purple2.png',
                '../Images/Enemies/purple3.png',
                '../Images/Enemies/purple4.png'
            ];
        } else if (this.color === 'orange') {
            this.frames = [
                '../Images/Enemies/orange1.png',
                '../Images/Enemies/orange2.png',
                '../Images/Enemies/orange3.png',
                '../Images/Enemies/orange4.png'
            ];
        } else {
            this.frames = [
                '../Images/Enemies/cyan1.png',
                '../Images/Enemies/cyan2.png',
                '../Images/Enemies/cyan3.png',
                '../Images/Enemies/cyan4.png'
            ];
        }

        // Initialize image objects for each frame
        this.frames = this.frames.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });

        // Calculate and store the initial angle to face away from the player
        this.initialAngle = Math.atan2(player.position.y - this.position.y, player.position.x - this.position.x) + Math.PI;
    }


    draw() {
        if (this.color === 'cyan') this.initialAngle = Math.atan2(player.position.y - this.position.y, player.position.x - this.position.x) + Math.PI;
        // Save the current state of the canvas
        c.save();

        // Translate and rotate the canvas context to the enemy's position and initial angle
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        c.rotate(this.initialAngle);
        // If the enemy is purple and spawns from the left side, flip it vertically
        if (this.color === 'purple' && this.edge != 1) {
            if (this.edge == 2 || this.initialPositionX < canvas.width / 2) c.scale(1, -1); // Apply vertical flip
        }

        // Draw the enemy image centered on its position
        if (this.frames.length > 0) {
            c.drawImage(this.frames[this.currentFrame], -this.width / 2, -this.height / 2, this.width + 10, this.height + 10);
        } else {
            // If  frames not loaded, draw a rectangle
            c.fillStyle = this.color;
            c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }

        // Restore the canvas context to its original state
        c.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.updateAnimation();
    }
    updateAnimation() {
        // Increase frame counter
        this.frameCounter++;

        if (this.frameCounter >= 15) {
            // Reset counter and switch to the next frame
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }
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
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        super.update(); // Call the update method of the base class
    }
}


const enemies = [];

let spawnInterval = 1500; // Start with an interval of 1500 milliseconds

function spawnEnemies() {
    function spawn() {
        if (isGameOver) {
            return;
        }
        const size = 30;
        const position = { x: 0, y: 0 };
        const edge = Math.floor(Math.random() * 4); // 0 - top, 1 - right, 2 - bottom, 3 - left
        let color, enemyType, speedMultiplier;

        // Determine enemy type based on time elapsed
        if (timeElapsed < 60 * 1000) {
            // Only purple enemies
            color = 'purple';
            enemyType = Enemy;
            speedMultiplier = 2;
        } else if (timeElapsed < 120 * 1000) {
            // Purple and orange enemies
            if (Math.random() < 0.5) {
                color = 'purple';
                enemyType = Enemy;
                speedMultiplier = 2;
            } else {
                color = 'orange';
                enemyType = Enemy;
                speedMultiplier = 6;
            }
        } else if (timeElapsed < 200 * 1000) {
            // Orange and cyan enemies
            if (Math.random() < 0.5) {
                color = 'orange';
                enemyType = Enemy;
                speedMultiplier = 6;
            } else {
                color = 'cyan';
                enemyType = TrackingEnemy;
                speedMultiplier = 6;
            }
        } else {
            // All types of enemies
            const randomType = Math.random();
            if (randomType < 0.18) {
                color = 'purple';
                enemyType = Enemy;
                speedMultiplier = 2;
            } else if (randomType < 0.60) {
                color = 'orange';
                enemyType = Enemy;
                speedMultiplier = 6;
            } else {
                color = 'cyan';
                enemyType = TrackingEnemy;
                speedMultiplier = 6;
            }
        }

        // Set the position based on the edge
        switch (edge) {
            case 0: // Top
                position.x = Math.random() * canvas.width;
                position.y = -size;
                break;
            case 1: // Right
                position.x = canvas.width;
                position.y = Math.random() * (canvas.height - 75 - size); // Spawn above the bottom with a buffer
                break;
            case 3: // Left
                position.x = -size;
                position.y = Math.random() * (canvas.height - 75 - size); // Spawn above the bottom with a buffer
                break;
        }

        // Set the velocity
        const angle = Math.atan2(player.position.y - position.y, player.position.x - position.x);
        const velocity = {
            x: Math.cos(angle) * speedMultiplier,
            y: Math.sin(angle) * speedMultiplier
        };

        enemies.push(new enemyType({ position, velocity, color, width: size, height: size, edge: edge }));

        setTimeout(spawn, spawnInterval);
    }

    setTimeout(spawn, 5000); // Delay the first spawn by 5 seconds
}



// Update the spawn interval every 10 seconds
setInterval(() => {
    if (spawnInterval > 400) { // Prevent it from going too low
        spawnInterval -= 100; // Decrease the interval
    }
}, 10000); // Check every 10 seconds

setInterval(() => {
    timeElapsed += 1000;
}, 1000);



class Sprite {
    constructor({ position, velocity, imageSrc, imageSideSrc, width, height }) {
        this.health = 100;
        this.position = position;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.isShieldActive = false;
        this.dashSpeed = 70;
        this.dashDuration = 50;
        this.pauseBetweenDashes = 10;

        // Images
        this.image = new Image();
        this.imageSide = new Image();
        this.imageLoaded = false;
        this.imageSideLoaded = false;
        this.imageAttack = new Image()

        // Load default image
        this.image.src = imageSrc;
        this.image.onload = () => {
            this.imageLoaded = true;
        };

        // Load side image
        this.imageSide.src = imageSideSrc;
        this.imageSide.onload = () => {
            this.imageSideLoaded = true;
        };

        // Load attack frames
        this.attackFrames = [];
        for (let i = 1; i <= 11; i++) {
            const img = new Image();
            img.src = `../Images/Characters/attack${i}.png`;
            this.attackFrames.push(img);
        }

        // Attack animation properties
        this.isAttacking = false;
        this.currentAttackFrame = 0;
        this.attackFrameCounter = 0;
        this.attackDuration = 500; // Total attack duration in milliseconds
        this.frameDuration = this.attackDuration / 11;
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 150,
            offset: 0,
            facing: 'right'
        };

    }

    draw() {
        // Determine which image to use based on the facing direction
        let imageToUse = this.velocity.x != 0 ? this.imageSide : this.image;
        let posX = this.position.x;
        let posY = this.position.y;
        let width = this.width;
        let height = this.height;

        // Flip the context if facing left
        if (this.attackBox.facing === 'left') {
            c.save(); // Save the current state of the canvas
            c.scale(-1, 1); // Flip the canvas horizontally
            posX = -this.position.x - this.width; // Adjust the x position
        }

        // Draw the sprite only if the image is loaded
        if ((this.attackBox.facing === 'right' && this.imageSideLoaded) || (this.attackBox.facing === 'left' && this.imageLoaded)) {
            c.drawImage(imageToUse, posX, posY, width, height);
        }

        if (this.attackBox.facing === 'left') {
            c.restore(); // Restore the canvas to the original state
        }

        // Draw attack box for visual debugging
        if (this.isAttacking) {
            this.attackFrameCounter += 16.67; // Assuming ~60FPS

            if (this.attackFrameCounter >= this.frameDuration) {
                this.attackFrameCounter = 0;
                this.currentAttackFrame++;
                if (this.currentAttackFrame >= this.attackFrames.length) {
                    this.isAttacking = false;
                    this.currentAttackFrame = 0;
                }
            }

            if (this.currentAttackFrame < this.attackFrames.length) {
                let attackPosX = this.position.x; // Adjust as needed
                let attackPosY = this.position.y; // Adjust as needed
                let attackWidth = this.attackBox.width + 60;
                let attackHeight = this.attackBox.height + 40;

                if (this.attackBox.facing === 'right') {
                    c.save(); // Save the current state of the canvas
                    c.scale(-1, 1); // Flip the canvas horizontally
                    c.drawImage(this.attackFrames[this.currentAttackFrame], -(attackPosX + attackWidth - 15), attackPosY - 105, attackWidth, attackHeight);
                    c.restore(); // Restore the canvas to the original state
                } else {
                    c.drawImage(this.attackFrames[this.currentAttackFrame], attackPosX - 68, attackPosY - 105, attackWidth, attackHeight);
                }
            }
        }
    }


    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Adjust attack box offset based on facing direction
        if (this.attackBox.facing === 'left' && this.attackBox.offset === 0) {
            this.attackBox.offset = this.width;
        } else if (this.attackBox.facing === 'right' && this.attackBox.offset === this.width) {
            this.attackBox.offset = 0;
        }


        if (this.position.y + this.height + this.velocity.y >= canvas.height - 58) {
            this.velocity.y = 0;
            this.position.y = canvas.height - this.height - 58; // Adjust to the new floor level
        } else {
            this.velocity.y += gravity;
        }

        // Edge detection for left and right boundaries
        this.reachedEdgeLeft = this.position.x <= 0;
        this.reachedEdgeRight = this.position.x + this.width >= canvas.width;
    }


    attack() {
        this.isAttacking = true;
        this.currentAttackFrame = 0;
        this.attackFrameCounter = 0;
    }
    activateShield() {
        this.isShieldActive = true;
        this.color = 'gray'; // Change player color to green
        const originalSpeedX = this.velocity.x;

        // First Dash
        this.velocity.x = this.velocity.x === 0 ? 0 : this.velocity.x > 0 ? this.dashSpeed : -this.dashSpeed;

        setTimeout(() => {
            // Pause between dashes
            this.velocity.x = 0;

            setTimeout(() => {
                // Second Dash
                this.velocity.x = originalSpeedX === 0 ? 0 : originalSpeedX > 0 ? this.dashSpeed : -this.dashSpeed;

                setTimeout(() => {
                    // End of the second dash
                    this.velocity.x = originalSpeedX;

                    setTimeout(() => {
                        this.isShieldActive = false;
                        this.color = 'red'; // Revert player color back to red
                    }, 1500); // Duration for the shield (including double dash and pause)

                }, this.dashDuration);

            }, this.pauseBetweenDashes);

        }, this.dashDuration);
    }
}

//create main character
const player = new Sprite({
    position: { x: 100, y: canvas.height - 75 - 58 }, // Replace with actual starting position
    velocity: { x: 0, y: 0 },
    imageSrc: '../Images/Characters/boy.png',
    imageSideSrc: '../Images/Characters/boyside.png', // Replace with the path to the knight image
    width: 50, // Set the size of your character
    height: 75,
});

//create helper character
const helper = new Sprite({
    position: {
        x: 1100,
        y: canvas.height - 75 - 58
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: '../Images/Characters/women.png',
    imageSideSrc: '../Images/Characters/womenside.png', // Set the path to the helper's image
    width: 50, // Same width as the player
    height: 75, // Same height as the player
});

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
        player.activateShield();
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
        var newWidth = shieldWidth + 0.5; // Increase the width by 1px per frame or at desired rate
        newWidth = Math.min(newWidth, SHIELD_FULL_WIDTH); // Ensure the new width does not exceed full width
        shield.style.width = newWidth + 'px';
    }
}

function handleGameOver() {
    isGameOver = true;
    document.querySelector('#gameOver').style.display = 'flex';
    // Stop the score timer
    clearTimeout(scoreTimer);
    updateLeaderboard(score);

}

function updateLeaderboard(finalScore) {
    // Retrieve current user, use "Guest" if not set or empty
    let currentUser = localStorage.getItem('currentUser');
    if (!currentUser || currentUser.trim() === "") {
        currentUser = "Guest";
    }

    // Retrieve the existing leaderboard or initialize a new one
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Add the current game's score to the leaderboard
    leaderboard.push({ user: currentUser, score: finalScore });

    // Sort the leaderboard by score in descending order
    leaderboard.sort((a, b) => b.score - a.score);

    // Save the updated leaderboard back to localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
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
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    player.update()
    helper.update()
    regenerateShield()
    regenerateHealth()
    player.velocity.x = 0
    helper.velocity.x = 0

    enemies.forEach((enemy, index) => {
        enemy.update();

        function updateScoreDisplay() {
            document.querySelector('#score').innerHTML = score;
            document.querySelector('#finalScore').innerHTML = score;
        }
        // Check for collision with helper's attack
        if (helper.isAttacking) {
            const attackBox = {
                x: helper.attackBox.facing === 'left' ? helper.position.x - helper.attackBox.width / 2 : helper.position.x,
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
                    } else if (enemy.color === 'cyan') {
                        score += 75;
                    }
                    updateScoreDisplay();
                }

                setTimeout(() => {
                    enemies.splice(index, 1);
                }, 0);
            }
        }

        // Check for collision with player
        if (!player.isShieldActive && enemy.position.x < player.position.x + player.width &&
            enemy.position.x + enemy.width > player.position.x &&
            enemy.position.y < player.position.y + player.height &&
            enemy.position.y + enemy.height > player.position.y) {
            setTimeout(() => {
                enemies.splice(index, 1); // Remove enemy from array
                player.health -= 10; // Reduce player health
                takeDamage(10)
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
            break
        case 'ArrowRight':
            keys.right.pressed = false
            break
        case 'ArrowUp':
            keys.up.pressed = false
            break
    }
})
