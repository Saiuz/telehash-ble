// This is an initial attempt at a telehash extension to
// stream data over a ble transport
//
// The counterpart for running on a peripheal is found in
// ./telehash-ble-peripheral.js (note that's only been implemented for node)
//
// Needs to be passed an instantiated backend
// e.g.:
//
//     var NobleBackend = require('./backends/noble');
//     var telehash = require('telehash');
//     var telehashBle = require('.');
//
//     var backend = new NobleBackend();
//     telehash.add(telehashBle(backend));
//
//     //...

var CHUNK_SIZE = 20;
var TELEHASH_UUID = '42424242424242424242424242424242';
var lob = require('lob-enc');

// must
module.exports = function (backend) {
  var ext = {};

  ext.name = 'ble-central';

  // not sure what this does, came from jer's suggestion
  ext.keepalive = 5 * 1000;

  //
  ext.mesh = function (mesh, done) {
    var tp = {
      pipes: {}
    };
    var telehash = mesh.lib;

    tp.paths = function () {
      return [
        { type: 'ble' }
      ];
    };

    tp.pipe = function (link, path, done) {
      if (typeof path !== 'object' || path.type !== 'ble') {
        return false;
      }

      if (link.blePipe) {
        return link.blePipe;
      }

      console.log('Creating pipe');
      console.log(link, path);
      var id = path.address;
      if (tp.pipes[id]) {
        return done(tp.pipes[id]);
      } else {
        console.log('No pipe with id ' + id + 'so creating');
        console.log(tp.pipes);
      }

      var pipe = new telehash.Pipe('ble', ext.keepalive);
      link.blePipe = pipe;
      pipe.id = id;
      pipe.path = path;

      tp.pipes[id] = pipe;

      var chunk = lob.chunking({ size: CHUNK_SIZE }, function (err, msg) {
        if (err) {
          return console.log('Error on receive ' + err);
        }
        var packet = lob.decode(msg);
        console.log('Receive');
        console.log(packet);
        console.log(packet.json);
        console.log(packet.body);
        mesh.receive(packet, pipe);
      });

      var characteristicId = null;
      var send = function (data, done) {
        var queueSend = function queueSend() {
          var val = chunk.read(CHUNK_SIZE) || chunk.read();
          if (!val) {
            done();
          } else {
            console.log('Write value');
            backend.writeCharacteristicValue(characteristicId, val, function (err) {
              if (err) {
                console.log('Write error ' + err);

                return onComplete(err);
              }
              setTimeout(queueSend, 10);
            });
          }
        };

        chunk.send(lob.encode(data));
        queueSend();
      };

      var readPipe = function () {
        backend.readCharacteristicValue(characteristicId, function (err, value) {
          if (err) {
            console.log('Error reading pipe ' + err);
          }

          if (!err && value) {
            chunk.write(new Buffer(value));
          }

          setTimeout(readPipe, 20);
        });
      };

      pipe.onSend = function (packet, link, done) {
        console.log('Send packet');
        send(packet, done);
      };

      console.log('Finding characteristics');
      backend.getCharacteristics(path.service, function (err, characteristics) {
        if (err) {
          console.log('Error finding characteristic');
          return done(null);
        }

        console.log(characteristics);

        var testCharacteristic = characteristics.filter(function (c) {
          return parseInt(c.uuid.split('-'), 16) === 0x2666;
        })[0];

        if (!testCharacteristic) {
          console.log('Error finding characteristic');
          return done(null);
        }

        characteristicId = testCharacteristic.instanceId;
        console.log('Returning pipe', pipe);
        setTimeout(readPipe, 500);
        return done(pipe);
      });
    }

    backend.on('deviceAdded', function (device) {
      backend.connect(device.address, {}, function (err) {
        if (err) {
          return console.log('Could not connect to ' + device.address + ' ' + err);
        }

        backend.getServices(device.address, function (err, services) {
          if (err) {
            return console.log('Error getting services from ' + device.address + ' ' + err);
          }

          var telehashService = services.filter(function (s) {
            console.log('UUIDs ' + s.uuid + ' ' + TELEHASH_UUID);
            return s.uuid.replace(/-/g, '') === TELEHASH_UUID;
          })[0];

          console.log('telehashService:');
          console.log(telehashService);

          if (!telehashService) {
            console.log('Not telehash, closing');
            backend.close(device.address);
          } else {
            console.log('Creating link to ' + device.address);
            var link = require('./peripheral.json');

            link.paths[0].address = device.address;
            link.paths[0].service = telehashService.instanceId;

            mesh.link(link, function (err, link) {
              if (err) {
                return console.log('Err linking to ' + device.address + ' ' + err);
              }
              console.log('Linked to ' + device.address + '!');
              console.log(link);
              console.log('And, end');
              console.log('Pinging link');

              link.ping(function (err, ping) {
                if (err) {
                  console.log('Error pinging', err);
                } else {
                  console.log('LATENCY: ' + ping);
                }
              });
            });

          }
        });
      });
    });

    mesh.scan = function (args) {
      if (arguments.length === 1 && !args) {
        backend.stopDiscovery(function () {
          console.log('stopDiscovery');
        });
      } else {
        backend.startDiscovery(function (err) {
          if (err) {
            throw err;
          }
        });
      }
    }

    return done(null, tp);
  };

  return ext;
};
