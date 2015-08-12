var lob = require('lob-enc')

var chunk = lob.chunking({ size: 5 }, function cbPacket(err, packet){
})

var data = '';

chunk.send(new Buffer('HELLO', 'utf8'))
chunk.send(new Buffer('THERE', 'utf8'))

var c;
console.log(c=(chunk.read(5)||chunk.read()), c&&c.toString())
console.log(c=(chunk.read(5)||chunk.read()), c&&c.toString())
console.log(c=(chunk.read(5)||chunk.read()), c&&c.toString())
console.log(c=(chunk.read(5)||chunk.read()), c&&c.toString())
console.log(c=(chunk.read(5)||chunk.read()), c&&c.toString())
console.log(c=(chunk.read(5)||chunk.read()), c&&c.toString())
console.log(c=(chunk.read(5)||chunk.read()), c&&c.toString())
console.log(c=(chunk.read(5)||chunk.read()), c&&c.toString())

chunk.send(new Buffer('THERE', 'utf8'))
console.log(c=(chunk.read(5)||chunk.read()), c&&c.toString())

console.log(c=(chunk.read(5)||chunk.read()), c&&c.toString())
console.log(c=(chunk.read(5)||chunk.read()), c&&c.toString())
