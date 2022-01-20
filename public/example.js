var text = "HOLA MUNDO"

const myCanvass = document.createElement('canvas');
myCanvass.id = 'myCanvass';
myCanvass.style = 'border: 2px solid black';

document.body.appendChild(myCanvass);

var config = {
    type: Phaser.CANVAS,
    parent: 'game-container2',
    width: 800,
    height: 800,
    canvas: document.getElementById('myCanvass'),
    //pixelArt: true,
    backgroundColor: '#1a1a2d',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container2',
        width: 800,
        height: 800
    },
    scene: {
        preload: preload,
        create: create
    }

};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/bg.png');
    this.load.image('tiles', 'assets/objects.png');
    this.load.image('car', 'assets/car90.png');
    this.load.image('sga', 'assets/mascota.svg');
    this.load.tilemapCSV('map', 'assets/grid2.csv');
    
}

function create ()
{
    this.add.image(400, 400, 'sky');
    var map = this.make.tilemap({ key: 'map', tileWidth: 160, tileHeight: 160 });
    var tileset = map.addTilesetImage('tiles', null, 160, 160, 0, 0);
    var layer = map.createLayer(0, tileset, 0, 0);

    var player = this.add.image(160+16, 160+16, 'car');

    //  Left
    this.input.keyboard.on('keydown-A', function (event) {

        var tile = layer.getTileAtWorldXY(player.x - 160, player.y, true);

        if (tile.index === 1 ||tile.index === 2 || tile.index === 3 || tile.index === 4)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.x -= 160;
            player.angle = 180;
        }
        

    });

    //  Right
    this.input.keyboard.on('keydown-D', function (event) {

        var tile = layer.getTileAtWorldXY(player.x + 160, player.y, true);

        if (tile.index === 1 ||tile.index === 2 || tile.index === 3 || tile.index === 4)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.x += 160;
            player.angle = 0;
        }

    });

    //  Up
    this.input.keyboard.on('keydown-W', function (event) {

        var tile = layer.getTileAtWorldXY(player.x, player.y - 160, true);

        if (tile.index === 1 ||tile.index === 2 || tile.index === 3 || tile.index === 4)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.y -= 160;
            player.angle = -90;
        }

    });

    //  Down
    this.input.keyboard.on('keydown-S', function (event) {

        var tile = layer.getTileAtWorldXY(player.x, player.y + 160, true);

        if (tile.index === 1 ||tile.index === 2 || tile.index === 3 || tile.index === 4)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.y += 160;
            player.angle = 90;
        }

    });

}
