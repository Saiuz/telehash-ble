var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var bleno = require('bleno');
var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DummyCharacteristic = function() {
  console.log('Configure dummy characteristic');

  DummyCharacteristic.super_.call(this, {
      uuid: '2666',
      properties: ['read'],
      descriptors: [
        new Descriptor({
            uuid: '2901',
            value: 'A test value'
        }),
      ]
  });
};

util.inherits(DummyCharacteristic, Characteristic);

DummyCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('Got read request');

  console.log('Replying with buffer: [12] / [0x0C]');
  callback(this.RESULT_SUCCESS, new Buffer([12]));
};

module.exports = DummyCharacteristic;
