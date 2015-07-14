var Backend = require('./backend');
var noble = require('noble');
var util = require('util');

function makeId(/* ...parts */) {
  return Array.prototype.join.call(arguments, '/');
}

function NobleBackend() {
  Backend.call(this);
  this._devicesByAddress = {};
  this._servicesById = {};
  this._characteristicsById = {};

  var self = this;

  this.on('serviceAdded', function (service) {
    this._servicesById[service.instanceId] = service;
  });

  this.on('characteristicAdded', function (characteristic) {
    this._characteristicsById[characteristic.instanceId] = characteristic;
  });

  noble.on('discover', function (_device) {
    var device = {
      address: _device.address,
      _raw: _device,
    };

    this._devicesByAddress[device.address] = device;

    //TODO: remap device
    this.emit('deviceAdded', device);

  }.bind(this));

}

util.inherits(NobleBackend, Backend);

NobleBackend.prototype.type = 'NobleBackend';

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

NobleBackend.prototype.stopDiscovery = function (callback) {
  noble.stopScanning();
  process.nextTick(callback);
};

NobleBackend.prototype.connect = function (deviceAddress, options, callback) {
  var device = this._devicesByAddress[deviceAddress];
  device._raw.connect(callback);
};

NobleBackend.prototype.getServices = function (deviceAddress, callback) {
  var device = this._devicesByAddress[deviceAddress];
  var self = this;

  device._raw.discoverServices(null, function (err, _services) {
    if (err) {
      return callback(err);
    }

    var services = _services.map(function (raw) {
      return {
        uuid: raw.uuid,
        instanceId: makeId(raw._peripheralUuid, raw.uuid),
        isPrimary: null,
        deviceAddress: deviceAddress,
        _raw: raw
      };
    });

    services.forEach(function (service) {
      self.emit('serviceAdded', service);
    });

    callback(null, services);
  });
};

NobleBackend.prototype.getCharacteristics = function (serviceId, callback) {
  var self = this;
  var service = this._servicesById[serviceId];

  if (!service) {
    callback(new Error('Unknown service with id: ' + serviceId));
  }

  service._raw.discoverCharacteristics(null, function (err, _characteristics) {
    if (err) {
      return callback(err);
    }

    var characteristics = _characteristics.map(function (raw) {
      return {
        uuid: raw.uuid,
        instanceId: makeId(service.deviceAddress, service.uuid, raw.uuid),
        service: service,
        _raw: raw
      };
    });

    characteristics.forEach(function (char) {
      self.emit('characteristicAdded', char);
    });

    callback(null, characteristics);
  });
};

NobleBackend.prototype.readCharacteristicValue = function (characteristicId, callback) {
  var characteristic = this._characteristicsById[characteristicId];

  if (!characteristic) {
    return callback(new Error('Unknown characteristic with id: ' + characteristicId));
  }

  characteristic._raw.read(callback);
};

NobleBackend.prototype.reset = function (callback) {
  var self = this;

  // find all connected devices
  var connected = Object.keys(this._devicesByAddress)
                        .map(function getDevice(address) {
                          return self._devicesByAddress[address];
                        })
                        .filter(function connectedDevices(device) {
                          return (
                            device._raw.state === 'connected' ||
                            device._raw.state === 'connecting'
                          );
                        });

  var i = -1;

  // Serially disconnect from all connected/connecting devices
  // TODO: handle disconnect errors?
  var disconnectNext = function () {
    i++;

    if (i < connected.length) {
      connected[i]._raw.disconnect(disconnectNext);
    } else {
      callback();
    }
  };

  disconnectNext();
};

module.exports = new NobleBackend();
