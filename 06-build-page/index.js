const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');


const projectDist = path.join(__dirname,'project-dist');
const dirWithStyles = path.join(__dirname,'styles');

fs.mkdir(projectDist, {recursive: true}, (err)=> {
  if (err) throw err;
});

// fs.writeFile('06-build-page/project-dist/index.html', '', 'utf-8', err => {
//   if (err) throw err;
// });
// fs.copyFile('06-build-page/template.html', '06-build-page/project-dist/index.html', err => {
//   if (err) throw  err;
// });

async function createHtml() {
  const template = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const indexHTML = fs.createWriteStream(path.join(__dirname, 'project-dist' , 'index.html'));
  let resultHTML = '';
  template.on('data', chunk => {
    resultHTML = chunk.toString();
    fs.readdir(path.join(__dirname,'components'),{withFileTypes: true}, (err,data) => {
      if (err) {
        throw err;
      }
      let tempArr = [];
      data.forEach(file => {
        tempArr.push(`{{${file.name.split('.')[0]}}}`);
      });
      fsPromises.readdir(path.join(__dirname, 'components'))
        .then( async files => {
          files.forEach( (file,i) => {
            const readableStream = fs.createReadStream(path.join(__dirname, 'components', file), 'utf-8');
            readableStream.on('data', chunk => {
              resultHTML = resultHTML.replace(tempArr[i], chunk);
              if (i === tempArr.length - 1) {
                indexHTML.write(resultHTML);
              }
            });
          });
        });
    });
  });
}
// fs.readFile('06-build-page/project-dist/index.html', 'utf-8', (err, data) => {
//   if (err) throw err;
//   fs.readdir('06-build-page/components', {withFileTypes: true}, (err, files) => {
//     if (err) throw  err;
//     files.forEach((el) => {
//       fs.readFile('06-build-page/components/' + `${el.name}`, 'utf-8', (err, data1) => {
//         if (err) throw err;
//         data = data.replace(new RegExp('{{' + `${el.name.slice(0, el.name.indexOf('.'))}` + '}}'), data1);
//         fs.writeFile(
//           '06-build-page/project-dist/index.html', data, 'utf-8', (err) => {
//             if (err) throw err;
//           });
//       });
//     });
//   });
// });

async function createCss() {
  const style = path.join(projectDist, 'style.css');
  fs.writeFile(style, '', err => {
    if (err) throw  err;
  });

  fs.readdir(dirWithStyles, {withFileTypes: true}, (err, files) => {
    if (err) throw  err;
    files.forEach((el) => {
      if (path.extname(el.name) === '.css') {
        fs.readFile(`${dirWithStyles}/${el.name}`, 'utf-8', (err, data) => {
          if (err) throw err;
          else {
            fs.appendFile(style, data, err => {
              if (err) throw  err;
            });
          }
        });
      }
    });
  });
}


const assets = path.join(__dirname, 'assets');
const assetsCopy = path.join(projectDist, 'assets');
fs.mkdir(assetsCopy, {recursive: true}, err => {
  if (err) throw  err;
});

async function createAssets() {
  fs.readdir(assets, {withFileTypes: true}, (err, dir) => {
    if (err) throw  err;
    const finalDir = dir.filter(d => d.isDirectory());
    finalDir.forEach((folder) => {
      fs.mkdir(assetsCopy + `/${folder.name}`, {recursive: true}, err => {
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
          fs.copyFile(assets + `/${folder.name}` + `/${el.name}`, assetsCopy + `/${folder.name}` + `/${el.name}`, err => {
            if (err) throw  err;
          });
        });
      });
    });
  });
}


async function buildPage() {
  await createHtml();
  await createCss();
  await createAssets();
}

buildPage();