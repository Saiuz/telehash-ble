var makeBackendTests = require('../shared/make-backend-tests');
var makeStreamTests = require('../shared/make-stream-tests');
var makeTelehashTests = require('../shared/make-telehash-tests');

//makeBackendTests(require('../../backend-evothings'));
//makeStreamTests(require('../../backend-evothings'))
makeTelehashTests(require('../../backend-evothings'))
