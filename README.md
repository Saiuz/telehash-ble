# telehash-ble

BLE transport for telehash

## Backends

Backends should be implemented to conform to the interface defined in ./backend.js, which is roughly based on the chrome app bluetooth/bluetoothLowEnergy apis.

Some will require peer dependencies to be installed (e.g. noble).

## BLE Transport

* beacons advertise application-specific names and service uuids
  * special characteristics are used for all packet transfers
* all characteristics are cloaked, dynamic values
  * the UUID is an 8-byte nonce (TBD, spec restrictions) and an 8-byte ciphertext to make the 128-bits
  * the ciphertext is generated using ChaCha20 with a commonly known hashname used as key
  * once deciphered, the 8 bytes are the prefix of the beaconing hashname
  * the key is either the sender, recipient, or a common router for the mesh (application-specific)
* generic packet read/write descriptor of 2901 for chunk-encoded encrypted packets
* when discovery mode is enabled, same as cloaked but fixed values
  * 8-byte nonce is all nulls (TBD)
  * key is sha-256 of "telehash"
  * upon connection, beaconing hashname sends un-encrypted packet w/ link json
  * valid handshakes follow


## Tests

Read [./test/README.md](./test/README.md) for instructions on setting up tests on node/cordova.
