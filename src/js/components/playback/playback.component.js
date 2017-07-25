const View = require('../View');
const { stop, play } = require('../../service/screen')
/**
 * This is responsible for stopping and playing the ambiance
 */

class Playback extends View {
  constructor(props) {
    super(props, __filename, props.parentSelector);
    this.selector = '#playback-selector';
    this.wireEvents();
  }
  wireEvents() {
    const events = {
      onclick: (e) => {
        this.toggle();
      },
    }
    for (const key in events) {
      document.querySelector(this.selector)[key] = events[key];
    }
  }
  rerender() {
    this.generate().then(html => {
      document.querySelector(this.parentSelector).innerHTML = html;
      this.wireEvents();
    })
  }
  toggle() {
    this.data.isPlaying = !this.data.isPlaying
    if (this.data.isPlaying === true) {
      play();
    } else {
      stop();
    }
    this.rerender();
  }
}

module.exports = Playback;
