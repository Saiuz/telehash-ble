var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Backend() {
  EventEmitter.call(this);
}

util.inherits(Backend, EventEmitter);

module.exports = Backend;

Backend.prototype.type = 'BaseBackend'

/** Scan for remote devices.
 * @param {function} callback - callback(err)
 */
Backend.prototype.startDiscovery = function (callback) {
  this._notImplemented('startDiscovery');
}


/** Stop scanning for remote devices.
 * @param {function} callback - callback(err)
 */
Backend.prototype.stopDiscovery = function (callback) {
  this._notImplemented('stopDiscovery');
}


/** Connect to a remote device.
 * @param {string} address - 
 * @param {Object} options - connection options
 * @param {boolean} options.persistent - disconnect on app close?
 * @param {function} callback - callback(err)
 * @example
   backend.connect(
     address,
     { persistent: false },
     function (err) {
      if (err) {
        console.log('Error connecting to ble device: ' + err);
      }
     }
   );
 */
Backend.prototype.connect = function (deviceAddress, options, callback) {
  this._notImplemented('connect');
}


Backend.prototype.getService = function (serviceId, callback) {
  this._notImplemented('getService');
}

Backend.prototype.getServices = function (deviceAddress, callback) {
  this._notImplemented('getServices');
}

Backend.prototype.getCharacteristic = function (characteristicId, callback) {
  this._notImplemented('getCharacteristic');
}

Backend.prototype.getCharacteristics = function (serviceId, callback) {
  this._notImplemented('getCharacteristics');
}

Backend.prototype.getIncludedServices = function (serviceId, callback) {
  this._notImplemented('getIncludedServices');
}

Backend.prototype.getDescriptor = function (descriptorId, callback) {
  this._notImplemented('getDescriptor');
}

Backend.prototype.getDescriptors = function (characteristicId, callback) {
  this._notImplemented('getDescriptors');
}

Backend.prototype.readCharacteristicValue = function (characteristicId, callback) {
  this._notImplemented('readCharacteristicValue');
}

Backend.prototype.writeCharacteristicValue = function (characteristicId, value, callback) {
  this._notImplemented('writeCharacteristicValue');
}

Backend.prototype.readDescriptorValue = function (characteristicId, callback) {
  this._notImplemented('readDescriptorValue');
}

Backend.prototype.writeDescriptorValue = function (characteristicId, value, callback) {
  this._notImplemented('writeDescriptorValue');
}

Backend.prototype.startCharacteristicNotifications = function (characteristicId, properties, callback) {
  this._notImplemented('startCharacteristicNotifications');
}

Backend.prototype.stopCharacteristicNotifications = function (characteristicId, callback) {
  this._notImplemented('stopCharacteristicNotifications');
}

Backend.prototype.reset = function (callback) {
  this._notImplemented('reset');
}

Backend.prototype._notImplemented = function (fnName) {
  var args;

  try {
    args = this[fnName].toString().match(/function\s*(\([^\)]*\))/)[1];
  } catch (e) {
    args = '(...)';
  }

  throw new Error('Not implemented: ' + this.type + '.' + fnName + args);
}

//connect − chrome.bluetoothLowEnergy.connect(string deviceAddress, object properties, function callback)
//disconnect − chrome.bluetoothLowEnergy.disconnect(string deviceAddress, function callback)
//getService − chrome.bluetoothLowEnergy.getService(string serviceId, function callback)
//getServices − chrome.bluetoothLowEnergy.getServices(string deviceAddress, function callback)
//getCharacteristic − chrome.bluetoothLowEnergy.getCharacteristic(string characteristicId, function callback)
//getCharacteristics − chrome.bluetoothLowEnergy.getCharacteristics(string serviceId, function callback)
//getIncludedServices − chrome.bluetoothLowEnergy.getIncludedServices(string serviceId, function callback)
//getDescriptor − chrome.bluetoothLowEnergy.getDescriptor(string descriptorId, function callback)
//getDescriptors − chrome.bluetoothLowEnergy.getDescriptors(string characteristicId, function callback)
//readCharacteristicValue − chrome.bluetoothLowEnergy.readCharacteristicValue(string characteristicId, function callback)
//writeCharacteristicValue − chrome.bluetoothLowEnergy.writeCharacteristicValue(string characteristicId, ArrayBuffer value, function callback)
//startCharacteristicNotifications − chrome.bluetoothLowEnergy.startCharacteristicNotifications(string characteristicId, object properties, function callback)
//stopCharacteristicNotifications − chrome.bluetoothLowEnergy.stopCharacteristicNotifications(string characteristicId, function callback)
//readDescriptorValue − chrome.bluetoothLowEnergy.readDescriptorValue(string descriptorId, function callback)
//writeDescriptorValue − chrome.bluetoothLowEnergy.writeDescriptorValue(string descriptorId, ArrayBuffer value, function callback)
//Events
//onServiceAdded
//onServiceChanged
//onServiceRemoved
//onCharacteristicValueChanged
//onDescriptorValueChanged
