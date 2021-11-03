const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname,'project-dist');
const dirWithStyles = path.join(__dirname,'styles');


fs.mkdir(projectDist, {recursive: true}, (err)=> {
  if (err) throw err;
});

fs.writeFile('06-build-page/project-dist/index.html', '', 'utf-8', err => {
  if (err) throw err;
});
fs.copyFile('06-build-page/template.html', '06-build-page/project-dist/index.html', err => {
  if (err) throw  err;
});
const createReader = fs.createReadStream('06-build-page/project-dist/index.html');

fs.readFile('06-build-page/project-dist/index.html', 'utf-8', (err, data) => {
  if (err) throw err;
  fs.readdir('06-build-page/components', {withFileTypes: true}, (err, files) => {
    if (err) throw  err;
    files.forEach((el) => {
      fs.readFile('06-build-page/components/' + `${el.name}`, 'utf-8', (err, data1) => {
        if (err) throw err;
        data = data.replace('{{' + `${el.name.slice(0, el.name.indexOf('.'))}` + '}}', data1);
        fs.writeFile(
          '06-build-page/project-dist/index.html', data, 'utf-8', (err) => {
            if (err) throw err;
          });
      });
    });
  });
});

const style = path.join(projectDist,'style.css');
fs.writeFile(style,'',err=> {
  if (err) throw  err;
});

fs.readdir(dirWithStyles,{withFileTypes: true},(err,files)=> {
  if (err) throw  err;
  files.forEach((el)=> {
    if (path.extname(el.name) === '.css') {
      fs.readFile(`${dirWithStyles}/${el.name}`,'utf-8',(err,data)=> {
        if (err) throw err;
        else {
          fs.appendFile(style,data,err=>{
            if (err) throw  err;
          });
        }
      });
    }
  });
});

const assets = path.join(__dirname,'assets');
const assetsCopy = path.join(projectDist,'assets');



fs.mkdir(assetsCopy,{recursive: true}, err => {
  if (err) throw  err;
});

fs.readdir(assets, { withFileTypes: true },(err, dir) => {
  if (err) throw  err;
  const finalDir = dir.filter(d => d.isDirectory());
  finalDir.forEach((folder) => {
    fs.mkdir(assetsCopy + `/${folder.name}`,{recursive: true}, err => {
      if (err) throw  err;
    });
    fs.readdir(assetsCopy + `/${folder.name}`, {withFileTypes: true}, (err, copyFiles) => {
      if (err) throw  err;
      copyFiles.forEach((el) => {
        fs.unlink(assetsCopy + `/${folder.name}` + `/${el.name}`, err => {
          if (err) throw err;
        });
      });
    });
    fs.readdir(assets + `/${folder.name}`, {withFileTypes: true}, (err, files) => {
      if (err) throw  err;
      files.forEach((el) => {
        fs.copyFile(assets + `/${folder.name}` +`/${el.name}`, assetsCopy + `/${folder.name}` +`/${el.name}`, err => {
          if (err) throw  err;
        });
      });
    });
  });
});

