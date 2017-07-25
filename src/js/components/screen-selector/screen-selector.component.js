const View = require('../View');
const { setupScreen } = require('../../service/screen')
/**
 * This is responsible for selecting the desired screen to capture
 */

class ScreenSelector extends View {
  constructor(props) {
    super(props, __filename, props.parentSelector, false);
    if (this.data.selected) {
      setupScreen(this.data.screen.id);
    }
    this.classSelector = '.screen-selector-item';
  }
  setId(id) {
    this.data.id = id;
    this.selector = `#screen-selector-item-${id}`;
  }

  render() {
    this.generate().then(html => {
      const parent = document.createElement('div');
      parent.innerHTML = html;
      var element = parent.childNodes[0];
      element.dataset.id = this.data.screen.id;
      document.querySelector(this.parentSelector).appendChild(element);
      this.wireEvents();
    });
  }
  wireEvents() {
    const events = {
      onclick: (e) => {
        setupScreen(this.data.screen.id);
        document.querySelectorAll(this.classSelector).forEach((el) => {
          el.children[0].classList.remove('green');
        });
        document.querySelector(this.selector).children[0].classList.add('green');
      },
    }
    for (const key in events) {
      document.querySelector(this.selector)[key] = events[key];
    }
  }
}

module.exports = ScreenSelector;
