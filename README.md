# telehash-ble
BLE transport for telehash

## Backends

Backends should be implemented to conform to the interface defined in ./backend.js, which is roughly based on the chrome app bluetooth/bluetoothLowEnergy apis.

Some will require peer dependencies to be installed (e.g. noble).
