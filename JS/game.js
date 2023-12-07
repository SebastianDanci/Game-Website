const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


canvas.width = 1280
canvas.height = 720

const gravity = 0.4
const SHIELD_FULL_WIDTH = parseFloat(window.getComputedStyle(document.querySelector('#shield')).width);
const backgroundImage = new Image();

// Set the source of the image
backgroundImage.src = '';

// Ensure the image is loaded before drawing it
backgroundImage.onload = function () {
    // Draw the image on the canvas
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
};

class Sprite {
    constructor({ position, velocity, color }) {
        this.health = 100;
        this.position = position
        this.velocity = velocity
        this.color = color
        this.reachedEdgeRight = false
        this.reachedEdgeLeft = false
        this.width = 50
        this.height = 75
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

class Player extends Sprite{
    
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
    color: 'red'
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
    color: 'blue'
})

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

let score = -1
function increaseScoreWithTime() {
    setTimeout(increaseScoreWithTime, 1000)
    score++
    document.querySelector('#score').innerHTML = score
    document.querySelector('#finalScore').innerHTML = score
}
increaseScoreWithTime()
// on win             document.querySelector('#gameOver').style.display='flex'

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    helper.update()
    regenerateShield()
    player.velocity.x = 0
    helper.velocity.x = 0

    //player movement
    if (keys.d.pressed && lastkeyp === 'd' && player.reachedEdgeRight == false) player.velocity.x = 1.5
    else if (keys.a.pressed && lastkeyp === 'a' && player.reachedEdgeLeft == false) player.velocity.x = -1.5

    //helper movement
    if (helper.velocity.y == 0) keys.up.count = 0
    if (keys.up.pressed == true && helper.velocity.y >= 0 && keys.up.count < 2) {
        helper.velocity.y = -12
        keys.up.count += 1
    }
    if (keys.right.pressed && lastkeyh === 'right' && helper.reachedEdgeRight == false) helper.velocity.x = 2
    else if (keys.left.pressed && lastkeyh === 'left' && helper.reachedEdgeLeft == false) helper.velocity.x = -2

    //detect collision
    if (player.attackBox.position.x + player.attackBox.width - player.attackBox.offset >= helper.position.x &&
        player.attackBox.position.x - player.attackBox.offset <= helper.position.x + helper.width &&
        player.attackBox.position.y - 50 + player.attackBox.height >= helper.position.y &&
        player.position.y <= helper.position.y + helper.height &&
        player.isAttacking) {
        player.isAttacking = false
        console.log('go')
    }

}

animate()

//check for key press
window.addEventListener('keydown', (event) => {
    switch (event.key) {

        case 'a':
            console.log(JSON.stringify(helper))
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
            if (player.velocity.y == 0) player.velocity.y = -12
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
            helper.attack()
            break
    }
})

//check for key releases
window.addEventListener('keyup', (event) => {

    console.log(keys.right.pressed)
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
