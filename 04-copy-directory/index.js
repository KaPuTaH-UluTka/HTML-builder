const path = require('path');
const fs = require('fs');
const files = path.join(__dirname, 'files');
const filesCopy = path.join(__dirname, 'files-copy/');

function copyDir(){
  fs.mkdir(filesCopy,{recursive: true}, err => {
    if (err) throw  err;
  });

  fs.readdir(filesCopy, {withFileTypes: true},(err,files)=> {
    if (err) throw  err;
    files.forEach((el) => {
      fs.unlink(filesCopy+ `${el.name}`, err => {
        if (err) throw err;
      });
    });
  });

  fs.readdir(files, {withFileTypes: true},(err,files)=> {
    if (err) throw  err;
    files.forEach((el) => {
      const files = path.join(__dirname, 'files/');
      fs.copyFile(files + `${el.name}`, filesCopy + `${el.name}`, err => {
        if (err) throw  err;
        else console.log('All right!');
      });
    });
  });
}


copyDir();


