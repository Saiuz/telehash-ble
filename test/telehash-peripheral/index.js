var telehash = require('telehash');
var telehashBle = require('../../telehash-ble-peripheral');

delete telehash.extensions.udp4
delete telehash.extensions.http
delete telehash.extensions.tcp4
delete telehash.extensions.webrtc

telehash.add(telehashBle);

telehash.generate(function (err, endpoint) {
  if (err) {
    throw err;
  }

  telehash.mesh({ id: endpoint }, function (err, mesh) {
    if (err) {
      throw err;
    }

    console.log(mesh.json());
    mesh.accept = function (from) {
      console.log('Accepting telehash mesh');
      console.log(from);
      return mesh.link(from);
    }

    mesh.beacon();
  });
});
