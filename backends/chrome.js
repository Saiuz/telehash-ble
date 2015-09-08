var Base = require('./base');
var util = require('util');

function ChromeBackend() {
  Base.call(this);

  var self = this;

  chrome.bluetooth.onDeviceAdded.addListener(function (device) {
    self.emit('deviceAdded', device);
  });
}

util.inherits(ChromeBackend, Base);

ChromeBackend.prototype.startDiscovery = function (callback) {
  chrome.bluetooth.startDiscovery(callback);
};

ChromeBackend.prototype.stopDiscovery = function (callback) {
  chrome.bluetooth.startDiscovery(callback);
};

ChromeBackend.prototype.connect = function (deviceAddress, options, callback) {
  chrome.bluetoothLowEnergy.connect(deviceAddress, options, callback);
};


// Export a singleton
var backend;
module.exports = function () {
  if (backend) {
    return backend;
  }

  return new ChromeBackend();
}
