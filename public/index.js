const myCanvas = document.createElement('canvas');

myCanvas.id = 'myCanvas';
myCanvas.style = 'border: 2px solid black';

document.body.appendChild(myCanvas);

var config = {
    type: Phaser.CANVAS,
    parent: 'game-container',
    width: 800,
    height: 600,
    canvas: document.getElementById('myCanvas'),
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var boy;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var instructions = []

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('boy', 'assets/boy.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();


    // Animation set
    this.anims.create({
        key: 'stop',
        frames: this.anims.generateFrameNumbers('boy', { frames: [1] }),
        frameRate: 50,
        repeat: -1
    });
    this.anims.create({
        key: 'walk_down',
        frames: this.anims.generateFrameNumbers('boy', { frames: [0, 1, 2] }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'walk_right',
        frames: this.anims.generateFrameNumbers('boy', { frames: [3, 4, 5] }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'walk_left',
        frames: this.anims.generateFrameNumbers('boy', { frames: [6, 7, 8] }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'walk_up',
        frames: this.anims.generateFrameNumbers('boy', { frames: [9, 10, 11] }),
        frameRate: 8,
        repeat: -1
    });

    boy = this.physics.add.sprite(32, 32).setScale(2);


    //  boy physics properties. Give the little guy a slight bounce.
    boy.setBounce(0.2);
    boy.setCollideWorldBounds(true);
    
    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {



    // if (gameOver) {
    //     return;
    // }

    // if (cursors.left.isDown) {
    //     boy.setVelocity(-80,0);
    //     boy.anims.play('walk_left', true);
    // }else if (cursors.right.isDown) {
    //     boy.setVelocity(80,0);
    //     boy.anims.play('walk_right', true);
    // }else if (cursors.up.isDown) {
    //     boy.setVelocity(0,-80);
    //     boy.anims.play('walk_up', true);
    // }else if (cursors.down.isDown) {
    //     boy.setVelocity(0,80);
    //     boy.anims.play('walk_down', true);
    // }else{
    //     boy.setVelocity(0);
    //     boy.anims.play('stop', true);
    // }
}


function agregar(walk) {
    instructions.push(walk)
    console.log(instructions)
}

function caminar() {

    boy.setVelocity(0, 0);
    boy.anims.play('stop', true);
    var interval = setInterval(f, 2000)
    function f() {
        const i = instructions.shift()
        console.log(i)
        switch (i) {
            case 'walk_left':
                boy.setVelocity(-80, 0);
                boy.anims.play('walk_left', true);
                break;
            case 'walk_right':
                boy.setVelocity(80, 0);
                boy.anims.play('walk_right', true);
                break;
            case 'walk_up':
                boy.setVelocity(0, -80);
                boy.anims.play('walk_up', true);
                break;
            case 'walk_down':
                boy.setVelocity(0, 80);
                boy.anims.play('walk_down', true);
                break;
            case 'stop':
                boy.setVelocity(0, 0);
                boy.anims.play('stop', true);
                break;

            default:
                boy.setVelocity(0, 0);
                boy.anims.play('stop', true);
                clearInterval(interval);
                break;
        }
    }
}