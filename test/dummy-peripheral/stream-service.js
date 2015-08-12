var util = require('util');
var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;
var StreamCharacteristic = require('./stream-characteristic');

function StreamService() {
  StreamService.super_.call(this, {
    uuid: '1666',
    characteristics: [
      new StreamCharacteristic(),
    ]
  });
}

util.inherits(StreamService, BlenoPrimaryService);

module.exports = StreamService;
