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
}

util.inherits(StreamService, BlenoPrimaryService);

StreamService.prototype.send = function (value) {
  this.streamCharacteristic.send(value);
}

module.exports = StreamService;
