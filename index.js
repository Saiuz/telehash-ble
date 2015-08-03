var net = require('net');
var os = require('os');
var lob = require('lob-enc');
var ble = require('./backend');

exports.name = 'ble';
exports.uuid = '42424242424242424242424242424242';

// add our transport to this new mesh
exports.mesh = function(mesh, cbExt)
{
  var args = mesh.args||{};
  var telehash = mesh.lib;

  var tp = {uuids:{}};

  mesh.scan = function(args, cbDone)
  {
    if(!cbDone) cbDone = function(){};
    if(!args) args = {uuid:exports.uuid,name:'telehash'};

    if(args === false)
    {
      // TODO disable scan mode
      return;
    }
    
  }

  mesh.beacon = function(args, cbDone)
  {
    if(!cbDone) cbDone = function(){};
    if(!args) args = {uuid:exports.uuid,name:'telehash'};

    if(args === false)
    {
      // TODO disable beacon mode
      return;
    }
    
  }

  // turn a path into a pipe
  tp.pipe = function(link, path, cbPipe){
    if(typeof path != 'object' || path.type != 'ble') return false;
    var uuid = path.uuid || args.uuid;
    // TODO, add to per-link index of uuids+keys?
    cbPipe();
  };
  
  function connect()
  {
    var pipe = new telehash.Pipe('ble',exports.keepalive);
    // TODO
    pipe.id = id;
    pipe.path = path;
    pipe.chunks = lob.chunking({}, function receive(err, packet){
      if(packet) mesh.receive(packet, pipe);
    });
    pipe.onSend = function(packet, link, cb){
      pipe.chunks.send(packet);
      cb();
    }
    cbPipe(pipe);
  };

  // return our current addressible paths
  tp.paths = function(){
    return [{type:'ble'}];
  };

  cbExt(undefined, tp);

}

