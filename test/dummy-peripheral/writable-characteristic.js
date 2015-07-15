var util = require('util');
var os = require('os');
var bleno = require('bleno');
var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var WritableCharacteristic = function() {
  console.log('Configure writable characteristic');

  this.value = undefined;

  WritableCharacteristic.super_.call(this, {
      uuid: '2777',
      properties: ['read', 'write', 'writeWithoutResponse'],
      descriptors: [
        new Descriptor({
            uuid: '2902',
            value: 'A writable test value'
        }),
      ]
  });
};

util.inherits(WritableCharacteristic, Characteristic);

WritableCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('Got read request');

  console.log('Replying with buffer: [' + this.value + ']');
  callback(this.RESULT_SUCCESS, new Buffer([this.value]));
};

WritableCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  var value = new Int8Array(data);
  console.log('Got write request');
  console.log('Writing value: ' + value[0]);

  this.value = value[0];

  callback(this.RESULT_SUCCESS);
};

module.exports = WritableCharacteristic;
