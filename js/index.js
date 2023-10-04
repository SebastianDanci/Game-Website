const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


canvas.width = 1600
canvas.height = 900

const gravity= 0.4

c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite{   
    constructor({position, velocity, color}){
        this.position = position
        this.velocity = velocity
        this.color = color
        this.width = 50
        this.height = 75
        this.isAttacking
        this.attackBox = {
            position:this.position,
            width:100,
            height:150,
            offset:0,
            facing: 'right'
        }
    }
    draw(){
        c.fillStyle= this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        if(this.isAttacking){c.fillStyle = 'green'
        c.fillRect(this.attackBox.position.x - this.attackBox.offset, this.attackBox.position.y - 50, this.attackBox.width, this.attackBox.height )
    }
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.attackBox.facing =='left' && this.attackBox.offset == 0) this.attackBox.offset = this.width
        else if(this.attackBox.facing=='right' && this.attackBox.offset== this.width) this.attackBox.offset = 0
        if(this.position.y + this.height + this.velocity.y >=canvas.height)
            this.velocity.y = 0
        else this.velocity.y += gravity
    }

    attack(){
        this.isAttacking = true
        setTimeout(() =>{
            this.isAttacking= false
        },100)
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
const keys ={
    a: {
        pressed: false
    },
    d:{
        pressed: false
    },
    left:{
        pressed: false
    },
    right:{
        pressed: false
    },
    up:{
        count: 0,
        pressed: false
    }
    
}


function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    helper.update()
    player.velocity.x = 0
    helper.velocity.x = 0
    
    //player movement
    if(keys.d.pressed && lastkeyp ==='d')player.velocity.x=1.5
    else if(keys.a.pressed && lastkeyp === 'a')player.velocity.x=-1.5

    //helper movement
    if(helper.velocity.y==0)keys.up.count=0
    if(keys.up.pressed == true && helper.velocity.y >= 0 && keys.up.count<2){
        helper.velocity.y =-12
        keys.up.count += 1}
    if(keys.right.pressed && lastkeyh ==='right')helper.velocity.x=2 
    else if(keys.left.pressed && lastkeyh === 'left')helper.velocity.x=-2

    //detect collision

    if(player.attackBox.position.x + player.attackBox.width - player.attackBox.offset >= helper.position.x && 
        player.attackBox.position.x - player.attackBox.offset <= helper.position.x + helper.width &&
        player.attackBox.position.y - 50 + player.attackBox.height>=helper.position.y &&
        player.position.y<=helper.position.y + helper.height&&
        player.isAttacking){ 
        player.isAttacking= false
        console.log('go')
    }

}

animate()

//check for key press

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = true
            player.attackBox.facing = 'left'
            lastkeyp= 'a'
            break
        case 'd':
            keys.d.pressed =true
            player.attackBox.facing = 'right'
            lastkeyp = 'd'
            break

            case ' ':
        player.attack()
            break
        case 'w':
        if(player.velocity.y==0)player.velocity.y =-12
        break
        case 'ArrowLeft':
            keys.left.pressed = true
            helper.attackBox.facing = 'left'
            lastkeyh= 'left'
            break
        case 'ArrowRight':
            keys.right.pressed =true
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
} )
//check for key releases

window.addEventListener('keyup', (event) => {

    console.log(keys.right.pressed) 
    switch (event.key)
    {
        case 'a':
            keys.a.pressed=false
            break
        case 'd':
            keys.d.pressed=false
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
}    )
