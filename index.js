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

var musicWasPaused = false;
var boy, tigrillo;
var boyTile, tigrilloTile;
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
}

function create() {

    playAudio('#game-music');

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

    $('#turnos').html(preguntas.length - n)
}

function update() {
}

function agregar(walk) {
    $('.btn-go').prop('disabled', false);
    $('.btn-delete').prop('disabled', false);
    $('.btn-arrow').prop('disabled', false);
    $("#arrow-container").append("<img class='img-fluid' src='assets/images/" + walk + "2.png'>");
    instructions.push(walk)
}

function borrarUltimaInstruccion() {
    $("#arrow-container img:last").remove();
    instructions.pop();

    if (instructions.length == 0) {
        $('.btn-go').prop('disabled', true);
        $('.btn-delete').prop('disabled', true);
        $('.btn-arrow').prop('disabled', true);
    }

}

function borrarInstrucciones() {
    $("#arrow-container").empty();
    $('.btn-go').prop('disabled', true);
    $('.btn-delete').prop('disabled', true);
    $('.btn-arrow').prop('disabled', true);
    instructions = [];
}

function caminar() {
    $("#arrow-container").empty();
    $('.control-btn').prop('disabled', true)

    f()
    var interval = setInterval(f, 2000)

    function f() {
        boy.setVelocity(0, 0);
        const i = instructions.shift()
        switch (i) {
            case 'walk_left':
                tile = layer.getTileAtWorldXY(boy.x - 160, boy.y, true);
                if (tile != null && tile.index == 0) {
                    boy.setVelocity(-80, 0);
                }
                boy.anims.play('walk_left', true);
                break;

            case 'walk_right':
                tile = layer.getTileAtWorldXY(boy.x + 160, boy.y, true);
                if (tile != null && tile.index == 0) {
                    boy.setVelocity(80, 0);
                }
                boy.anims.play('walk_right', true);
                break;

            case 'walk_up':
                tile = layer.getTileAtWorldXY(boy.x, boy.y - 160, true);
                if (tile != null && tile.index == 0) {
                    boy.setVelocity(0, -80);
                }
                boy.anims.play('walk_up', true);
                break;

            case 'walk_down':
                tile = layer.getTileAtWorldXY(boy.x, boy.y + 160, true);
                if (tile != null && tile.index == 0) {
                    boy.setVelocity(0, 80);
                }
                boy.anims.play('walk_down', true);
                break;

            default:
                boy.anims.play('stop', true);
                clearInterval(interval);

                $('.control-btn').prop('disabled', false)
                $('.btn-go').prop('disabled', true);
                $('.btn-delete').prop('disabled', true);
                $('.btn-arrow').prop('disabled', true);

                boyTile = layer.getTileAtWorldXY(boy.x, boy.y, true)
                tigrilloTile = layer.getTileAtWorldXY(tigrillo.x, tigrillo.y, true)
                openModal(boyTile == tigrilloTile);
                start();
                break;
        }
    }
}

function toggleAudio(audioId) {
    const audio = $(audioId)[0];
    const btn = $(`${audioId}-sound-btn`);
    const isPaused = audio.paused;

    const {sound_class, no_sound_class} = getSoundClases(audioId);
    
    pauseAllAudios();
    if (isPaused) {
        audio.play();
        btn.removeClass(sound_class)
        btn.addClass(no_sound_class)
    } else {
        btn.removeClass(no_sound_class)
        btn.addClass(sound_class)
    }
}

function pauseAudio(audioId) {
    pauseAllAudios();
    const audio = $(audioId)[0];
    const btn = $(`${audioId}-sound-btn`);

    const {sound_class, no_sound_class} = getSoundClases(audioId);

    audio.pause();
    btn.removeClass(no_sound_class);
    btn.addClass(sound_class);
}

function playAudio(audioId) {
    pauseAllAudios();
    const audio = $(audioId)[0];
    const btn = $(`${audioId}-sound-btn`);

    const {sound_class, no_sound_class} = getSoundClases(audioId);
    
    audio.play();
    btn.removeClass(sound_class);
    btn.addClass(no_sound_class);
}

function pauseAllAudios() {
    $('audio').each(function () {
        this.pause(); // Stop playing
        this.currentTime = 0; // Reset time
    });
}

function getSoundClases(audioId) {
    return {
        sound_class: audioId == "#game-music" ? "btn-nomute" : "btn-sound",
        no_sound_class: audioId == "#game-music" ? "btn-mute" : "btn-no-sound"
    }
}

$('.modal').on('shown.bs.modal', function () {
    const audio = $("#game-music")[0];
    musicWasPaused = audio.paused;
    pauseAudio('#game-music');
});

$('.modal').on('hidden.bs.modal', function () {
    if (!musicWasPaused) {
        playAudio("#game-music");
    }
});


function start() {
    boy.anims.play('stop', true);

    boyTile = layer.getTileAtWorldXY(boy.x, boy.y, true)

    do {
        xpos = 80 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0 || boyTile == layer.getTileAtWorldXY(xpos, ypos, true));

    tigrillo.x = xpos;
    tigrillo.y = ypos;
}


// --------- MODAL --------------
const btn_types = [
    "btn-success",
    "btn-warning",
    "btn-primary",
    "btn-danger",
    "btn-info",
    "btn-secondary",
    "btn-light",
    "btn-dark"
]

var preguntas = [
    {
        titulo: "1 + 2",
        info: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Nam tortor diam, posuere a molestie nec, maximus eu dui. Mauris luctus congue dui ac pellentesque. Fusce bibendum ultrices elit, eget porta lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce pellentesque nibh ut ipsum finibus, sed cursus nibh maximus.",
        pregunta: "¿Cuanto es 1 + 2?",
        respuesta: "3",
        audio: "assets/audios/preguntas/instrucciones.mp3",
        imagen: "https://picsum.photos/1200/800",
        opciones: [
            "1",
            "4",
            "3",
            "Ns/Nr"
        ]
    },
    {
        titulo: "2 + 2",
        info: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Nam tortor diam, posuere a molestie nec, maximus eu dui. Mauris luctus congue dui ac pellentesque. Fusce bibendum ultrices elit, eget porta lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce pellentesque nibh ut ipsum finibus, sed cursus nibh maximus.",
        pregunta: "¿Cuanto es 2 + 2?",
        respuesta: "4",
        audio: "assets/audios/preguntas/instrucciones.mp3",
        imagen: "https://picsum.photos/1200/800",
        opciones: [
            "1",
            "4",
            "5"
        ]
    },
    {
        titulo: "Mejor juego",
        info: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Nam tortor diam, posuere a molestie nec, maximus eu dui. Mauris luctus congue dui ac pellentesque. Fusce bibendum ultrices elit, eget porta lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce pellentesque nibh ut ipsum finibus, sed cursus nibh maximus.",
        pregunta: "¿Es este el mejor juego?",
        respuesta: "Si",
        audio: "assets/audios/preguntas/instrucciones.mp3",
        imagen: "https://picsum.photos/1200/800",
        opciones: [
            "Si",
            "No",
            "Tal vez"
        ]
    }
]

function toHtml({ pregunta, opciones, respuesta, audio, imagen, info }) {
    return `<div class="row justify-content-center align-items-center">
                <div class="row col-12 d-flex text-justify justify-content-end">
                    <p>${info}</p>
                    <button id="pregunta-sound-btn" type="button" class="btn btn-sound"
                        onclick="toggleAudio('#pregunta')"></button>
                        <audio id="pregunta" src=${audio}></audio>
                    <img class="img-fluid mt-2 " src="${imagen}">
                </div>
                <div class="row col-12 d-flex text-justify justify-content-center mt-2">
                    <div class="col-6 d-flex justify-content-center mt-3">
                        <h5>${pregunta}</h5>
                    </div>
                    <div class="col-6 d-flex justify-content-center">
                    ${opciones.map((x, i) =>
        `<button 
                                    class="btn btn-lg ${btn_types[i]} d-flex m-2" 
                                    data-dismiss="modal" 
                                    aria-label="Close" 
                                    onclick="respuesta('${x}', '${respuesta}')"
                                >
                                    ${x}
                                </button>`
    ).reduce((prev, curr) => prev + curr)}
                    </div>
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

};

//Puntuación
function respuesta(respuesta, respuesta_correcta) {
    if (respuesta === respuesta_correcta) {
        score++
        $('#puntuacion').append("<div class='estrella'><img class='img-fluid' src='assets/images/star.png'></div>")
    }

    if(n==preguntas.length){        
        var aux = score;
        for (var i=0; i<n; i++){
            if(aux>0){
                $('#score').append("<img class='img-fluid estrella' class='estrella'src='assets/images/star.png'>")
            }else{
                $('#score').append("<img class='img-fluid estrella' src='assets/images/gray.png'>")
            }
            aux--;
        }
        $('#modal-end').modal('show')
       
    }
}


function restart(){
    n = 0
    score = 0
    $("#puntuacion").empty();
    $("#score").empty();
    $('#turnos').html(preguntas.length - n)
}

function shuffleQuestions() {
    preguntas.sort(() => Math.random() - 0.5).forEach(pregunta => {
        pregunta.opciones.sort(() => Math.random() - 0.5)
    })
}
shuffleQuestions()