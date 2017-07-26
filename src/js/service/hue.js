let fs = require('fs')
const path = require('path')
const hue = require("node-hue-api");
const scene = require("node-hue-api").scene;
const { HueApi, lightState } = hue;

let config = {};
let api;

const getConfig = () => {
  var data = fs.readFileSync(path.join(__dirname, '../../../config/hue.json'), 'utf8')
  config = JSON.parse(data)
  return config;
}

const saveConfig = () => {
  var data = JSON.stringify(config);
  fs.writeFileSync(path.join(__dirname, '../../../config/hue.json'), data, 'utf8')
}

const displayResult = (result) => {
  //console.log(JSON.stringify(result, null, 2));
};

const displayBridges = (bridge) => {
  console.log("Hue Bridges Found: " + JSON.stringify(bridge));
  config.hostname = bridge[0].ipaddress;
  saveConfig();
};

const getLights = () => {
  if (api) {
    return api.lights();
  }
}

const fetchBridge = () => {
  getConfig();
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
  api.config().then(displayResult).done();
  api.fullState().then(displayResult).done();
}

const ambilightManual = (averages) => {
  const colorToLightMapping = window.PaletteComponents.data.palettes.map(x => x.lightId).filter(x => x);
  let sceneInstance = scene.create();
  if (api && !config.sceneId) {
    sceneInstance.withName("Hue-Ambiance")
      .withLights(colorToLightMapping)
      .withTransitionTime(1000)

    api.createAdvancedScene(sceneInstance)
      .then((result) => {
        config.sceneId = result.id
        saveConfig();
      }).done();
  } else if (api && config.sceneId) {
    let sceneUpdates = scene.create()
    averages.forEach(function (element, idx) {
      let state = lightState.create().on().rgb(element[0], element[1], element[2]);
      api.setSceneLightState(config.sceneId, colorToLightMapping[idx], state).then((r) => {
        //console.log(r);
      })
    }, this);
    api.activateScene(config.sceneId)
      .then(displayResult)
      .done();
  }
}

exports.fetchBridge = fetchBridge;
exports.ambilightManual = ambilightManual;
exports.getLights = getLights;
exports.getConfig = getConfig;
exports.saveConfig = saveConfig;
