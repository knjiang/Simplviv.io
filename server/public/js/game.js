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
    },
};

var game = new Phaser.Game(config);
var bullet_array = [];
let cursors;
let player;
let spaceKey;
let tutorial;

function preload(){
    this.load.image('gameTiles', 'assets/tilesheet_complete_2X.png');
    this.load.tilemapTiledJSON('map', 'assets/map1.json');
    this.load.image('player','assets/hitman1_gun.png');
    this.load.image('others','assets/soldier1_gun.png');
    this.load.image('bullet','assets/bullet.png');
}
function create() {
    var self = this;
    this.socket = io();
    this.players = this.add.group();
    this.socket.on('currentPlayers', function (players) {
        Object.keys(players).forEach(function (id) {
            if (players[id].playerId === self.socket.id) {
                displayPlayers(self, players[id], 'player');
            } else {
                displayPlayers(self, players[id], 'others');
            }
        });
    });

    this.socket.on('newPlayer', function (playerInfo) {
        displayPlayers(self, playerInfo, 'others');
    });

    this.socket.on('disconnect', function (playerId) {
        self.players.getChildren().forEach(function (player) {
            if (playerId === player.playerId) {
                player.destroy();
            }
        });
    });
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('tilesheet_complete_2X', 'gameTiles');
    const layer1 = map.createStaticLayer("f1", tileset, 0,0);
    const layer2 = map.createStaticLayer("f2", tileset, 0,0);
    const camera = this.cameras.main;
    tutorial = this.add.text(0, 0, 'Arrow keys to move\nSpacebar to shoot', {
        font: "14px Serif",
        padding: {x: 10, y: 10},
        backgroundColor: "##00FFFFFF",
    })
        .setScrollFactor(0)
        .setDepth(30);
    const leaderboard = this.add.text(550,0,'',{
        font: '12px Monospace',
        backgroundColor: "##00FFFFFF",
    }).setScrollFactor(0)
        .setDepth(30);
    this.socket.on('playerUpdates', function (players) {
        Object.keys(players).forEach(function (id) {
            self.players.getChildren().forEach(function (player) {
                if (players[id].playerId === player.playerId) {
                    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
                    player.angle = players[id].angle;
                    player.setPosition(players[id].x, players[id].y);
                    if (players[id].moving){
                        camera.startFollow(player)
                    }
                }
            });
        });
        var items = Object.keys(players).map(function(key) {
            return [key, players[key].score];
        });
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        if (items.length < 5){
            for (i = 0; i < 8 - items.length; i++){
                items.push(['None',0])
            }
        }
        leaderboard.setText("Leaderboard \n1."
            + items[0].toString() + "\n2."
            + items[1].toString()  + "\n3."
            + items[2].toString()  + "\n4."
            + items[3].toString()  + "\n5."
            + items[4].toString() )
    });
    this.cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;
    this.downKeyPressed = false;
    this.spaceKeyPressed = false;
    this.socket.on('bullets-update',function(server_bullet_array){
        console.log('reached bullets-update');
        // If there's not enough bullets on the client, create them
        for(var i=0;i<server_bullet_array.length;i++){
            if(bullet_array[i] == undefined){
                bullet_array[i] = self.add.sprite(server_bullet_array[i].x,server_bullet_array[i].y,'bullet');
            } else {
                //Otherwise, just update it!
                bullet_array[i].x = server_bullet_array[i].x;
                bullet_array[i].y = server_bullet_array[i].y;
            }
        }
        // Otherwise if there's too many, delete the extra
        for(var i=server_bullet_array.length;i<bullet_array.length;i++){
            bullet_array[i].destroy();
            bullet_array.splice(i,1);
            i--;
        }
    });
}
function update(time,delta) {
    const left = this.leftKeyPressed;
    const right = this.rightKeyPressed;
    const up = this.upKeyPressed;
    const down = this.downKeyPressed;
    const space = this.spaceKeyPressed;
    if (this.cursors.left.isDown) {
        this.leftKeyPressed = true;
    } else if (this.cursors.right.isDown) {
        this.rightKeyPressed = true;
    } else {
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
    }

    if (this.cursors.up.isDown) {
        this.upKeyPressed = true;
    } else {
        this.upKeyPressed = false;
    }
    if (this.cursors.down.isDown) {
        this.downKeyPressed = true;
    } else {
        this.downKeyPressed = false;
    }
    if (spaceKey.isDown){
        this.spaceKeyPressed = true;
    } else{
        this.spaceKeyPressed = false;
    }
    if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed || down !== this.downKeyPressed || space !== this.spaceKeyPressed) {
        this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed , down: this.downKeyPressed, space : this.spaceKeyPressed});
    }
}
function displayPlayers(self, playerInfo, sprite) {
    const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    player.playerId = playerInfo.playerId;
    self.players.add(player);
}