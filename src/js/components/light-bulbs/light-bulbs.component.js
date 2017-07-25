const View = require('../View');
/**
 * This is responsible for showing a lightbulb icon.
 * When the Icon is clicked, the hue light bulb should blink.
 */

class LightBulbs extends View {
  constructor(props) {
    super(props, __filename, props.parentSelector, false);
    this.classSelector = '#light-bulb-group-selector';
    this.data.lightBulbs = [];
    // foreach get hue lights
  }
  addLight() {
    var len = this.data.lightBulbs.push({
      lightId: null
    });
    var idx = len - 1;
    this.data.lightBulbs[idx].selector = `lightbulb-item-selector-${idx}`;
  }
  render() {
    this.generate().then(html => {
      document.querySelector(this.parentSelector).innerHTML = html;
    });
  }
}

module.exports = LightBulbs;
