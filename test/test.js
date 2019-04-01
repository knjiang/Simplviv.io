const {expect} = require('chai');
var request = require('request');

describe('Phaser Tests:', function () {
    it('Server Running', function(done) {
        request('http://localhost:8081', function (error,response,body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it('Server Running', function() {
        expect(player.x).to.equal(200)
    });
})