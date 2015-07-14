var util = require('util');
var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;
var DummyCharacteristic = require('./dummy-characteristic');

function DummyService() {
  DummyService.super_.call(this, {
    uuid: '1666',
    characteristics: [
      new DummyCharacteristic()
    ]
  });
}

util.inherits(DummyService, BlenoPrimaryService);

module.exports = DummyService;
