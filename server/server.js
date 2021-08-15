const sharp = require("sharp");
const _ = require("underscore");
const fs = require("fs-extra");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
let imageStatsCache = [];
let imageDirectoryCache = [];

var pixelMap = [];
const staticImageBaseURL = "/image-preview";
const imageDirectoryPath = "img";

let gClients = fs.readJSONSync("./data/clients.json");
let gImagesets = fs.readJSONSync("./data/imagesets.json");

var path = require("path");
var app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
//var bodyParser = require("body-parser");

app.use(staticImageBaseURL, express.static(imageDirectoryPath));
// default options
app.use(fileUpload());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
app.use(express.json({ type: "application/json)" }));
//app.use(bodyParser.json());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post("/upload", function (req, res) {
  //console.log(req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(200)
      .send({ success: false, error: "No files were uploaded." });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file;
  let newName = sampleFile.name;
  let subdir = req.body.subdir;
  console.log(subdir);
  fs.ensureDirSync(`./${imageDirectoryPath}/${subdir ? subdir + "/" : ""}`);
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(
    `./${imageDirectoryPath}/${subdir ? subdir + "/" : ""}${newName}`,
    function (err) {
      if (err) return res.status(500).send(err);
      res.send({ success: true, message: "File uploaded!", uid: newName });
    }
  );
});

function gatherAllImages(basePath) {
  if (!_.isEmpty(imageDirectoryCache)) {
    console.log("returning cached file values");
    return imageDirectoryCache;
  }
  recursiveList = (dir, list) => {
    const inThisDir = fs.readdirSync(dir);
    _.each(inThisDir, (fileOrFolder) => {
      const conCatPath = `${dir}/${fileOrFolder}`;
      const stat = fs.statSync(conCatPath);
      if (stat.isDirectory()) {
        list = recursiveList(conCatPath, list);
      } else if (fileOrFolder.match(/\.gif|\.jpg|\.png/g)) {
        // console.log({ stat });
        const path = conCatPath.substr(basePath.length + 1);
        const created = stat.birthtimeMs;
        list.push({ path, created });
      }
    });
    return list;
  };
  imageDirectoryCache = recursiveList(basePath, []);
  return imageDirectoryCache;
}

app.get("/clients", (req, res) => {
  res.send(gClients);
});

app.get("/imagesets", (req, res) => {
  res.send(gImagesets);
});

// sent by client on boot
app.get("/checkin", (req, res) => {
  const params = { id: req.query.id, pixelsCount: req.query.pixels };
  //. nly save if new
  saveClient(params, false);
  res.send("ok");
});

app.post("/clients", function (req, res) {
  var clientData = _.pick(
    req.body,
    "id",
    "name",
    "pixelsCount",
    "width",
    "height",
    "direction",
    "zigzag",
    "start",
    "imagesetId"
  );
  if (!clientData.id) {
    res.send({ success: false, error: "no client id supplied" });
    return;
  }
  saveClient(clientData, true);
  res.send({ success: true });
});

app.post("/imageset", function (req, res) {
  console.log('app.post("/imageset"', req.body);
  var imagesetData = _.pick(req.body, "id", "name", "duration", "images");
  if (!imagesetData.id) {
    res.send({ success: false, error: "no client id supplied" });
    return;
  }
  saveImageset(imagesetData, true);
  res.send({ success: true });
});

app.post("/imagesets", function (req, res) {
  saveAllImageset(req.body);
  res.send({ success: true });
});

app.delete("/imageset", function (req, res) {
  console.log("Got a DELETE request at /imageset");
  const uid = req.body.uid;
  gImagesets = _.reject(gImagesets, (imageset) => imageset.id == uid);
  saveAllImageset(gImagesets);
  res.send({ success: true, message: "imageset removed" });
});

function saveClient(clientData, overWriteFlag) {
  existingClient = _.findWhere(gClients, { id: clientData.id });
  if (existingClient && overWriteFlag) {
    const pos = gClients.indexOf(existingClient);
    gClients.splice(pos, 1, clientData);
    console.log({ clientsList: gClients });
  } else if (!existingClient) {
    gClients.push(clientData);
  }
  fs.writeJSONSync("./data/clients.json", gClients);
}

function saveImageset(imagesetData, overWriteFlag) {
  existingImageset = _.findWhere(gImagesets, { id: imagesetData.id });
  if (existingImageset && overWriteFlag) {
    const pos = gImagesets.indexOf(existingImageset);
    gImagesets.splice(pos, 1, imagesetData);
    console.log({ imagesetsList: gImagesets });
  } else if (!existingImageset) {
    gImagesets.push(imagesetData);
  }
  fs.writeJSONSync("./data/imagesets.json", gImagesets);
}
function saveAllImageset(imagesetData) {
  console.log("saveAllImageset", imagesetData.length);
  fs.writeJSONSync("./data/imagesets.json", imagesetData);
  gImagesets = imagesetData;
}

app.get("/image", (req, res) => {
  const { size, id } = req.query;
  const sizeInt = parseInt(size, 10);
  const setup = _.findWhere(gClients, { id });
  if (!setup) {
    console.warn(`client '${id}' not found`);

    res.send("255,0,255,255,255,0, 255,0,255");
    return;
  }
  let imageset = _.findWhere(gImagesets, { id: parseInt(setup.imagesetId) });
  if (!imageset) {
    console.warn(`imageset id ${imageset}`);
    imageset = gImagesets[0];
  }
  let { images, index } = imageset;
  var imageCount = images.length;
  if (_.isUndefined(index)) index = 0;
  if (index == imageCount) index = 0;
  var path = images[index];
  /*  fileObj = _.findWhere(gatherAllImages(imageDirectoryPath), {
    path: filePath,
  });
  if (!fileObj) {
    console.warn(`file '${filePath}' not found`);
    console.warn(`all images: `, gatherAllImages(imageDirectoryPath)[0]);
  } else {
    console.warn({ fileObj });
  }
  imageset.index = index + 1; */

  //const { path } = filePath;
  imageset.index = index + 1;
  console.log({ path });

  /* var metadata = _.findWhere(imageStatsCache, {
    id: path,
  });
  console.log(imageStatsCache[0]); */

  var dataP = getImgPixelsBuffer(`${imageDirectoryPath}/${path}`, sizeInt);
  return dataP.then((dataObj) => {
    //		console.log('data ' + dataObj.data);
    data = dataObj.data;
    //data.reverse();
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
    var flatRGB = _.flatten(mappedRGB);
    /* console.log(`sending ${flatRGB.length} R, G & B values`);
    var hotPink = [40, 0, 40];
    var hotSomething = [40, 40, 0];
    var off = [0, 0, 0];
    var sequence = [off, off, off, hotSomething];
    var sequence2 = [hotPink, hotSomething];
    mappedRGB = [];
    for (let looper = 0; looper < 128; looper++) {
      mappedRGB.push(sequence[looper % sequence.length]);
    }
    for (let looper = 0; looper < 64; looper++) {
      mappedRGB.push(sequence[looper % sequence.length]);
    }
    for (let looper = 0; looper < 64; looper++) {
      mappedRGB.push(sequence2[looper % sequence2.length]);
    } */
    //res.send(_.flatten(mappedRGB).join(","));
    res.send(flatRGB.join(","));
  });
});

app.get("/images", (req, res) => {
  if (!_.isEmpty(imageStatsCache)) {
    console.log("returning cached image stats");
    res.send(imageStatsCache);
    return;
  }

  returnAllImageStats().then((output) => res.send(output));
});

const port = 3001;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

function returnAllImageStats() {
  var images = gatherAllImages(imageDirectoryPath);
  var output = [];
  return Promise.all(
    images.map((imgObj) => {
      let { path, created } = imgObj;
      return sharp(`${imageDirectoryPath}/${path}`)
        .metadata()
        .catch((err) => console.warn(`${path}: ${err}`))
        .then(function (metadata) {
          path = `${staticImageBaseURL}/${path}`;
          output.push({
            id: imgObj.path,
            path,
            created,
            ..._.pick(metadata, ["width", "height", "format", "hasAlpha"]),
          });
        })
        .catch((err) => console.warn(`${path}: ${err}`));
    })
  ).then((results) => {
    imageStatsCache = output;
    return output;
  });
}

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
    .resize(size, size, { kernel: sharp.kernel.lanczos3 })
    .flatten({ background: "#ffffff" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  return data;
}
