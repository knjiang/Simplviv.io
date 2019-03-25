var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
};

var game = new Phaser.Game(config);
var camera = scene.cameras.main;

function preload(){
    this.load.image('gameTiles', 'assets/tilesheet_complete_2X.png');
    this.load.tilemapTiledJSON('map', 'assets/map1.json');
    this.load.image('player','assets/hitman1_gun.png')
}
function create(){
    const map = this.make.tilemap({ key : 'map'});

    const tileset = map.addTilesetImage('tilesheet_complete_2X','gameTiles');

    const layer1 = map.createStaticLayer("f1", tileset, 0,0);
    const camera = this.cameras.main;
    const cursors = this.input.keyboard.createCursorKeys();
    controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera: camera,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    });
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    var player = this.add.sprite(200,300,'player')
    //camera.startFollow(player)
}
function update(time,delta) {
    controls.update(delta);
}
function render() {

    game.debug.cameraInfo(game.camera, 32, 32);

}