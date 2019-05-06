const config = {
    type: Phaser.HEADLESS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoFocus: false,
};
const players = {};
var bullets_array = [];

function preload() {
    this.load.image('gameTiles', 'assets/tilesheet_complete_2X.png');
    this.load.tilemapTiledJSON('map', 'assets/map1.json');
    this.load.image('player','assets/hitman1_gun.png');
    this.load.image('bullet','assets/bullet.png');
    this.load.image('others','assets/soldier1_gun.png');
}

function create() {
    var self = this;
    this.players = this.physics.add.group();
    io.on('connection', function (socket) {
        console.log('User: ' + socket.id.toString() + ' has connected');
        players[socket.id] = {
            x: Math.floor(Math.random() * 700) + 50,
            y: Math.floor(Math.random() * 500) + 50,
            angle: 0,
            playerId: socket.id,
            input: {
                left: false,
                right: false,
                up: false,
                down: false,
                space: false,
            },
            moving: false,
            score: 0,
        };
        addPlayer(self, players[socket.id]);
        socket.emit('currentPlayers', players);
        socket.broadcast.emit('newPlayer', players[socket.id]);
        socket.on('disconnect', function () {
            console.log('user disconnected');
            removePlayer(self, socket.id);
            delete players[socket.id];
            io.emit('disconnect', socket.id);
        });
        socket.on('playerInput', function (inputData) {
            handlePlayerInput(self, socket.id, inputData);
        });
    });
}

function update(time,delta) {
    this.players.getChildren().forEach((player) => {
        player.moving = false;
        const input = players[player.playerId].input;
        player.body.setVelocity(0);
        if (input.left) {
            player.moving = true;
            player.body.setVelocityX(-200);
        } else if (input.right) {
            player.moving = true;
            player.body.setVelocityX(200);
        }
        if (input.up) {
            player.moving = true;
            player.body.setVelocityY(-200);
        } else if (input.down) {
            player.moving = true;
            player.body.setVelocityY(200);
        }
        player.body.velocity.normalize().scale(200);
        if (input.left) {
            player.angle = 180;
        } else if (input.right) {
            player.angle = 0;
        } else if (input.up) {
            player.angle = 270;
        } else if (input.down) {
            player.angle = 90;
        }
        if (input.space){
            var newBullet = {
                x: player.x,
                y: player.y,
                angle: player.angle,
                owner: player.playerId,
                speed: Phaser.Math.GetSpeed(400, .05),
            };
            bullets_array.push(newBullet)
        }
        players[player.playerId].x = player.x;
        players[player.playerId].y = player.y;
        players[player.playerId].angle = player.angle;
        players[player.playerId].moving = player.moving;
    });
    for(var i=0;i<bullets_array.length;i++){
        var bullet = bullets_array[i];
        bullet.speed_x = 0;
        bullet.speed_y = 0;
        if (bullet.angle == 0){
            bullet.speed_x =  bullet.speed;
            bullet.speed_y  = 0;
        } else if (bullet.angle == -90){
            bullet.speed_y = -bullet.speed;
            bullet.speed_x= 0;
        }else if (bullet.angle == 90){
            bullet.speed_y = bullet.speed;
            bullet.speed_x = 0;
        } else if (bullet.angle == -180){
            bullet.speed_x= -bullet.speed;
            bullet.speed_y  = 0;
        }
        bullet.x += bullet.speed_x;
        bullet.y += bullet.speed_y;
        for(var id in players){
            if(bullet.owner != id){
                var dx = players[id].x - bullet.x;
                var dy = players[id].y - bullet.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if(dist < 10){
                    if (players[bullet.owner]){
                        bullets_array.splice(i,1);
                        i--;
                        players[bullet.owner].score += 1;
                    }
                }
            }
        }
        if(bullet.x < -10 || bullet.x > 1000 || bullet.y < -10 || bullet.y > 1000){
            bullets_array.splice(i,1);
            i--;
        }

    }
    io.emit("bullets-update",bullets_array);
    io.emit('playerUpdates', players);
}
function addPlayer(self, playerInfo) {
    const player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'player').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    player.setDrag(100);
    player.setAngularDrag(100);
    player.setMaxVelocity(200);
    player.playerId = playerInfo.playerId;
    self.players.add(player);
}
function removePlayer(self, playerId) {
    self.players.getChildren().forEach((player) => {
        if (playerId === player.playerId) {
            player.destroy();
        }
    });
}
function handlePlayerInput(self, playerId, input) {
    self.players.getChildren().forEach((player) => {
        if (playerId === player.playerId) {
            players[player.playerId].input = input;
        }
    });
}
const game = new Phaser.Game(config);
window.gameLoaded();