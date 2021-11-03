const fs = require('fs');
const stream = new fs.ReadStream('01-read-file/text.txt');
stream.on('readable', () => {
  const data = stream.read();
  if (data) {
    console.log(data.toString());
  }
});