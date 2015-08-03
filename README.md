# telehash-ble

BLE transport for telehash

## Usage

By default the transport doesn't activate as BLE is typically controlled through explicit actions.

Calling `mesh.scan({args})` will start scanning for other endpoints in the mesh that are beaconing and will automatically link with them over BLE if any are discovered.

In order to beacon, the `mesh.beacon({args})` must be called.  Not all hardware can support doing both at the same time.

The args may be `false` to disable or `{uuid:'...',name:'...'}` to set the custom uuid/name advertised/detected.

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
