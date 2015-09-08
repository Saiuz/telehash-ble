var util = require('util');
var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;
var StreamCharacteristic = require('./stream-characteristic');

exports.uuid = '42424242424242424242424242424242';

function StreamService() {
  this.streamCharacteristic = new StreamCharacteristic();

  StreamService.super_.call(this, {
    uuid: exports.uuid,
    characteristics: [
      this.streamCharacteristic
    ]
  });

  this.streamCharacteristic.on('telehash:packet', function (packet) {
    this.emit('telehash:packet', packet);
  }.bind(this));
}

util.inherits(StreamService, BlenoPrimaryService);

StreamService.prototype.send = function (value, done) {
  this.streamCharacteristic.send(value, done);
}

module.exports = StreamService;
