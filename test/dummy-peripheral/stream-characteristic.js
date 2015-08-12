var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var bleno = require('bleno');
var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

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
};

util.inherits(StreamCharacteristic, Characteristic);

var lob = require('lob-enc');
var value = 'abcdefghijklmnopqrstuvwxyz';
var CHUNK_SIZE = 5;

var toSend = lob.encode({ value: value });
var chunked = lob.chunking({ size: CHUNK_SIZE }, function (err, packet) {
  console.log('GOT PACKET', packet);
  console.log(packet.json);
});

chunked.send(toSend);

StreamCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('Got read request');

  var data = chunked.read(CHUNK_SIZE) || chunked.read();

  console.log(data);

  if (data) {
    console.log('Replying with buffer: ', data.byteLength);
  }

  callback(this.RESULT_SUCCESS, data);
};

StreamCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, done) {
  chunked.write(data);
  done();
};

module.exports = StreamCharacteristic;
