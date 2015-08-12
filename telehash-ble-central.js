var uuid = '42424242424242424242424242424242';
var CHUNK_SIZE = 5;
var lob = require('lob-enc');

module.exports = function (backend) {
  var ext = {};

  ext.name = 'ble-central';
  ext.keepalive = 5 * 1000;

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

      console.log('Creating pipe');
      var id = path.address;
      if (tp.pipes[id]) {
        return done(tp.pipes[id]);
      }

      var pipe = new telehash.Pipe('ble', ext.keepalive);
      pipe.id = id;
      pipe.path = path;

      tp.pipes[id] = pipe;

      var chunk = lob.chunking({ size: CHUNK_SIZE }, function (err, packet) {
        if (err) {
          return console.log('Error on receive ' + err);
        }
        mesh.receive(packet, pipe);
      });

      var blocked = false;
      var characteristicId = null;
      var send = function (data, done) {
        if (blocked) {
          console.log('Error: blocked');
          return done(new Error('Sending blocked'));
        }

        blocked = true;

        var onComplete = function () {
          blocked = false;
          done.call(null, arguments);
        };

        var queueSend = function queueSend() {
          var val = chunk.read(CHUNK_SIZE) || chunk.read();
          if (!val) {
            onComplete();
          } else {
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

      pipe.onSend = function (packet, link, done) {
        console.log('Send packet');
        send(packet, done);
      };

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
            return s.uuid = uuid;
          })[0];

          console.log(telehashService);

          if (!telehashService) {
            console.log('Not telehash, closing');
            backend.close(device.address);
          } else {
            console.log('Creating link to ' + device.address);
            mesh.link({
              paths: [
                {type: 'ble', address: device.address, service: telehashService.instanceId }
              ],
              keys: { '1a': 'ajwscb2bfdyghu5cn4yojc3jy2u43rgoyq', '2a': 'gcbacirqbudaskugjcdpodibaeaqkaadqiaq6abqqiaquaucaeaqbrl5xh5gfzijlrfh4pa23ym76xh6yb2aqkjcwofgxyyrv3zhnymwxl3ihpsjjdwqp2w42afddjdxv4z464kb6d5thg5m3qanoy4cekk42byjmu6256mmb5hol6eawx5dz6murfjgxrm6n7hrvpeadjjii2gqv4uixnyswfu2lrwzwflbcl7scz563njoj24bxquxu5fun6hbedgie7scdcsxiteelz2xmdr7sah774zb6tslzu3lfj6luyfnham7cvbjh5iij5pegi2hrpq65cp5kdwnw3nyk424g2cuhcbni26yo6zgokpexdmeagxwdgfzofd6kvqgicngknec4gpw4vvzyq62iz7ueco76uogtqml72hw5sxgnt4orfz2wdtg6xchi6n7rms7t5ouxptjhhicamaqaai', '3a': 'g32lt64o5syou2bacxgajzwdzfnpp7vhf2op5tsbk6ywo57pzeaq' },
            }, function (err, link) {
              if (err) {
                return console.log('Err linking to ' + device.address + ' ' + err);
              }
              console.log('Linked to ' + device.address + '!');
              console.log(link);
            });

          }
        });
      });
    });

    mesh.scan = function (args) {
      if (arguments.length === 1 && !args) {
        backend.stopDiscovery(console.log.bind(console, 'stopDiscovery'));
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
