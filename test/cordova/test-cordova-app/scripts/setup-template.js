#!/usr/bin/env node

var ejs = require('ejs');
var os = require('os');
var fs = require('fs');

function getIpAddresses() {
  var ifaces = os.networkInterfaces();
  var ips = [];

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      ips.push(iface.address);

      //if (alias >= 1) {
      //  // this single interface has multiple ipv4 addresses
      //  ips.push(iface.address);
      //  console.log(ifname + ':' + alias, iface.address);
      //} else {
      //  // this interface has only one ipv4 adress
      //  console.log(ifname, iface.address);
      //}
    });
  });

  return ips;
}

var ips = getIpAddresses();

var template = fs.readFileSync(__dirname + '/../index-beefy.html.ejs').toString();
var output = ejs.render(template, { ip: ips[0] });
fs.writeFileSync(__dirname + '/../www/index-beefy.html', output);
console.log('Wrote template index-beefy.html.ejs with ip ' + ips[0] + ' to www/index-beefy.html');
