const sharp = require("sharp");
const _ = require("underscore");
const fs = require("fs-extra");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
let imageStatsCache = [];
let imageDirectoryCache = [];

const metadataKeys = ["width", "height", "format", "hasAlpha", "pages"];

// clear caches- next fetch will regenerate
var pixelMap = [];
const staticImageBaseURL = "/image-preview";
const imageDirectoryPath = "img";

let gClients = fs.readJSONSync("./data/clients.json");
let gImagesets = fs.readJSONSync("./data/imagesets.json");

var path = require("path");
var app = express();
app.use(cors());
app.use(express.static("build"));
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
/* 
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
 */

const optionDefinitions = [{ name: "env", alias: "e", type: String }];
const commandLineArgs = require("command-line-args");
const options = commandLineArgs(optionDefinitions);

// prime image cache

returnAllImageStats();

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
  const shortPath = `${subdir ? subdir + "/" : ""}${newName}`;
  const newPath = `./${imageDirectoryPath}/${shortPath}`;
  sampleFile.mv(newPath, function (err) {
    if (err) return res.status(500).send(err);
    returnAnImageStat({ path: shortPath }).then((result) => {
      imageStatsCache.push(result);
      imageDirectoryCache.push(shortPath);
      res.send({
        success: true,
        message: "File uploaded!",
        uid: newName,
        stats: result,
      });
    });
    // clear caches- next fetch will regenerate
    /*  imageStatsCache = [];
    imageDirectoryCache = []; */
  });
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
  var imagesetData = _.pick(
    req.body,
    "id",
    "name",
    "duration",
    "brightness",
    "images"
  );
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
  let { images, index, duration, brightness, backgroundColor } = imageset;
  var imageCount = images.length;
  if (_.isUndefined(index)) index = 0;
  if (index >= imageCount) index = 0;
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
  backgroundColor = backgroundColor || "#000000";
  const pixelBufferOp = getImgPixelsBuffer(path, setup, backgroundColor);
  const metadata = _.findWhere(imageStatsCache, { id: path });
  let pages;
  //console.log({ metadata });
  return pixelBufferOp.then((result) => {
    if (metadata && metadata.pages > 1) {
      pages = _.pluck(result, "data");
    } else {
      pages = [result.data];
    }
    const outputArray = _.first(
      _.map(pages, (data, pageIndex) => {
        //		console.log('data ' + dataObj.data);
        //data.reverse();
        var rgb = _.compact(
          _.map(data, (dp, index) => {
            if (index % 3) return;
            return [dp, data[index + 1], data[index + 2]];
          })
        );
        //		console.log(rgb);
        var mappedRGB = [];
        const pixelMap = calculateMatrix(setup);
        _.each(pixelMap, (toIndex, fromIndex) => {
          mappedRGB[toIndex] = rgb[fromIndex];
        });
        var flatRGB = _.flatten(mappedRGB);
        flatRGB.unshift("page", pageIndex + 1);
        // console.log(`page ${pageIndex}: sending ${flatRGB.length} R, G & B values`);
        return flatRGB;
        /* var hotPink = [40, 0, 40];
    var hotSomething = [40, 40, 0];
    var off = [0, 0, 0];
    var sequence = [off, off, off, hotSomething, hotPink, hotSomething];
    var sequence2 = [hotPink, hotPink, hotSomething];
    mappedRGB = [];
    for (let looper = 0; looper < 128; looper++) {
      mappedRGB.push(sequence[looper % sequence.length]);
    }
    for (let looper = 0; looper < 64; looper++) {
      mappedRGB.push([0, 0, 0]);
    } */
      }),
      4
    );
    // add extra metadata
    outputArray.unshift(
      "title",
      path,
      "duration",
      duration || 10,
      "brightness",
      brightness || 25,
      "totalPages",
      pages.length
    );
    res.contentType("text/plain");
    res.send(_.flatten(outputArray).join(","));
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

const port = options.env == "dev" ? 3001 : 80;
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
            ..._.pick(metadata, metadataKeys),
          });
        })
        .catch((err) => console.warn(`${path}: ${err}`));
    })
  ).then((results) => {
    imageStatsCache = output;
    console.log(`imageStatsCache has ${output.length} entries`);
    return output;
  });
}

function returnAnImageStat(imgObj) {
  let { path } = imgObj;
  return sharp(`${imageDirectoryPath}/${path}`)
    .metadata()
    .catch((err) => console.warn(`${path}: ${err}`))
    .then(function (metadata) {
      path = `${staticImageBaseURL}/${path}`;

      return {
        id: imgObj.path,
        path,
        ..._.pick(metadata, metadataKeys),
      };
    })
    .catch((err) => console.warn(`${path}: ${err}`));
}

function calculateMatrix(setup) {
  size = setup.width;
  var rows = _.map(_.range(0, size), (index) => {
    var col = _.map(_.range(0, size), (colIndex) => {
      return colIndex + size * index;
    });
    if (index % 2 && setup.zigzag) col.reverse();
    return col.reverse();
    //return col;
  });

  return _.flatten(rows);
}

function getImgPixelsBuffer(img, setup, background) {
  const size = setup.width;
  //const background = setup.background || "#000000";
  var promise = returnAnImageStat({ path: img })
    .then((metadata) => {
      return metadata;
    })
    .then((metadata) => {
      const rotations = {
        topleft: 90,
        topright: 0,
        bottomleft: 180,
        bottomright: 270,
      };
      if (metadata.pages > 1) {
        const operations = _.map(_.range(1, metadata.pages), (page) => {
          return sharp(`${imageDirectoryPath}/${img}`, { page: page })
            .resize(size, size, {
              kernel:
                size < metadata.width
                  ? sharp.kernel.lanczos3
                  : sharp.kernel.nearest,
            })
            .flatten({ background })
            .rotate(rotations[setup.start] || 0)
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then({
              onfulfilled: (result) => {
                return { metadata, result };
              },
            });
        });
        return Promise.all(operations);
      } else {
        return sharp(`${imageDirectoryPath}/${img}`)
          .resize(size, size, {
            kernel:
              size < metadata.width
                ? sharp.kernel.lanczos3
                : sharp.kernel.nearest,
          })
          .flatten({ background: background })
          .rotate(rotations[setup.start] || 0)
          .raw()
          .toBuffer({ resolveWithObject: true })
          .then((result) => result);
      }
    });

  return promise;
}
