var Backend = require('./backend');
var util = require('util');

/*
 * service:
 *
 * {
 *   uuid:          '<string> - uuid from device',
 *   instanceId:    '<string> - id to use elsewhere',
 *   isPrimary:     '<bool>   - primary or secondary service',
 *   deviceAddress: '<string> - address of peripheral',
 *   _raw:          '<object> - the raw object from evothings',
 * }
 */

function EvothingsBackend() {
  this.ble = window.evothings && window.evothings.ble;

  if (!this.ble) {
    throw new Error('The telehash-ble evothings backend requires window.evothings to exist');
  }

  Backend.call(this);

  this._devicesByAddress = {};
  this._connectStatuses = {};
  this._servicesById = {};
  this._characteristicsById = {};

  this.on('deviceAdded', function (device) {
    this._devicesByAddress[device.address] = device;
  });

  this.on('serviceAdded', function (service) {
    this._servicesById[service.instanceId] = service;
  });

  this.on('characteristicAdded', function (characteristic) {
    this._characteristicsById[characteristic.instanceId] = characteristic;
  });
}

util.inherits(EvothingsBackend, Backend);

EvothingsBackend.prototype.type = 'EvothingsBackend'

EvothingsBackend.prototype.startDiscovery = function (callback) {
  var self = this;
  var hasCalledCallback = false;
  var onSuccess = function () {
    if (!hasCalledCallback) {
      hasCalledCallback = true;
      callback();
    }
  };

  this.ble.startScan(
    function (_device) {
      if (!hasCalledCallback) {
        hasCalledCallback = true;
        onSuccess();
      }

      var device = {
        address: _device.address,
        _raw: _device,
      };

      var emit = false;
      if (!self._devicesByAddress[device.address]) {
        emit = true;
      }

      self._devicesByAddress[device.address] = device;

      if (emit) {
        self.emit('deviceAdded', device);
      }
    },
    function (errorCode) {
      hasCalledCallback = true;
      callback(new Error('Evothings error: ' + errorCode));
    }
  );

  setTimeout(onSuccess, 100);
};

EvothingsBackend.prototype.stopDiscovery = function (callback) {
  this.ble.stopScan();
  process.nextTick(callback);
};

EvothingsBackend.prototype.connect = function (deviceAddress, options, callback) {
  var self = this;

  this.ble.connect(deviceAddress,
    function (info) {
      console.log(info);
      switch (self.ble.connectionState[info.state]) {
        case 'STATE_DISCONNECTED':
          delete self._connectStatuses[deviceAddress]
          break;
        case 'STATE_CONNECTING':
          self._connectStatuses[deviceAddress] = info;
          break;
        case 'STATE_CONNECTED':
          self._connectStatuses[deviceAddress] = info;
          return callback(null, info);
          break;
        case 'STATE_DISCONNECTING':
          self._connectStatuses[deviceAddress] = info;
          break;
      }
    },
    function (err) {
      callback(new Error('Evothings error code: ' + err));
    }
  );
};

EvothingsBackend.prototype.disconnect = function (deviceAddress, callback) {
  var self = this;

  this._getDeviceHandle(service.deviceAddress, function (err, deviceHandle) {
    if (err) {
      return callback(err);
    }
    
    self.ble.close(deviceHandle);
    callback();
  });
};

EvothingsBackend.prototype.getServices = function (deviceAddress, callback) {
  var self = this;
  var connectStatus = this._connectStatuses[deviceAddress];
  var deviceHandle = connectStatus && connectStatus.deviceHandle;

  if (!connectStatus || connectStatus.state !== 2 || !deviceHandle) {
    return callback(new Error('Must be connected to call getServices, call .connect(address, options, cb) first'));
  }

  this.ble.services(deviceHandle,
    function (_services) {
      var services = _services.map(function (raw) {
        return {
          uuid: raw.uuid,
          instanceId: raw.handle,
          isPrimary: self.ble.serviceType[raw.serviceType] === 'SERVICE_TYPE_PRIMARY',
          deviceAddress: deviceAddress,
          _raw: raw
        };
      });

      services.forEach(function (service) {
        self.emit('serviceAdded', service)
      });

      callback(null, services);
    },
    function (err) {
      callback(new Error('Evothings error code: ' + err));
    }
  );
};

EvothingsBackend.prototype.reset = function (callback) {
  this.ble.reset(
    function () { callback(); },
    function (err) {
      callback(new Error('Evothings error code: ' + err));
    }
  );
};

EvothingsBackend.prototype.getCharacteristics = function (serviceId, callback) {
  var self = this;
  var service = this._servicesById[serviceId];

  if (!service) {
    throw new Error('Unknown service with serviceId: ' + serviceId);
  }

  this._getDeviceHandle(service.deviceAddress, function (err, deviceHandle) {
    if (err) {
      return callback(err);
    }

    console.log('Get characteristics for ', deviceHandle, serviceId);

    self.ble.characteristics(
      deviceHandle,
      service.instanceId,
      function (_characteristics) {
        var characteristics = _characteristics.map(function (raw) {
          return {
            uuid: raw.uuid,
            instanceId: raw.handle,
            service: service,
            _raw: raw
          };
        });

        characteristics.forEach(function (char) {
          self.emit('characteristicAdded', char);
        });

        console.log('Got', characteristics);
        callback(null, characteristics);
      },
      function (err) {
        console.log('Char error');
        callback(new Error('Evothings error code: ' + err));
      }
    );
  });
};

EvothingsBackend.prototype.readCharacteristicValue = function (characteristicId, callback) {
  var self = this;
  var characteristic = this._characteristicsById[characteristicId];

  if (!characteristic) {
    throw new Error('Unknown characteristic with characteristicId: ' + characteristicId);
  }

  this._getDeviceHandle(characteristic.service.deviceAddress, function (err, deviceHandle) {
    if (err) {
      return callback(err);
    }

    self.ble.readCharacteristic(
      deviceHandle,
      characteristic.instanceId,
      function (value) {
        callback(null, value);
      },
      function (err) {
        callback(new Error('Evothings error code: ' + err));
      }
    );
  });
};

EvothingsBackend.prototype.writeCharacteristicValue = function (characteristicId, data, callback) {
  var self = this;
  var characteristic = this._characteristicsById[characteristicId];

  if (!characteristic) {
    throw new Error('Unknown characteristic with characteristicId: ' + characteristicId);
  }

  this._getDeviceHandle(characteristic.service.deviceAddress, function (err, deviceHandle) {
    if (err) {
      return callback(err);
    }

    self.ble.writeCharacteristic(
      deviceHandle,
      characteristic.instanceId,
      data,
      function () {
        callback();
      },
      function (err) {
        callback(new Error('Evothings error code: ' + err));
      }
    );
  });
};

EvothingsBackend.prototype._getDeviceHandle = function (deviceAddress, callback) {
  var device = this._devicesByAddress[deviceAddress];
  var connectStats = this._connectStatuses[deviceAddress];

  if (!device) {
    return callback(new Error('Unknown device: ' + deviceAddress));
  }

  if (!connectStats || connectStats.state !== 2 || !connectStats.deviceHandle) {
    return callback(new Error('Not connected to device: ' + deviceAddress));
  }

  return callback(null, connectStats.deviceHandle);
};

// Export a singleton
var backend;
module.exports = function () {
  if (backend) {
    return backend;
  }

  return new EvothingsBackend();
}
