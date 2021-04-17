const sharp = require("sharp");
const _ = require("underscore");
const fs = require("fs-extra");
const express = require("express");
const fileUpload = require("express-fileupload");

var pixelMap = [];

var calculateMatrix = (size) => {
	var rows = _.map(_.range(0, size), (index) => {
  var col = _.map(_.range(0, size), (colIndex) => {
    return colIndex + size * index;
  });
  if (index % 2) col.reverse();
  return col;
});

return _.flatten(rows);

}
/* 
const matrixWidth = 8;
const matrixHeight = 8;
var rows = _.map(_.range(0, 16), (index) => {
  var col = _.map(_.range(0, 16), (colIndex) => {
    return colIndex + 16 * index;
  });
  if (index % 2) col.reverse();
  return col;
});
// 8x8  pixel version
var pixelMap = _.flatten([
  [0, 15, 16, 31, 32, 47, 48, 63].reverse(),
  [1, 14, 17, 30, 33, 46, 49, 62].reverse(),
  [2, 13, 18, 29, 34, 45, 50, 61].reverse(),
  [3, 12, 19, 28, 35, 44, 51, 60].reverse(),
  [4, 11, 20, 27, 36, 43, 52, 59].reverse(),
  [5, 10, 21, 26, 37, 42, 53, 58].reverse(),
  [6, 9, 22, 25, 38, 41, 54, 57].reverse(),
  [7, 8, 23, 24, 39, 40, 55, 56].reverse(),
]);
console.log(rows);
var pixelMap = _.flatten(rows); 


for (let columnIndex = 0; columnIndex < matrixWidth; columnIndex++) {
  let colStart = matrixWidth * columnIndex;
  for (let rowIndex = 0; rowIndex < matrixHeight; rowIndex++) {
    let rowStart = matrixHeight * rowIndex;
    var runningInputIndex = colStart + rowIndex;
    let rowId;
    if (columnIndex % 2 == 0) {
      // descending column
      rowId = rowStart + rowIndex;
    } else {
      rowId = rowStart + matrixHeight - 1 - rowIndex;
    }
    //    pixelMap[runningInputIndex] = rowId;
  }
}
console.log(`pixelMap.length: ${pixelMap.length}`);
*/


function getPixels(img, size ) {
  var data = sharp(img)
    .resize(size, size, { kernel: sharp.kernel.nearest })
    .raw()
    .toBuffer({ resolveWithObject: true });

  return data;
}
var path = require("path");
var app = express();
app.use(express.static(path.join(__dirname, "public")));
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
 sampleFile.mv(`./img/${newName}`, function (err) {
   if (err) return res.status(500).send(err);

   res.send("File uploaded!");
 });

});
app.get("/image", (req, res) => {
	const size = parseInt(req.query.size, 10);
  var images = fs.readdirSync("img");
  var imageCount = images.length;
  var random = Math.round(Math.random() * 10000) % imageCount;
  var file = images[random];
  console.log(file);
  var dataP = getPixels("img/" + file, size);
  return dataP.then((dataObj) => {
    //		console.log('data ' + dataObj.data);
    data = dataObj.data;
    var rgb = _.compact(
      _.map(data, (dp, index) => {
        if (index % 3) return;
        return [dp, data[index + 1], data[index + 2]];
      })
    );
    //		console.log(rgb);
		var mappedRGB = [];
		const pixelMap = calculateMatrix(size);
    _.each(pixelMap, (toIndex, fromIndex) => {
      mappedRGB[toIndex] = rgb[fromIndex];
    });
    var chunkedRGB = _.chunk(mappedRGB, 8);
		var flatRGB = _.flatten(mappedRGB);
		console.log(`sending ${flatRGB.length} pixels`);
    res.send(flatRGB.join(','));
  });
});

const port = 3000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
