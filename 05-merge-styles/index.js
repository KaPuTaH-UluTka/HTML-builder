const fs = require('fs');
const path = require('path');
const dirWithStyles = path.join(__dirname,'styles');

fs.mkdir('05-merge-styles/project-dist', {recursive: true}, (err)=> {
  if (err) throw err;
});

const bundle = path.join(__dirname,'project-dist/bundle.css');
fs.writeFile(bundle,'',err=> {
  if (err) throw  err;
});

fs.readdir(dirWithStyles,{withFileTypes: true},(err,files)=> {
  if (err) throw  err;

  files.forEach((el)=> {
    if (path.extname(el.name) === '.css') {
      fs.readFile(`${dirWithStyles}/${el.name}`,'utf-8',(err,data)=> {
        if (err) throw err;
        else {
          fs.appendFile(bundle,data,err=>{
            if (err) throw  err;
          });
        }
      });
    }
  });
  console.log('ok');
});