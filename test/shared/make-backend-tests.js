var assert = require('assert');

module.exports = function (backend) {
  describe('Backend', function () {
    this.timeout(10000);

    beforeEach(function (done) {
      backend.stopDiscovery(done);
    });

    afterEach(function (done) {
      backend.stopDiscovery(done);
    });

    after(function (done) {
      backend.reset(done);
    });

    it('starts and stops discovery', function (done) {
      console.log('Starting');
      backend.startDiscovery(function (err) {
        assert.ifError(err);

        console.log('Stopping');
        backend.stopDiscovery(function (err) {
          assert.ifError(err);

          console.log('done');
          done();
        });
      });
    });

    it('discovers a device', function (done) {
      backend.startDiscovery(function (err) {
        assert.ifError(err);
      });

      backend.once('deviceAdded', function (device) {
        assert(device.address);
        done();
      });
    });

    describe('While connected', function () {
      var connectedDevice = null;

      it('connects to the device', function (done) {
        this.timeout(30000);

        backend.startDiscovery(function (err) {
          assert.ifError(err);
        });

        backend.once('deviceAdded', function (device) {
          assert(device.address);

          connectedDevice = device.address;

          console.log('Connecting to', device.address);
          backend.connect(device.address, {}, function (err) {
            assert.ifError(err);
            done();
          });
        });
      });

      it('discovers and reads a service characteristic value', function (done) {
        backend.getServices(connectedDevice, function (err, services) {
          assert.ifError(err);

          var testService = services.filter(function (s) {
            return parseInt(s.uuid.split('-'), 16) === 0x1666;
          })[0];

          assert(testService, 'Expected service with id 0x1666');

          backend.getCharacteristics(testService.instanceId, function (err, characteristics) {
            assert.ifError(err);

            var testCharacteristic = characteristics.filter(function (c) {
              return parseInt(c.uuid.split('-'), 16) === 0x2666;
            })[0];

            assert(testCharacteristic, 'Expected characteristic with id 0x266');

            backend.readCharacteristicValue(testCharacteristic.instanceId, function (err, buffer) {
              assert.ifError(err);

              assert.equal(12, new Int8Array(buffer)[0]);

              done();
            });
          });
        });
      });

      it('reads and writes a service characteristic value', function (done) {
        backend.getServices(connectedDevice, function (err, services) {
          assert.ifError(err);

          var testService = services.filter(function (s) {
            return parseInt(s.uuid.split('-'), 16) === 0x1666;
          })[0];

          assert(testService, 'Expected service with id 0x1666');

          backend.getCharacteristics(testService.instanceId, function (err, characteristics) {
            assert.ifError(err);

            var testCharacteristic = characteristics.filter(function (c) {
              return parseInt(c.uuid.split('-'), 16) === 0x2777;
            })[0];

            var testValue = Math.floor(Math.random() * 100);
            var testBuffer;

            if (typeof Buffer === 'undefined') {
              testBuffer = new ArrayBuffer([ testValue ]);
            } else {
              testBuffer = new Buffer([ testValue ]);
            }

            console.log('Writing value ' + testValue + '/' + new Int8Array(testBuffer)[0]);
            backend.writeCharacteristicValue(testCharacteristic.instanceId, testBuffer, function (err) {
              assert.ifError(err);

              backend.readCharacteristicValue(testCharacteristic.instanceId, function (err, resultBuffer) {
                assert.ifError(err);

                assert.equal(testValue, new Int8Array(resultBuffer)[0]);

                done();
              });
            });
          });
        });
      });
    });
  });
};
