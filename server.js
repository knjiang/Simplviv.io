var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(__dirname + '/public'));
app.get('/main.js', function(req, res){
    res.sendFile(__dirname + '/main.js');
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
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});