//
var bleno = require('bleno');
var lob = require('lob-enc');

exports.name = 'ble';
exports.uuid = '42424242424242424242424242424242';

var StreamService = require('./lib/stream-service');
var streamService = new StreamService();

bleno.on('advertisingStart', function (err) {
  console.log('advertisingStart: ' + (err ? 'error ' + err : 'success'));

  if (!err) {
    bleno.setServices([streamService]);
  }
});

var currentCentralAddress;

bleno.on('accept', function (address) {
  currentCentralAddress = address;
  console.log('Accepting connection from ' + address);
});

bleno.on('disconnect', function (address) {
  currentCentralAddress = null;
  console.log('Disconnection from ' + address);
});


exports.keepalive = 5 * 1000;
exports.mesh = function (mesh, done) {
  var args = mesh.args||{};
  var telehash = mesh.lib;

  var tp = {
    pipes: {}
  };

  tp.paths = function () {
    return [
      { type: 'ble' }
    ];
  };

  streamService.on('telehash:packet', function (msg) {
    tp.pipe(false, { type: 'ble', address: currentCentralAddress }, function (pipe) {
      console.log('Receive');
      console.log('Packet', msg.toString('hex'));
      var packet = lob.decode(msg);
      console.log('Packet', packet.toString('hex'));
      console.log(packet.json);
      mesh.receive(packet, pipe);
    });
  });

  tp.pipe = function (link, path, done) {
    console.log('Creating pipe');
    if (typeof path !== 'object' || path.type !== 'ble') {
      console.log('Exit early');
      return false;
    }

    var id = path.address;
    if (tp.pipes[id]) {
      return done(tp.pipes[id]);
    }

    var pipe = new telehash.Pipe('ble', exports.keepalive);
    pipe.id = id;
    pipe.path = path;
    tp.pipes[id] = pipe;

    pipe.onSend = function (packet, link, done) {
      console.log('SEND');
      streamService.send(packet, done);
    }

    console.log(link, path);
    done(pipe);
  };

  mesh.beacon = function (args) {
    if (arguments.length === 1 && !args) {
      bleno.stopAdvertising();
    } else {
      bleno.on('stateChange', function (state) {
        if (state === 'poweredOn') {
          bleno.startAdvertising('telehash', [streamService.uuid]);
          //var data = { value: Array(1000).join('A') };
          //console.log('Sending ' + JSON.stringify(data).length + 'bytes');
          //streamService.send(data);
        }
      });
    }
  };

  done(null, tp);
};
