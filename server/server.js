const sharp = require("sharp");
const _ = require("underscore");
const fs = require("fs-extra");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require('cors');

var pixelMap = [];
const staticImageBaseURL = '/image-preview';
const imageDirectoryPath = 'img';


var path = require("path");
var app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(staticImageBaseURL, express.static(imageDirectoryPath))
// default options
app.use(fileUpload());

app.post("/upload", function (req, res) {
  console.log(req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.fileName;
  let newName = sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`./${imageDirectoryPath}/${newName}`, function (err) {
    if (err) return res.status(500).send(err);

    res.send("File uploaded!");
  });

});

function gatherAllImages(path) {
  recursiveList = (dir, list) => {
      const inThisDir = fs.readdirSync(dir);
      _.each(inThisDir, (fileOrFolder) => {
        const conCatPath = `${dir}/${fileOrFolder}`;
        const stat = fs.statSync(conCatPath);
        if (stat.isDirectory()) {
          list = recursiveList(conCatPath, list);
        } else if(fileOrFolder.match(/\.gif|\.jpg|\.png/g)) {
					const foundImage = conCatPath.substr(path.length + 1);
					list.push(foundImage);
			  }
      })
      return list;
  }
  return recursiveList(path, []); 
}

app.get("/image", (req, res) => {
  const size = parseInt(req.query.size, 10);
  var images = gatherAllImages(imageDirectoryPath); 
  var imageCount = images.length;
  var random = Math.round(Math.random() * 10000) % imageCount;
  var file = images[random];
  console.log(file);
  var dataP = getImgPixelsBuffer(`${imageDirectoryPath}/${file}`, size);
  return dataP.then((dataObj) => {
    //		console.log('data ' + dataObj.data);
    data = dataObj.data;
    data.reverse();
    var rgb = _.compact(
      _.map(data, (dp, index) => {
        if (index % 3) return;
        return [data[index + 2], data[index + 1], dp];
      })
    );
    //		console.log(rgb);
    var mappedRGB = [];
    const pixelMap = calculateMatrix(size);
    _.each(pixelMap, (toIndex, fromIndex) => {
      mappedRGB[toIndex] = rgb[fromIndex];
    });
    var flatRGB = _.flatten(mappedRGB);
    console.log(`sending ${flatRGB.length} pixels`);
    res.send(flatRGB.join(','));
  });
});

app.get("/images", (req, res) => {
  const size = parseInt(req.query.size, 10);
  var images = gatherAllImages(imageDirectoryPath); 
  var output = []
  Promise.all(
    images.map(img => {
      return sharp(`${imageDirectoryPath}/${img}`)
      .metadata().catch(err => console.warn(`${img}: ${err}`))
      .then(function (metadata) {
        const path = `${staticImageBaseURL}/${img}`;
        output.push({ img, path, ..._.pick(metadata, ['width', 'height', 'format', 'hasAlpha']) });
      })
      .catch(err => console.warn(`${img}: ${err}`))
    }
    )
  ).then(results => {
		console.log(results, output);
    res.send(output);
  }
  )
});

const port = 3001;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);


function calculateMatrix(size, startingPositionX, startingPositionY) {
  var rows = _.map(_.range(0, size), (index) => {
    var col = _.map(_.range(0, size), (colIndex) => {
      return colIndex + size * index;
    });
    if (index % 2) col.reverse();
    return col.reverse();
  });

  return _.flatten(rows);

}


function getImgPixelsBuffer(img, size) {
  var data = sharp(img)
    .resize(size, size, { kernel: sharp.kernel.nearest })
    .raw()
    .toBuffer({ resolveWithObject: true });

  return data;
}