var util = require('util');
var bleno = require('bleno');
var lob = require('lob-enc');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var CHUNK_SIZE = 5;

var StreamCharacteristic = function() {
  console.log('Configure stream characteristic');

  StreamCharacteristic.super_.call(this, {
      uuid: '2666',
      properties: ['read', 'write'],
      descriptors: [
        new Descriptor({
            uuid: '2901',
            value: 'The Stream'
        }),
      ]
  });

  this.chunked = lob.chunking({ size: CHUNK_SIZE }, function (err, packet) {
    this.emit('packet', packet);
    if (packet.json) {
      this.emit('packet:json', packet.json);
    }
  }.bind(this));
};

util.inherits(StreamCharacteristic, Characteristic);


StreamCharacteristic.prototype.send = function (value, callback) {
  var data = lob.encode(value);
  this.chunked.send(data);
};

StreamCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('Got read request');

  var data = this.chunked.read(CHUNK_SIZE) || this.chunked.read();

  if (data) {
    console.log('Replying with buffer: ', data.byteLength);
  }

  callback(this.RESULT_SUCCESS, data);
};

StreamCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, done) {
  console.log('Got write request');
  this.chunked.write(data);
  done();
};

module.exports = StreamCharacteristic;
