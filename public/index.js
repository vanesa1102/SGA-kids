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

var music;
var boy, tigrillo;
var score = 0;
var gameOver = false;
var scoreText;
var map, tileset, layer, tile;
var instructions = [];
var xpos, ypos;
var n = 0; //Para saber el # de pregunta

var game = new Phaser.Game(config);

function preload() {
    this.load.image('bg', 'assets/images/bg.png');
    this.load.image('tiles', 'assets/images/objects.png');
    this.load.image('tigrillo', 'assets/images/tigrillo.png');
    this.load.spritesheet('boy', 'assets/images/boy.png', { frameWidth: 32, frameHeight: 32 });
    this.load.tilemapCSV('map', 'assets/images/grid.csv');
    this.load.audio('theme', [
        'assets/audios/music.mp3'
    ]);
}

function create() {
    music = this.sound.add('theme');

    music.play();


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
        yoyo: true,
        repeat: -1
    });
    this.anims.create({
        key: 'walk_right',
        frames: this.anims.generateFrameNumbers('boy', { frames: [3, 4, 5] }),
        frameRate: 8,
        yoyo: true,
        repeat: -1
    });
    this.anims.create({
        key: 'walk_left',
        frames: this.anims.generateFrameNumbers('boy', { frames: [6, 7, 8] }),
        frameRate: 8,
        yoyo: true,
        repeat: -1
    });
    this.anims.create({
        key: 'walk_up',
        frames: this.anims.generateFrameNumbers('boy', { frames: [9, 10, 11] }),
        frameRate: 8,
        yoyo: true,
        repeat: -1
    });

    do {
        xpos = 120 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0);

    boy = this.physics.add.sprite(xpos, ypos, 'boy').setScale(2);
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
    $('.btn-go').prop('disabled', false);
    $("#arrow-container").append("<img class='img-fluid' src='assets/images/" + walk + "2.png'>");
    instructions.push(walk)
}

function caminar() {
    $("#arrow-container").empty();
    $('.control-btn').prop('disabled', true)

    f()
    var interval = setInterval(f, 2000)

    function f() {
        const i = instructions.shift()
        switch (i) {
            case 'walk_left':
                tile = layer.getTileAtWorldXY(boy.x - 160, boy.y, true);
                boy.setVelocity(0, 0);
                if (tile != null && tile.index == 0) {
                    boy.setVelocity(-80, 0);
                }
                boy.anims.play('walk_left', true);
                break;

            case 'walk_right':
                tile = layer.getTileAtWorldXY(boy.x + 160, boy.y, true);
                boy.setVelocity(0, 0);
                if (tile != null && tile.index == 0) {
                    boy.setVelocity(80, 0);
                }
                boy.anims.play('walk_right', true);
                break;

            case 'walk_up':
                tile = layer.getTileAtWorldXY(boy.x, boy.y - 160, true);
                boy.setVelocity(0, 0);
                if (tile != null && tile.index == 0) {
                    boy.setVelocity(0, -80);
                }
                boy.anims.play('walk_up', true);
                break;

            case 'walk_down':
                tile = layer.getTileAtWorldXY(boy.x, boy.y + 160, true);
                boy.setVelocity(0, 0);
                if (tile != null && tile.index == 0) {
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

                $('.control-btn').prop('disabled', false)
                $('.btn-go').prop('disabled', true);

                if (Math.abs(tigrillo.x - boy.x) < 80 && Math.abs(tigrillo.y - boy.y) < 80) {
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
    if ($("#" + audioId)[0].paused) {
        music.pause()
        $('audio').each(function () {
            this.pause(); // Stop playing
            this.currentTime = 0; // Reset time
        });
        $("#" + audioId)[0].play();
        $("#instructions-sound-btn").removeClass('btn-sound')
        $("#instructions-sound-btn").addClass('btn-no-sound')
    } else {
        music.resume()
        $("#" + audioId)[0].pause();
        $("#instructions-sound-btn").removeClass('btn-no-sound')
        $("#instructions-sound-btn").addClass('btn-sound')
    }

}

$('.modal').on('shown.bs.modal', function () {
    music.pause();
});

$('.modal').on('hidden.bs.modal', function () {
    music.resume();
});


function start() {
    boy.anims.play('stop', true);

    do {
        xpos = 80 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0 || (boy.x == xpos + 40 || boy.y == ypos));

    tigrillo.x = xpos;
    tigrillo.y = ypos;
}


// --------- MODAL --------------
const btn_types = [
    "btn-primary",
    "btn-secondary",
    "btn-success",
    "btn-danger",
    "btn-warning",
    "btn-info",
    "btn-light",
    "btn-dark"
]

var preguntas = [
    {
        titulo: "1 + 2",
        pregunta: "¿Cuanto es 1 + 2?",
        respuesta: "3",
        audio: "assets/audios/preguntas/nombre_del_audio.mp3",
        imagen: "assets/images/preguntas/nombre_de_la_imagen.png",
        opciones: [
            "1",
            "4",
            "3",
            "Ns/Nr"
        ]
    },
    {
        titulo: "2 + 2",
        pregunta: "¿Cuanto es 2 + 2?",
        respuesta: "4",
        audio: "assets/audios/preguntas/nombre_del_audio.mp3",
        imagen: "assets/images/preguntas/nombre_de_la_imagen.png",
        opciones: [
            "1",
            "4",
            "5"
        ]
    },
    {
        titulo: "Mejor juego",
        pregunta: "¿Es este el mejor juego?",
        respuesta: "Si",
        audio: "assets/audios/preguntas/nombre_del_audio.mp3",
        imagen: "assets/images/preguntas/nombre_de_la_imagen.png",
        opciones: [
            "Si",
            "No",
            "Tal vez"
        ]
    }
]

function toHtml({ pregunta, opciones, respuesta }) {
    return `<div class="row justify-content-center align-items-center">
        <div class="col col-lg-6 mt-2 text-center justify-content-center">
            <p>${pregunta}</p>
            ${opciones.map((x, i) =>
                `<button 
                    class="btn btn-lg ${btn_types[i]} d-flex" 
                    data-dismiss="modal" 
                    aria-label="Close" 
                    onclick="respuesta('${x}', '${respuesta}')"
                >
                    ${x}
                </button>`
            ).reduce((prev, curr) => prev + curr)}
         </div>
    </div>`
}

function openModal(success) {
    if (success) {
        $("#modal-pregunta .modal-title").html(preguntas[n].titulo);
        $("#modal-pregunta .modal-body").html(toHtml(preguntas[n]));
        $('#modal-pregunta').modal('show')
    } else {
        $('#modal-error').modal('show')
    }
    n++;
    $('#turnos').html(preguntas.length - n)
    if (n >= preguntas.length) {
        gameOver = true
        n = 0
        score = 0
        $('#turnos').html(preguntas.length - n)
        $('#game-over').prop('hidden', false)
    }

};

//Puntuación
function respuesta(respuesta, respuesta_correcta) {
    if (respuesta === respuesta_correcta) {
        score++
        $('#puntuacion').html(score)
    }
}

//Randomizar las preguntas
function shuffleQuestions() {
    preguntas.sort(() => Math.random() - 0.5).forEach(pregunta => {
        pregunta.opciones.sort(() => Math.random() - 0.5)
    })
}
shuffleQuestions()