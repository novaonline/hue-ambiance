const View = require('../View');
const ScreenSelectors = require('../screen-selector/screen-selectors.component');
const Playback = require('../playback/playback.component');
const Palettes = require('../palettes/palettes.component');
const LightBulbs = require('../light-bulbs/light-bulbs.component');

/**
 * Responsible for grabbing the config file and instantiating the hue api.
 * If the hue API fails to make a successful call, execute registration.component.js
 * This is also the root component
 */

class App extends View {
  constructor(props) {
    super(props, __filename, '#app');
    this.config = 'hi';
  }
  load() {
    window.ScreenSelectorsComponent = new ScreenSelectors({
      parentSelector: '#screen-selector',
    });
    window.ScreenSelectorsComponent.loadScreens();
    window.PlaybackComponent = new Playback({
      parentSelector: '#controls',
      data: { isPlaying: false },
    });
    window.PaletteComponents = new Palettes({
      parentSelector: '#palette-slots-with-preview',
      data: {},
    });
    window.LightBulbsComponents = new LightBulbs({
      parentSelector: '#light-bulb-cards',
      data: {},
    });
  }
  updateAppName(name) {
    this.data.app = name;
    document.querySelector('.span-application-name').innerHTML = this.data.app;
  }

}

module.exports = App;
