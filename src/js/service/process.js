const { MMCQ } = require('../vendors/mmcq');

// get the average color
const getPaletteFromBitmap = (bitmapData) => {
  let pixelArray = [];
  let n = 0;
  let x = bitmapData.length;
  let i = 0;
  let offset = 0;
  while (i < x) {
    let result = { R: 0, G: 0, B: 0, A: 255 };
    offset = i * 4;
    result.R = bitmapData[offset + 0] || 0;
    result.G = bitmapData[offset + 1] || 0;
    result.B = bitmapData[offset + 2] || 0;
    result.A = bitmapData[offset + 3] || 0;
    n++;
    i = i + 10;

    // make sure its not white or black
    if (result.A >= 125) {
      if (
        !(result.R > 250 && result.G > 250 && result.B > 250)
        && !(result.R < 10 && result.B < 10 && result.G < 10)
      ) {
        pixelArray.push([result.R, result.G, result.B]);
      }
    }
  }
  //console.log(pixelArray);
  const cmap = MMCQ.quantize(pixelArray, 4);
  const palette = cmap.palette();
  return palette;
}

// grab a snapshot of the video
const grabSnapshot = (video) => {
  const WIDTH = video.videoWidth;
  const HEIGHT = video.videoHeight;
  var canvas = window._canvas;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
  const bmp = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  return bmp;
}

const generatePreview = (colorAvg) => {
  //console.log(colorAvg);
  var canvas = document.getElementById("preview");
  var ctx = canvas.getContext("2d");
  colorAvg.forEach(function (element, idx) {
    const color = `rgb(${Math.round(element[0])},${Math.round(element[1])},${Math.round(element[2])})`;
    var options = {
      x: idx * (canvas.width / 4),
      y: 0,
      width: canvas.width / 4,
      height: canvas.height / 4,

    }
    //console.log(idx, color, options)
    ctx.fillStyle = color;
    ctx.fillRect(options.x, options.y, options.width, options.height);
  }, this);
}

exports.grabSnapshot = grabSnapshot;
exports.getPaletteFromBitmap = getPaletteFromBitmap;
exports.generatePreview = generatePreview;
