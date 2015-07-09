var Backend = require('./backend');
var noble = require('noble');
var util = require('util');

function NobleBackend() {
  Backend.call(this);
  this._devicesByAddress = {};

  noble.on('discover', function (device) {
    this._devicesByAddress[device.address] = device;

    //TODO: remap device
    this.emit('deviceAdded', device);
  }.bind(this));
}

util.inherits(NobleBackend, Backend);

NobleBackend.prototype._ensureReady = function (callback) {
  var onReady = function (state) {
    if (state === 'poweredOn') {
      callback();
    } else {
      callback(new Error('noble state is: ' + state));
    }
  };

  if (noble.state === 'unknown') {
    noble.once('stateChange', onReady);
  } else {
    process.nextTick(function () {
      onReady(noble.state);
    });
  }
};

NobleBackend.prototype.startDiscovery = function (callback) {
  this._ensureReady(function (err) {
    if (err) {
      callback(err);
    } else {
      noble.startScanning([], false, callback);
    }
  });
};

NobleBackend.prototype.connect = function (deviceAddress, options, callback) {
  var device = this._devicesByAddress[deviceAddress];
  device.connect(callback);
};


module.exports = new NobleBackend();
