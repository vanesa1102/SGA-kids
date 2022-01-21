const myCanvas = document.createElement('canvas');

myCanvas.id = 'myCanvas';
myCanvas.style = 'border: 2px solid black; padding: 0;';

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
var instructions = [];
var xpos, ypos;
var n = 1; //Para saber el # de pregunta

var game = new Phaser.Game(config);

function preload() {
    this.load.image('bg', 'assets/images/bg.png');
    this.load.image('tiles', 'assets/images/objects.png');
    this.load.image('tigrillo', 'assets/images/tigrillo.png');
    this.load.spritesheet('boy', 'assets/images/boy.png', { frameWidth: 32, frameHeight: 32 });
    this.load.tilemapCSV('map', 'assets/images/grid.csv');
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

    do {
        xpos = 120 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0);

    boy = this.physics.add.sprite(xpos, ypos).setScale(2);
    boy.anims.play('stop', true);
    boy.setCollideWorldBounds(true);

    do {
        xpos = 80 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0 || (boy.x == xpos + 40 || boy.y == ypos));

    tigrillo = this.add.tileSprite(xpos, ypos, 160, 160, 'tigrillo');
}

function update() {
}

function agregar(walk) {
    $("#arrow-container").append("<img class='img-fluid' src='assets/images/" + walk + "2.png'>");
    instructions.push(walk)
}

function caminar() {
    $("#arrow-container").empty();

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

                if (Math.abs(xpos - boy.x) > 38 && Math.abs(xpos - boy.x) < 42) {
                    openModal(true);
                } else {
                    openModal(false);
                }
                start();
                break;
        }
    }
}

function reproducirAudio(audioId) {
    $('audio').each(function () {
        this.pause(); // Stop playing
        this.currentTime = 0; // Reset time
    });
    $("#" + audioId)[0].play();
}

function start() {
    do {
        xpos = 120 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0);

    boy.x = xpos;
    boy.y = ypos;
    boy.anims.play('stop', true);
    boy.setCollideWorldBounds(true);

    do {
        xpos = 80 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0 || (boy.x == xpos + 40 || boy.y == ypos));

    tigrillo.x = xpos;
    tigrillo.y = ypos;
}




// --------- MODAL --------------

var textos = [
    {
        title: "El tigrillo sigue lejos",
        body:
            `<div class="row justify-content-center align-items-center">
                <div class="row col-lg-6 mt-2 text-center justify-content-center">
                    Acercate para descubrir nuevas cosas.
                    <button class="btn btn-lg d-flex btn-download-s5" data-dismiss="modal" aria-label="Close">Continuar</button>
                </div>
            </div>
            `
    },
    {
        title: "Pregunta 1",
        body:
            `<div class="row justify-content-center align-items-center">
                <div class="row col-lg-6 mt-2 text-center justify-content-center">
                    Pregunta 1 info.
                    <button type="button" class="btn btn-sound" onclick="reproducirAudio('instrucciones')"></button>
                    <audio id="instrucciones" src="assets/audios/instrucciones.mp3"></audio>
                    <button class="btn btn-lg btn-dark d-flex" data-dismiss="modal" aria-label="Close" onclick="respuesta(1)">Opcion 1</button>
                    <button class="btn btn-lg btn-info d-flex" data-dismiss="modal" aria-label="Close" onclick="respuesta(2)">Opción 2</button>
                </div>
            </div>
            `,
        answer: 1
    },
    {
        title: "Pregunta 2",
        body:
            `<div class="row justify-content-center align-items-center">
                <div class="row col-lg-6 mt-2 text-center justify-content-center">
                    Pregunta 2 info.
                    <button class="btn btn-lg btn-dark d-flex" data-dismiss="modal" aria-label="Close" onclick="respuesta(1)">Opcion 1</button>
                    <button class="btn btn-lg btn-info d-flex" data-dismiss="modal" aria-label="Close" onclick="respuesta(2)">Opción 2</button>
                </div>
            </div>
            `,
        answer: 2
    },
    

];

function openModal(success) {
    if (success) {
        //Llenar aquí el modal con una pregunta aleatoria que no se haya hecho
        $("#myModal .modal-title").html(textos[n].title);
        $("#myModal .modal-body").html(textos[n].body);
    } else {
        $("#myModal .modal-title").html(textos[0].title);
        $("#myModal .modal-body").html(textos[0].body);
    }

    $('#myModal').modal()
};

//Puntuación
function respuesta(ans){
    console.log("Pregunta: "+n+" - Respuesta: "+ans+" - Respuesta correcta: "+ textos[n].answer);
    n++;
}

