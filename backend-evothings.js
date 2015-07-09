var Backend = require('./backend');
var util = require('util');

var ble = window.evothings && window.evothings.ble;

if (!ble) {
  throw new Error('The telehash-ble evothings backend requires window.evothings to exist');
}

function EvothingsBackend() {
  Backend.call(this);

  this._devicesByAddress = {};
}

util.inherits(EvothingsBackend, Backend);

EvothingsBackend.prototype.startDiscovery = function (callback) {
  var self = this;
  var hasCalledCallback = false;
  var onSuccess = function () {
    if (!hasCalledCallback) {
      hasCalledCallback = true;
      callback();
    }
  };

  ble.startScan(
    function (device) {
      if (!hasCalledCallback) {
        hasCalledCallback = true;
        onSuccess();
      }

      self._devicesByAddress[device.address] = device;
      self.emit('deviceAdded', device);
    },
    function (errorCode) {
      hasCalledCallback = true;
      callback(new Error('Evothings error: ' + errorCode));
    }
  );

  setTimeout(onSuccess, 100);
};

EvothingsBackend.prototype.stopDiscovery = function (callback) {
  ble.stopScan();
  process.nextTick(callback);
};

EvothingsBackend.prototype.connect = function (deviceAddress, options, callback) {
  ble.connect(deviceAddress,
    function (info) {
      callback(null, info);
    },
    function (err) {
      callback(new Error('Evothings error code: ' + err));
    }
  );
};


module.exports = new EvothingsBackend();
