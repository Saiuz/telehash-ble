var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Backend() {
  EventEmitter.call(this);
}

util.inherits(Backend, EventEmitter);

module.exports = Backend;

/** Scan for remote devices.
 * @param {function} callback - callback(err)
 */
Backend.prototype.startDiscovery = function (callback) {
  throw new Error('Not implemented: backend.startDiscovery');
}


/** Stop scanning for remote devices.
 * @param {function} callback - callback(err)
 */
Backend.prototype.stopDiscovery = function (callback) {
  throw new Error('Not implemented: backend.startDiscovery');
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
  throw new Error('Not implemented: backend.connect');
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
