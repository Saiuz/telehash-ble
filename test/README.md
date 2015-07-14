# Tests

Tests for all platforms live here.


## Backend Integration Tests

The current backend tests involve:

* discovering devices
* connecting to a device, finding services, and characteristics, and reading the value of one of them

Integration testing obviously requires a peripheral. The setup for a peripheral should be:

```
device: <some address
  services:
    - name: dummy-service
      uuid: 0x1666
      characteristics:
        - name: dummy-characteristic
          uuid: 0x2666
          value: 12 (0x0c)
```

The important parts being the service/characteristic uuids, and the value, as that's what the tests look for.

### Dummy Peripherals

There is a node implementation of the above peripheral in [./dummy-peripheral](./dummy-peripheral), run it with `npm run start-dummy-peripheral`.

If you want to run the node tests, you will need a different peripheral that looks like the above. Either run the node peripheral on a different device, or simulate it from a mobile device. A great app on iOS is LightBlue

#### Setting up a LightBlue (iOS)

* Download the [app](https://itunes.apple.com/gb/app/lightblue-bluetooth-low-energy/id557428110?mt=8) and open it.
* Hit [+] to create a virtual device, choose "Blank"
* Change `UUID: 1111` (the service uuid) to `1666` as above.
* Change the first characteristic (preset to `0x2222`) to:
    - UUID: `2666`
    - User description: dummy service (or whatever)
    - Value: `0C` (12 in hex)
    - Property: Read
* Go back to the main list, and ensure your virtual peripheral is ticked blue.
* **NB:** after restarting the app, LightBlue seems to remember the virtual peripheral, but may reset the value.

### Node Tests

To run the node tests, ensure the dummy peripheral is setup as above, and just run:

```sh
npm install # unless you did already
npm test
```

### Cordova Tests

The cordova tests are a little more complicated as it has to run in a real app. To save you having to rebuild each time, the cordova server will load the javascript test files from an http server on your mac, so ensure they're on the same network.

* Do this once:
    1. Ensure you have android studio and/or xcode installed
    2. `npm install` if you haven't already
    3. `cordova-init` to setup the cordova project
* Make sure these are running in different terminals before you run the tests
    1. `npm run start-dummy-peripheral` - starts a node server on your mac to test against
    2. `npm run start-cordova-test-server` - starts compiling test files and serving them (reloads automatically)
* Now run the tests (ensure you have a ios/android device attached via usb)
    * `npm run test-ios`
    * `npm run test-android`
* **or** if you want to run the tests manually:
    * ios: open `./cordova/test-cordova-app/platforms/ios/telehash-ble-tests.xcodeproj` in xcode
    * android: open `./cordova/test-cordova-app/platforms/android` in android studio
* To debug running tests:
    * You can re-run the tests by hitting `Reload page` on the device's screen
    * iOS: you can use safari devtools to remote debug. Ensure devtools access both in safari on osx _and_ ios [instructions](https://developer.apple.com/library/mac/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/GettingStarted/GettingStarted.html). Then `Develop > Your iPhone > telehash-ble-tests > index-beefy.html`
    * android: enable devtools access from your device as per [these instructions](https://developer.chrome.com/devtools/docs/remote-debugging) then go to `chrome://inspect` in chrome desktop, and hit inspect on the telehash-ble backend tests webview.
    * **Note:** console logs/errors triggered before devtools were open will not be logged. Reload the page on the device, or by hitting ⌘-r on desktop.
