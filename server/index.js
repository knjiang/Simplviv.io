const path = require('path');
const jsdom = require('jsdom');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const Datauri = require('datauri');
const datauri = new Datauri();
const { JSDOM } = jsdom;

app.use(express.static(__dirname + '/public'));
app.get('/phaser.js', function(req, res){
    res.sendFile(__dirname + '/phaser.js');
});
app.get('/assets/tilesheet_complete_2X.png', function(req, res){
    res.sendFile(__dirname + '/assets/tilesheet_complete_2X.png');
});
app.get('/assets/map1.json', function(req, res){
    res.sendFile(__dirname + '/assets/map1.json');
});
app.get('/assets/hitman1_gun.png', function(req, res){
    res.sendFile(__dirname + '/assets/hitman1_gun.png');
});
app.get('/assets/soldier1_gun.png', function(req, res){
    res.sendFile(__dirname + '/assets/soldier1_gun.png');
});
app.get('/assets/bullet.png', function(req, res){
    res.sendFile(__dirname + '/assets/bullet.png');
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

function setupAuthoritativePhaser() {
    JSDOM.fromFile(path.join(__dirname, 'server2/index.html'), {
        // To run the scripts in the html file
        runScripts: "dangerously",
        // Also load supported external resources
        resources: "usable",
        // So requestAnimatinFrame events fire
        pretendToBeVisual: true
    }).then((dom) => {
        dom.window.URL.createObjectURL = function (blob) {
            if(blob){
                return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
            }
        };;
        dom.window.URL.revokeObjectURL = function (objectURL) {
            // Do nothing at the moment
        };
        dom.window.gameLoaded = () => {
            server.listen(8081, function () {
                console.log(`Listening on ${server.address().port}`);
            });
        };
        dom.window.io = io;
    }).catch((error) => {
        console.log(error.message);
    });
}
setupAuthoritativePhaser();
