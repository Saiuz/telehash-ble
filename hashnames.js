var crypto = require('crypto');
var chacha = require('chacha20');
var hashname = require('hashname');

//Router hashname
var keys = {
  "3a":"hp6yglmmqwcbw5hno37uauh6fn6dx5oj7s5vtapaifrur2jv6zha",
  "1a":"vgjz3yjb6cevxjomdleilmzasbj6lcc7"
};

//known
var routerHashname = hashname.fromKeys(keys);
var beaconHashname = crypto.randomBytes(20).toString('hex');

function createHashnameUUID(hashname, sharedHashname) {
  var nonce = crypto.randomBytes(8);
  var key = new Buffer(sharedHashname);

  var hashnamePrefix = new Buffer(hashname).slice(0,8);
  var ciphertext = chacha.encrypt(key, nonce, hashnamePrefix);

  console.log({ key: key.toString('hex'), nonce: nonce.toString('hex'), ciphertext: ciphertext.toString('hex') });
  return nonce.toString('hex') + ciphertext.toString('hex');
}

console.log('Router hashname is', routerHashname);
console.log('Beaconing hashname is', beaconHashname);

var uuid = createHashnameUUID(beaconHashname, routerHashname);
console.log(uuid, uuid.length);

function decodeHashnameFromUUID(uuid, sharedHashname) {
  uuid = new Buffer(uuid, 'hex');

  var nonce = uuid.slice(0,8);
  var key = new Buffer(sharedHashname);

  var ciphertext = uuid.slice(8);

  console.log({ key: key.toString('hex'), nonce: nonce.toString('hex'), ciphertext: ciphertext.toString('hex') });
  return chacha.decrypt(key, nonce, ciphertext).toString('utf8');
}

var decodedBeaconHashname = decodeHashnameFromUUID(uuid, routerHashname);
console.log('Decoded router hashname', decodedBeaconHashname);
