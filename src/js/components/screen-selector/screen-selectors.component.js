const View = require('../View');
const ScreenSelector = require('./screen-selector.component');
const { desktopCapturer } = require('electron')

/**
 * This is responsible for selecting the desired screen to capture
 */
const getSources = new Promise((resolve, reject) => {
  desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
    if (error) throw error;
    return resolve(sources);
  })
});

const isMostlyBlack = (source) => {
  const avg = source.thumbnail.resize({ width: 1, height: 1 }).toBitmap()
  if (avg[0] < 8 && avg[1] < 8 && avg[2] < 8) {
    return true;
  }
  return false;
}

class ScreenSelectors extends View {
  constructor(props) {
    super(props, __filename, props.parentSelector);
    this.children = [];
    this.selector = '#screen-selectors-grid';
    this.selectedScreenId = null;
    if (this.wireEvents) {
      this.wireEvents();
    }
  }
  loadScreens() {
    getSources.then(sources => {
      sources.forEach((source, idx) => {
        if (idx == 0) {
          this.addScreen(source, true);
        }
        this.addScreen(source);
      }, this);
    })
  }
  addScreen(source, selected) {
    if (isMostlyBlack(source)) {
      return; // skip this one
    }
    const idx = this.children.push(
      new ScreenSelector({
        data: Object.assign({},
          { selected: selected },
          { imageBase64: source.thumbnail.toDataURL() },
          { screen: source },
          { id: 0 }),
        parentSelector: this.selector,
      })
    );
    this.children[idx - 1].setId(idx - 1);
    this.children[idx - 1].render();
  }

  wireEvents() {
    const events = {
    }
    for (const key in events) {
      document.querySelector(this.selector)[key] = events[key];
    }
  }

}

module.exports = ScreenSelectors;
