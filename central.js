var Backend = require('./backend-noble');
var backend = new Backend();

backend.on('deviceAdded', function (d) {
  console.log('Found', d.address)
  backend.connect(d.address, {}, function () {
    console.log('connected', d.address)
    backend.getServices(d.address, function (err, services) {
      console.log(services)
    })
  });
});

backend.startDiscovery(function (err) {
  if (err) throw err;
  console.log('Discovery');
});

