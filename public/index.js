const myCanvas = document.createElement('canvas');

myCanvas.id = 'myCanvas';
myCanvas.style = 'border: 2px solid black';

document.body.appendChild(myCanvas);

var config = {
    type: Phaser.CANVAS,
    parent: 'game-container',
    width: 800,
    height: 800,
    canvas: document.getElementById('myCanvas'),
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        width: 800,
        height: 800
    },
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
var score = 0;
var gameOver = false;
var scoreText;
var map, tileset, layer, tile;
var instructions = []

var game = new Phaser.Game(config);

function preload() {
    this.load.image('bg', 'assets/bg.png');
    this.load.image('tiles', 'assets/objects.png');
    this.load.image('car', 'assets/car90.png');
    this.load.spritesheet('boy', 'assets/boy.png', { frameWidth: 32, frameHeight: 32 });
    this.load.tilemapCSV('map', 'assets/grid2.csv');
}

function create() {
    //  A simple background for our game
    this.add.image(400, 400, 'bg');
    map = this.make.tilemap({ key: 'map', tileWidth: 160, tileHeight: 160 });
    tileset = map.addTilesetImage('tiles', null, 160, 160, 0, 0);
    layer = map.createLayer(0, tileset, 0, 0);

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

    var xpos, ypos;

    do {
        xpos = 80 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0);

    boy = this.physics.add.sprite(xpos, ypos).setScale(2);
    boy.anims.play('stop', true);
    boy.setCollideWorldBounds(true);

    do {
        xpos = 80 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0 && (boy.x != xpos || boy.y != ypos));

    this.add.image(xpos, ypos, 'car').setScale(2);
}

function update() {
}

function agregar(walk) {
    instructions.push(walk)
}

function caminar() {

    control_btns = document.getElementsByClassName("control-btn");
    for (let i = 0; i < control_btns.length; i++) {
        control_btns[i].disabled = true;
    }

    f()

    var interval = setInterval(f, 2000)

    function f() {
        const i = instructions.shift()
        switch (i) {
            case 'walk_left':
                tile = layer.getTileAtWorldXY(boy.x - 160, boy.y, true);
                boy.setVelocity(0, 0);
                if (tile.index == 0) {
                    boy.setVelocity(-80, 0);
                }
                boy.anims.play('walk_left', true);
                break;

            case 'walk_right':
                tile = layer.getTileAtWorldXY(boy.x + 160, boy.y, true);
                boy.setVelocity(0, 0);
                if (tile.index == 0) {
                    boy.setVelocity(80, 0);
                }
                boy.anims.play('walk_right', true);
                break;

            case 'walk_up':
                tile = layer.getTileAtWorldXY(boy.x, boy.y - 160, true);
                boy.setVelocity(0, 0);
                if (tile.index == 0) {
                    boy.setVelocity(0, -80);
                }
                boy.anims.play('walk_up', true);
                break;

            case 'walk_down':
                tile = layer.getTileAtWorldXY(boy.x, boy.y + 160, true);
                boy.setVelocity(0, 0);
                if (tile.index == 0) {
                    boy.setVelocity(0, 80);
                }
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

                for (let i = 0; i < control_btns.length; i++) {
                    control_btns[i].disabled = false;
                }
            
                break;
        }
    }
}