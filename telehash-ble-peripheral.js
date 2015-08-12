var bleno = require('bleno');

exports.name = 'ble';
exports.uuid = '42424242424242424242424242424242';

var StreamService = require('./stream-service');
var streamService = new StreamService();

bleno.on('advertisingStart', function (err) {
  console.log('advertisingStart: ' + (err ? 'error ' + err : 'success'));

  if (!err) {
    bleno.setServices([streamService]);
  }
});

bleno.on('accept', function (address) {
  console.log('Accepting connection from ' + address);
});

bleno.on('disconnect', function (address) {
  console.log('Disconnection from ' + address);
});


exports.mesh = function (mesh, done) {
  var args = mesh.args||{};
  var telehash = mesh.lib;

  var tp = {};

  tp.paths = function () {
    return [
      { type: 'ble' }
    ];
  };

  mesh.beacon = function (args) {
    if (arguments.length === 1 && !args) {
      bleno.stopAdvertising();
    } else {
      bleno.on('stateChange', function (state) {
        if (state === 'poweredOn') {
          bleno.startAdvertising('telehash', [streamService.uuid]);
          streamService.send({ value: 'abc' });
        }
      });
    }
  };

  done(null, tp);
};

