var bleno = require('bleno');
var util = require('util');
var lob = require('lob-enc')

var CHUNK_SIZE = 10


var chunk = lob.chunking({ size: CHUNK_SIZE }, function (err, packet) {
})

var name = 'telehash';
var uuid = '42424242424242424242424242424242';

function StreamCharacteristic() {
  StreamCharacteristic.super_.call(this, {
    uuid: '2666',
    properties: ['read', 'write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Send or receive data.'
      })
    ]
  })
}


util.inherits(StreamCharacteristic, bleno.Characteristic)

StreamCharacteristic.prototype.onReadRequest = function (offset, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG, null)
  } else {
    callback(this.RESULT_SUCCESS, new Buffer('Hi!'))
  }
}




function StreamService() {
  StreamService.super_.call(this, {
    uuid: uuid,
    characterstics: [
      new StreamCharacteristic()
    ]
  })
}

util.inherits(StreamService, bleno.PrimaryService)

bleno.on('stateChange', function(state) {
  console.log('Bluetooth adapter is: ' + state);

  if (state === 'poweredOn') {
    console.log('DummyService uuid: ' + primaryService.uuid);
    bleno.startAdvertising('Dummy', [primaryService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});

var primaryService = new StreamService();

bleno.on('advertisingStart', function(error) {
  console.log('advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([primaryService]);
  }
});

bleno.on('accept', function (address) {
  console.log('Accepting connection from ' + address);
});

bleno.on('disconnect', function (address) {
  console.log('Disconnection from ' + address);
});
