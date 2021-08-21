const sharp = require("sharp");
const sourcePath = "../working/pacman/ghost-animation.gif";
const destpath = "../working/pacman/";
const source = sharp(sourcePath);
const _ = require("underscore");

source.metadata().then(function (metadata) {
  console.log(metadata);
  const operations = _.map(_.range(1, metadata.pages), (pageIndex) => {
    return sharp(sourcePath, { page: pageIndex })
      .png()
      .toFile(destpath + `frame-${pageIndex}.png`);
  });
  Promise.all(operations).then((results) => console.log(results));
});
