const fs = require('fs');
const path = require('path');
const readLine = require('readline');
const textFile = path.join(__dirname,'text.txt');

console.log('Здравствуйте, введите текст');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.writeFile(textFile, '', err => {
  if(err) throw err;
});

rl.on('line', line => {
  if (line === 'exit'){
    console.log('Данные успешно записаны, сеанс завершен.');
    process.exit(0);
  }
  fs.appendFile(textFile, `\n${line}`, err => {
    if(err) throw err;
  });
    
}).on('close', () => {
  console.log('Данные успешно записаны, сеанс завершен.');
  process.exit(0);
});