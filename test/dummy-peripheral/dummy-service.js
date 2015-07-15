var util = require('util');
var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;
var DummyCharacteristic = require('./dummy-characteristic');
var WriteableCharacteristic = require('./writable-characteristic');

function DummyService() {
  DummyService.super_.call(this, {
    uuid: '1666',
    characteristics: [
      new DummyCharacteristic(),
      new WriteableCharacteristic()
    ]
  });
}

util.inherits(DummyService, BlenoPrimaryService);

module.exports = DummyService;
