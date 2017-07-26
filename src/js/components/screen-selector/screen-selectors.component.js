const View = require('../View');
const { desktopCapturer } = require('electron')
const { isMostlyBlack, getSources, setupScreen } = require('../../service/screen');

/**
 * This is responsible for selecting the desired screen to capture
 */

class ScreenSelectors extends View {
  constructor(props) {
    super(props, __filename, props.parentSelector, false);
    this.data.screens = [];
    this.classSelector = '#screen-selectors-grid';
    this.selectedScreenId = null;
    this.loadScreens();
  }
  loadScreens() {
    getSources.then(sources => {
      sources.forEach((source, idx) => {
        if (idx == 0) {
          this.addScreen(source, true);
        } else {
          this.addScreen(source);
        }
      }, this);
    }).then(r => {
      this.render();
      const initScreen = this.data.screens.find(x => x.selected);
      setupScreen(initScreen.source.id);
      if (this.wireEvents) {
        this.wireEvents();
      }
    });
  }
  addScreen(source, selected) {
    if (isMostlyBlack(source)) {
      return; // skip this one
    }
    const len = this.data.screens.push({
      selected: selected,
      imageBase64: source.thumbnail.toDataURL(),
      source: source
    });
    const idx = len - 1;
    this.data.screens[idx].selector = `screen-selector-item-${idx}`;
    //this.children[len - 1].render();
  }
  wireEvents() {
    const events = {
      onclick: (e) => {
        setupScreen(e.target.dataset.id);
        document.querySelectorAll(this.classSelector).forEach((el) => {
          el.children[0].classList.remove('green');
        });
        document.querySelector(this.data.screens[e.target.dataset.id].selector).children[0].classList.add('green');
      },
    }
    this.data.screens.forEach(function (element) {
      for (const key in events) {
        document.querySelector('#' + element.selector)[key] = events[key];
      }
    }, this);
  }
}

module.exports = ScreenSelectors;
