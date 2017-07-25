const { desktopCapturer } = require('electron');
const {
  grabSnapshot,
  getPaletteFromBitmap,
  paletteToRGB
} = require('./process');

// Globals
window._canvas = window._canvas || document.createElement('canvas');
window.intervalId = null;
window._video = window._video || createVideo();

function createVideo() {
  var v = document.createElement('video');
  v.width = 600;
  v.height = 400;
  v.videoWidth = 600;
  v.videoHeight = 400;
  return v;
}

function handleError(e) {
  alert(e)
}

function loop() {
  const bmp = grabSnapshot(window._video);
  const averages = getPaletteFromBitmap(bmp.data);
  console.log(averages);
  window.PaletteComponents.previewColors(paletteToRGB(averages));
  //generatePreview(averages);
  //ambilightManual(averages);
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
  // create video, but do not attach to DOM
  // when ready, get screen average at a suggested interval
  const video = window._video;
  video.srcObject = mediaStream;
  video.height = HEIGHT;
  video.width = WIDTH;
  //video.onloadedmetadata = play;
}
const setupScreen = (id) => {
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

function play() {
  window.intervalId = setInterval(loop, 1000);
}

function stop() {
  clearInterval(window.intervalId)
}

module.exports = {
  setupScreen: setupScreen,
  play: play,
  stop: stop,
}
