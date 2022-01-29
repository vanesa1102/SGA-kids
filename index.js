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
var player, tigrillo;
var boyTile, tigrilloTile;
var score = 0;
var gameOver = false;
var scoreText;
var map, tileset, layer, tile;
var instructions = [];
var xpos, ypos;
var n = 0; //Para saber el # de pregunta
var personajes = ['boy', 'girl', 'ghost'];
var personaje = 'boy';
var game = new Phaser.Game(config);

function preload() {
    this.load.image('bg', 'assets/images/bg.png');
    this.load.image('tiles', 'assets/images/objects.png');
    this.load.image('tigrillo', 'assets/images/tigrillo.png');
    this.load.spritesheet('boy', 'assets/images/boy.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('girl', 'assets/images/girl.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('ghost', 'assets/images/ghost.png', { frameWidth: 32, frameHeight: 32 });
    this.load.tilemapCSV('map', 'assets/images/grid.csv');
}

function create() {

    var music = document.getElementById("game-music");
    music.volume = 0.1;

    playAudio('#game-music');

    //  A simple background for our game
    this.add.image(400, 400, 'bg');
    map = this.make.tilemap({ key: 'map', tileWidth: 160, tileHeight: 160 });
    tileset = map.addTilesetImage('tiles', null, 160, 160, 0, 0);
    layer = map.createLayer(0, tileset, 0, 0);

    personajes.forEach(x => {
        this.anims.create({
            key: `${x}_stop`,
            frames: this.anims.generateFrameNumbers(x, { frames: [1] }),
            frameRate: 50,
            repeat: -1
        });
        this.anims.create({
            key: `${x}_walk_down`,
            frames: this.anims.generateFrameNumbers(x, { frames: [0, 1, 2] }),
            frameRate: 8,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: `${x}_walk_right`,
            frames: this.anims.generateFrameNumbers(x, { frames: [3, 4, 5] }),
            frameRate: 8,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: `${x}_walk_left`,
            frames: this.anims.generateFrameNumbers(x, { frames: [6, 7, 8] }),
            frameRate: 8,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: `${x}_walk_up`,
            frames: this.anims.generateFrameNumbers(x, { frames: [9, 10, 11] }),
            frameRate: 8,
            yoyo: true,
            repeat: -1
        });
    });


    do {
        xpos = 120 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0);

    player = this.physics.add.sprite(xpos, ypos, personaje).setScale(2);
    player.anims.play(`${personaje}_stop`, true);
    player.setCollideWorldBounds(true);

    do {
        xpos = 80 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0 || (player.x == xpos + 40 || player.y == ypos));

    tigrillo = this.add.tileSprite(xpos, ypos, 160, 160, 'tigrillo');

    $('#turnos').html(preguntas.length - n)
}

function update() {
}

function cambiarPersonaje(name) {
    personaje = name
    player.anims.play(`${personaje}_stop`, true);
}

function agregar(walk) {
    $('.btn-go').prop('disabled', false);
    $('.btn-delete').prop('disabled', false);
    $('.btn-arrow').prop('disabled', false);
    $("#arrow-container").append("<img class='img-fluid' src='assets/images/" + walk + "2.png'>");
    instructions.push(walk)
    $('#respuesta').html('');
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
        player.setVelocity(0, 0);
        const i = instructions.shift()
        switch (i) {
            case 'walk_left':
                tile = layer.getTileAtWorldXY(player.x - 160, player.y, true);
                if (tile != null && tile.index == 0) {
                    player.setVelocity(-80, 0);
                }
                player.anims.play(`${personaje}_walk_left`, true);
                break;

            case 'walk_right':
                tile = layer.getTileAtWorldXY(player.x + 160, player.y, true);
                if (tile != null && tile.index == 0) {
                    player.setVelocity(80, 0);
                }
                player.anims.play(`${personaje}_walk_right`, true);
                break;

            case 'walk_up':
                tile = layer.getTileAtWorldXY(player.x, player.y - 160, true);
                if (tile != null && tile.index == 0) {
                    player.setVelocity(0, -80);
                }
                player.anims.play(`${personaje}_walk_up`, true);
                break;

            case 'walk_down':
                tile = layer.getTileAtWorldXY(player.x, player.y + 160, true);
                if (tile != null && tile.index == 0) {
                    player.setVelocity(0, 80);
                }
                player.anims.play(`${personaje}_walk_down`, true);
                break;

            default:
                player.anims.play(`${personaje}_stop`, true);
                clearInterval(interval);

                $('.control-btn').prop('disabled', false)
                $('.btn-go').prop('disabled', true);
                $('.btn-delete').prop('disabled', true);
                $('.btn-arrow').prop('disabled', true);

                boyTile = layer.getTileAtWorldXY(player.x, player.y, true)
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

    const { sound_class, no_sound_class } = getSoundClases(audioId);

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

    const { sound_class, no_sound_class } = getSoundClases(audioId);

    audio.pause();
    btn.removeClass(no_sound_class);
    btn.addClass(sound_class);
}

function playAudio(audioId) {
    
    pauseAllAudios();
    
    const audio = $(audioId)[0];
    const btn = $(`${audioId}-sound-btn`);

    const { sound_class, no_sound_class } = getSoundClases(audioId);

    audio.play();
    btn.removeClass(sound_class);
    btn.addClass(no_sound_class);
}

function pauseAllAudios() {
    $('audio').each(function () {
        if (this.id != 'wrong' && this.id != 'right' && this.id != 'end') {
            this.pause(); // Stop playing
            if(this.id != 'game-music')
            this.currentTime = 0; // Reset time
        }
    });
}

function getSoundClases(audioId) {
    return {
        sound_class: audioId == "#game-music" ? "btn-nomute" : "btn-sound",
        no_sound_class: audioId == "#game-music" ? "btn-mute" : "btn-no-sound"
    }
}

$('.modal').on('shown.bs.modal', function () {
    if(this.id != 'modal-end'){
        const audio = $("#game-music")[0];
        musicWasPaused = audio.paused;
        pauseAudio('#game-music');
    }
});

$('.modal').on('hidden.bs.modal', function () {
    if (!musicWasPaused) {
        playAudio("#game-music");
    }
});


function start() {
    player.anims.play(`${personaje}_stop`, true);

    boyTile = layer.getTileAtWorldXY(player.x, player.y, true)

    do {
        xpos = 80 + 160 * Math.floor(Math.random() * 5);
        ypos = 80 + 160 * Math.floor(Math.random() * 5);
    } while (layer.getTileAtWorldXY(xpos, ypos, true).index > 0 || boyTile == layer.getTileAtWorldXY(xpos, ypos, true));

    tigrillo.x = xpos;
    tigrillo.y = ypos;
}


// --------- MODAL --------------
const btn_types = [
    "btn-info",
    "btn-success",
    "btn-secondary",
    "btn-warning",
    "btn-primary",
    "btn-danger",
    "btn-light",
    "btn-dark"
]

var preguntas = [{
    "titulo": "El agua es vida",
    "info": "El agua es un recurso muy importante para la vida de todos los seres vivos; sin ella no pueden vivir los animales, las plantas ni los seres humanos, por eso debemos cuidarla y usarla con responsabilidad.",
    "pregunta": "¿Mientras te cepillas los dientes debes dejar la llave del lavamanos abierta o cerrada?",
    "respuesta": "Cerrada",
    "audio": "assets/audios/preguntas/agua.mp3",
    "imagen": "water.png",
    "opciones": [
        "Abierta",
        "Cerrada"
    ]
}, {
    "titulo": "Los residuos en su lugar",
    "info": "Los residuos que generamos los seres humanos no deben ser arrojados a los ríos, lagos, mares, campos o al suelo. Cuando tengas algo que debas disponer, debes buscar la caneca adecuada y depositarlo.",
    "pregunta": "¿Dónde debes botar los residuos, en la caneca o en el piso?",
    "respuesta": "En la caneca",
    "audio": "assets/audios/preguntas/residuos.mp3",
    "imagen": "image.png",
    "opciones": [
        "En la caneca",
        "En el piso"
    ]
}, {
    "titulo": "Ahorremos energía",
    "info": "La energía eléctrica que utilizamos proviene, en su mayor parte, de recursos naturales y nos sirve para iluminar las habitaciones oscuras. No debemos desperdiciarla. Así que cuando salgas de una habitación debes apagar la luz.",
    "pregunta": "¿Cuándo sales de una habitación, la luz debe quedar encendida o apagada?",
    "respuesta": "Apagada",
    "audio": "assets/audios/preguntas/energia.mp3",
    "imagen": "luz.png",
    "opciones": [
        "Encendida",
        "Apagada"
    ]
}
]

function toHtml({ pregunta, opciones, respuesta, audio, imagen, info }) {
    return `<div class="row justify-content-center align-items-center">
                <div class="row col-12 col-lg-5 m-2 d-flex text-justify justify-content-center">
                    <div class="col-12 d-flex text-justify justify-content-center">
                        <img class="img-fluid " src="${"assets/images/" + imagen}">
                    </div>
                    <div class="col-12 d-flex text-justify justify-content-center">
                        <button id="pregunta-sound-btn" type="button" class="btn btn-sound audio-modal m-3"
                            onclick="toggleAudio('#pregunta')"></button>
                        <audio id="pregunta" src=${audio}></audio>
                    </div>
                </div>
                <div class="row col-12 col-lg-6 d-flex text-justify justify-content-center mt-2">
                    <p>${info}</p>
                    <p class="font-weight-bold">${pregunta}</p>
                    <div class="col-12 d-flex justify-content-center">
                        ${opciones.map((x, i) => `<button 
                            class="btn btn-lg ${btn_types[i]} d-flex m-2" 
                            data-dismiss="modal" 
                            aria-label="Close" 
                            onclick="respuesta('${x}', '${respuesta}')"
                        >
                            ${x}
                        </button>`).reduce((prev, curr) => prev + curr)}
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
        $('#puntuacion').append("<div class='estrella'><img class='img-fluid' src='assets/images/star.png'></div>");
        $('#respuesta').html('<h5 class="correcto"><b>¡ Correcto !</b></h5>');
        playAudio('#right')
    } else {
        playAudio('#wrong')
        $('#respuesta').html('<h5 class="incorrecto"><b>¡ Vuelve a intentarlo !</b></h5>');

    }

    if (n == preguntas.length) {
        var aux = score;
        for (var i = 0; i < n; i++) {
            if (aux > 0) {
                $('#score').append("<img class='img-fluid estrella' class='estrella'src='assets/images/star.png'>")
            } else {
                $('#score').append("<img class='img-fluid estrella' src='assets/images/gray.png'>")
            }
            aux--;
        }
        $('#modal-end').modal('show')
        playAudio("#end")

    }
}


function restart() {
    n = 0
    score = 0
    start()
    $("#puntuacion").empty();
    $("#score").empty();
    $('#turnos').html(preguntas.length - n);
    $('#respuesta').html('');
}

function shuffleQuestions() {
    preguntas.sort(() => Math.random() - 0.5).forEach(pregunta => {
        pregunta.opciones.sort(() => Math.random() - 0.5)
    })
}

shuffleQuestions()