var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade:{
            gravity : {y :0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var game = new Phaser.Game(config);
let cursors;
let player;
var spaceKey;

function preload(){
    this.load.image('gameTiles', 'assets/tilesheet_complete_2X.png');
    this.load.tilemapTiledJSON('map', 'assets/map1.json');
    this.load.image('player','assets/hitman1_gun.png')
}
function create() {
    const map = this.make.tilemap({key: 'map'});

    const tileset = map.addTilesetImage('tilesheet_complete_2X', 'gameTiles');
    const tutorial = this.add.text(0, 0, 'Arrow keys to move', {
            font: "14px Serif",
            padding: {x: 10, y: 10},
            backgroundColor: "##00FFFFFF",
        })
        .setScrollFactor(0)
        .setDepth(30);
    const layer1 = map.createStaticLayer("f1", tileset, 0,0);
    const camera = this.cameras.main;
    player = this.physics.add.sprite(200,300,'player')
    player.angle = 0;
    camera.startFollow(player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    cursors = this.input.keyboard.createCursorKeys();
}
function update(time,delta) {
    player.body.setVelocity(0);
    if (cursors.left.isDown) {
        player.body.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(200);
    }
    if (cursors.up.isDown) {
        player.body.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(200);
    }
    player.body.velocity.normalize().scale(200);
    if (cursors.left.isDown) {
        player.angle = 180;
    } else if (cursors.right.isDown) {
        player.angle = 0;
    } else if (cursors.up.isDown) {
        player.angle = 270;
    } else if (cursors.down.isDown) {
        player.angle = 90;
    }
}