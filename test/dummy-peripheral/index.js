var bleno = require('bleno');
var DummyService = require('./dummy-service');

var primaryService = new DummyService();

//console.log(bleno);
//console.log(primaryService);

bleno.on('stateChange', function(state) {
  console.log('Bluetooth adapter is: ' + state);

  if (state === 'poweredOn') {
    console.log('DummyService uuid: ' + primaryService.uuid);
    bleno.startAdvertising('Dummy', [primaryService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});

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
