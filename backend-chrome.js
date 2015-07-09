var Backend = require('./backend');
var util = require('util');

function ChromeBackend() {
  Backend.call(this);

  var self = this;

  chrome.bluetooth.onDeviceAdded.addListener(function (device) {
    self.emit('deviceAdded', device);
  });
}

util.inherits(ChromeBackend, Backend);

ChromeBackend.prototype.startDiscovery = function (callback) {
  chrome.bluetooth.startDiscovery(callback);
};

ChromeBackend.prototype.stopDiscovery = function (callback) {
  chrome.bluetooth.startDiscovery(callback);
};

ChromeBackend.prototype.connect = function (deviceAddress, options, callback) {
  chrome.bluetoothLowEnergy.connect(deviceAddress, options, callback);
};


module.exports = new ChromeBackend();
