var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload(){
    this.load.image('gameTiles', 'assets/tilesheet_complete_2X.png');
    this.load.tilemapTiledJSON('map', 'assets/demo.json');
}
function create(){
    const map = this.make.tilemap({ key : 'map'});

    const tileset = map.addTilesetImage('tilesheet_complete_2X','gameTiles');

    const layer1 = map.createStaticLayer("\u5757\u5c42 1", tileset, 0,0);
    const layer2 = map.createStaticLayer("\u56fe\u5757\u5c42 2", tileset, 0,0);
}