var assert = require('assert');
var lob = require('lob-enc');
var CHUNK_SIZE = 5;

function writeCharacteristic(backend, uuid, val, done) {
  var chunked = lob.chunking({ size: CHUNK_SIZE }, function (err, packet) { });

  chunked.send(lob.encode({ value: val }));

  var queueSend = function queueSend () {
    var val = chunked.read(CHUNK_SIZE) || chunked.read();
    if (!val) {
      return done();
    } else {
      backend.writeCharacteristicValue(uuid, val, function (err) {
        if (err) {
          return done(err);
        }
        setTimeout(queueSend, 100);
      });
    }
  };

  queueSend();
}

function consumeCharacteristic(backend, uuid, done) {
  var result;

  var isDone = false;
  var chunked = lob.chunking({ size: CHUNK_SIZE }, function (err, packet) {
    isDone = true;
    if (err) {
      done(err);
    } else {
      console.log(packet.json);
      done(null, packet.json);
    }
  });

  var readAndConcat = function (done) {
    backend.readCharacteristicValue(uuid, function (err, value) {
      if (err) {
        return done(err);
      }

      chunked.write(new Buffer(value));

      if (!isDone) {
        readAndConcat(done);
      }
    });
  }

  readAndConcat(done);
}

module.exports = function (Backend) {
  var backend = new Backend();

  describe('Stream', function () {
    this.timeout(20000);

    afterEach(function (done) {
      backend.stopDiscovery(done);
    });


    it('reads a lob-enc stream from dummy-peripheral', function (done) {

      backend.once('deviceAdded', function (device) {
        console.log('Connecting');

        backend.connect(device.address, {}, function (err) {
          assert.ifError(err);
          console.log('Connected');

          console.log('Services for ' + device.address);
          backend.getServices(device.address, function (err, services) {
            assert.ifError(err);

            console.log(services);
            var streamService = services.filter(function (s) {
              return parseInt(s.uuid.split('-'), 16) === 0x1666;
            })[0];

            assert(streamService, 'Expected service with id 0x1666');

            backend.getCharacteristics(streamService.instanceId, function (err, characteristics) {
              assert.ifError(err);

              var testCharacteristic = characteristics.filter(function (c) {
                return parseInt(c.uuid.split('-'), 16) === 0x2666;
              })[0];

              assert(testCharacteristic, 'Expected characteristic with id 0x266');

              console.log('Consume characteristic');
              consumeCharacteristic(backend, testCharacteristic.instanceId, function (err, packet) {
                assert.ifError(err);

                console.log(packet);
                assert.equal('abcdefghijklmnopqrstuvwxyz', packet.value);

                writeCharacteristic(backend, testCharacteristic.instanceId, 'HELLO AGAIN', function (err) {
                  assert.ifError(err);
                  done();
                });
              });

            });

          });
        });
      });

      backend.startDiscovery(function (err) {
        assert.ifError(err);
      });
    });
  });
};
