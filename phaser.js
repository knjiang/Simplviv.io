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
let spaceKey;
let tutorial;

function preload(){
    this.load.image('gameTiles', 'assets/tilesheet_complete_2X.png');
    this.load.tilemapTiledJSON('map', 'assets/map1.json');
    this.load.image('player','assets/hitman1_gun.png');
    this.load.image('bullet','assets/bullet.png');
}
function create() {
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('tilesheet_complete_2X', 'gameTiles');
    tutorial = this.add.text(0, 0, 'Arrow keys to move\nSpacebar to shoot', {
            font: "14px Serif",
            padding: {x: 10, y: 10},
            backgroundColor: "##00FFFFFF",
        })
        .setScrollFactor(0)
        .setDepth(30);
    const layer1 = map.createStaticLayer("f1", tileset, 0,0);
    const layer2 = map.createStaticLayer("f2", tileset, 0,0);
    const hp = this.add.text(0,585,'HP: 100/100',{
        font: '16px Monospace',
        backgroundColor: "##00FFFFFF",
    }).setScrollFactor(0)
        .setDepth(30);
    const ammo = this.add.text(695,585,'AMMO: 30/30',{
        font: '16px Monospace',
        backgroundColor: "##00FFFFFF",
    }).setScrollFactor(0)
        .setDepth(30);
    const camera = this.cameras.main;
    player = this.physics.add.sprite(200,300,'player')
    player.angle = 0;
    camera.startFollow(player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

                this.speed = Phaser.Math.GetSpeed(400, 1);
                this.velocity = new Phaser.Geom.Point(0, 0);
            },

        fire: function (x, y, direction)
        {
            this.setPosition(x, y);

            this.setActive(true);
            this.setVisible(true);
            this.velocity.setTo(0, -this.speed);
            console.log(direction);
            if (direction == 0){
                console.log('right shot')
                this.velocity.x = this.speed;
                this.velocity.y = 0;
            } else if (direction == -90){
                this.velocity.y = -this.speed;
                this.velocity.x = 0;
            }else if (direction == 90){
                this.velocity.y = this.speed;
                this.velocity.x = 0;
            } else if (direction == -180){
                this.velocity.x = -this.speed;
                this.velocity.y = 0;
            }
        },

        update: function (time, delta) {
            this.x += this.velocity.x * delta;
            this.y += this.velocity.y * delta;
            if (this.y < -50) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    });
    bullets = this.add.group({
        classType: Bullet,
        runChildUpdate: true
    });
    bullets.angle = 0
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
    if (spaceKey.isDown){
        var bullet = bullets.get();
        if (bullet)
        {
            bullet.fire(player.x, player.y,player.angle);
        }
    }
}