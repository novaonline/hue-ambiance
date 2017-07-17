const { desktopCapturer } = require('electron')

function handleError(e) {
  console.log(e)
}

function handleStream(mediaStream) {
  const mediaVideoTracks = mediaStream.getVideoTracks();
  if (!mediaVideoTracks || mediaVideoTracks.length <= 0) {
    throw new error('no video available');
  }

  // var captureDevice = new ImageCapture(mediaVideoTracks);
  // if (captureDevice) {
  //       captureDevice.grabFrame().then(processFrame(imgData));
  // }

  // create video
  const video = document.createElement('video');
  video.src = URL.createObjectURL(mediaStream)
  video.onloadedmetadata = () => {
    const canvas = createContextWithVideo(video);
    //document.querySelector('body').appendChild(canvas);

  }

  //console.log(ctx);
}


processFrame = (e) => {
  const imgData = e.imageData;
  console.log(imgData[0])
}

const createContextWithVideo = (video) => {
  const WIDTH = 500;
  const HEIGHT = 400;
  var canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
  setTimeout(function () {
    const bmp = ctx.getImageData(0, 0, 500, 400);
    console.log(bmp.data);
  }, 1000);
  return canvas;
}

module.exports = () => {
  desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
    if (error) throw error
    for (let i = 0; i < sources.length; ++i) {
      console.log(sources[i].name)
      if (sources[i].name === 'Entire screen') {
        navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources[i].id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720
            }
          }
        }).then(handleStream).catch(handleError);
        return
      }
    }
  })
}
