const { desktopCapturer } = require('electron')
const { MMCQ } = require('./lib');
let fs = require('fs')
const path = require('path')
const hue = require("node-hue-api");
const scene = require("node-hue-api").scene;

// todo:
// can set it up so that the function constantly restarts
// once some predicate has been satisfied, it'll update

const { HueApi, lightState } = hue;
let desktopSharing = false;

let config = {};
/** hue */
// file
const getConfig = () => {
  var data = fs.readFileSync(path.join(__dirname, 'config/hue.json'), 'utf8')
  config = JSON.parse(data)
}

const saveConfig = () => {
  var data = JSON.stringify(config);
  fs.writeFileSync(path.join(__dirname, 'config/hue.json'), data, 'utf8')
}

getConfig()
let api;

var displayBridges = function (bridge) {
  console.log("Hue Bridges Found: " + JSON.stringify(bridge));
  config.hostname = bridge[0].ipaddress;
  saveConfig();
};
var displayResult = function (result) {
  console.log(JSON.stringify(result, null, 2));
};
if (!config.hostname) {
  hue.nupnpSearch().then(() => {
    config.hostname = bridge[0].ipaddress;
    saveConfig();
  }).then(() => {
    getConfig();
  }).then(() => {
    api = new HueApi(config.hostname, config.username);
  })
}
else {
  api = new HueApi(config.hostname, config.username);
}

// may have to give it sometime to get the api object

api.config().then(displayResult).done();

api.fullState().then(displayResult).done();

/** end hue */

let _canvas = null;
const getCanvas = () => {
  if (!_canvas) {
    _canvas = document.createElement('canvas');
  }
  return _canvas;
}

function handleError(e) {
  alert(e)
}



function handleStream(mediaStream) {
  let HEIGHT = 400;
  let WIDTH = 600;
  const mediaVideoTracks = mediaStream.getVideoTracks();
  if (!mediaVideoTracks || mediaVideoTracks.length <= 0) {
    throw new error('no video available');
  }
  HEIGHT = mediaVideoTracks[0].getConstraints().height.max;
  WIDTH = mediaVideoTracks[0].getConstraints().width.max;
  let interval = null
  // create video, but do not attach to DOM
  // when ready, get screen average at a suggested interval
  const video = document.getElementsByTagName('video')[0];
  video.srcObject = mediaStream;
  video.height = HEIGHT;
  video.width = WIDTH;
  video.onloadedmetadata = () => {
    interval = setInterval(() => {
      const bmp = grabSnapshot(video);
      const averages = getPaletteFromBitmap(bmp.data);
      generatePreview(averages);
      ambilightManual(averages);
    }, 1000)
  }
}

const ambilightManual = (averages) => {
  const colorToLightMapping = {
    0: 1,
    1: 2,
    2: 4,
    3: 5,
  };
  let sceneInstance = scene.create();
  if (api && !config.sceneId) {
    // create scene
    console.log('create scene')
    sceneInstance.withName("Hue-Ambiance")
      .withLights([1, 2, 4, 5])
      .withTransitionTime(1000)


    api.createAdvancedScene(sceneInstance)
      .then((result) => {
        config.sceneId = result.id
        saveConfig();
      }).done();
  } else if (api && config.sceneId) {
    // update scene
    console.log('update scene');
    let sceneUpdates = scene.create()
    averages.forEach(function (element, idx) {
      let state = lightState.create().on().rgb(element[0], element[1], element[2]);
      api.setSceneLightState(config.sceneId, colorToLightMapping[idx], state).then((r) => {
        console.log(r);
      })
    }, this);
    api.activateScene(config.sceneId)
      .then(displayResult)
      .done();
  }
}

const ambilightAuto = (image) => {
  let sceneInstance = scene.create();
  if (api && !config.sceneId) {
    // create scene
    console.log('create scene')
    sceneInstance.withName("Hue-Ambiance")
      .withLights([1, 2, 4, 5])
      .withTransitionTime(500)
      .withPicture(image);

    api.createAdvancedScene(sceneInstance)
      .then((result) => {
        config.sceneId = result.id
        saveConfig();
      }).done();
  } else if (api && config.sceneId) {
    // update scene
    console.log('update scene');
    let sceneUpdates = scene.create()
    sceneUpdates.withPicture(image);
    api.modifyScene(config.sceneId, sceneUpdates)
      .then(displayResult)
      .done();
  }
}

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
  var canvas = getCanvas();
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

const toggle = () => {
  //console.log(id);

  var id = (document.getElementById('videoSelection').value).replace(/window|screen/g, function (match) { return match + ":"; });
  setupSource(id);
}

const setupSource = (id) => {
  if (!id) {
    throw new Error("no id");
  }
  console.log("Desktop sharing started.. desktop_id:" + id);
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: id,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720
      }
    }
  }).then(handleStream).catch(handleError);
}

const addSource = (source) => {
  var s = document.getElementById('videoSelection');
  var option = document.createElement("option");
  option.text = source.name
  option.value = source.id.replace(":", "");
  s.add(option);
}

const dataLoad = new Event('loadedAllData');

module.exports = () => {
  desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
    if (error) throw error;
    for (let source of sources) {
      addSource(source);
    }
    document.getElementById('videoSelection').dispatchEvent(dataLoad);
  })

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('videoSelection').onchange = toggle;
    document.getElementById('videoSelection').addEventListener("loadedAllData", toggle);
  });
}


