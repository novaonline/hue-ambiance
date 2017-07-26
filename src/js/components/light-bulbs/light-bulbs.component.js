const View = require('../View');
const { getLights, fetchBridge } = require('../../service/hue');
/**
 * This is responsible for showing a lightbulb icon.
 * When the Icon is clicked, the hue light bulb should blink.
 */

class LightBulbs extends View {
  constructor(props) {
    super(props, __filename, props.parentSelector, false);
    fetchBridge(); // this needs to go into the registration area
    this.classSelector = '#light-bulb-group-selector';
    this.data.lightBulbs = [];
    // foreach get hue lights
    getLights().then((result) => {
      result.lights.forEach((el, idx) => {
        this.addLight(el);
      });
    }).then((r) => {
      this.render();
    }).done();
  }
  addLight(light) {
    //console.log(light);
    var len = this.data.lightBulbs.push({
      lightId: light.id,
      name: light.name,
    });
    var idx = len - 1;
    this.data.lightBulbs[idx].selector = `lightbulb-item-selector-${idx}`;
  }
  render() {
    this.generate().then(html => {
      document.querySelector(this.parentSelector).innerHTML = html;
    }).then((r) => {
      this.wireEvents();
    })
  }
  wireEvents() {
    const events = {
      ondragstart: (e) => {
        e.dataTransfer.setData("text", e.target.id);
      },

    }
    this.data.lightBulbs.forEach(function (element) {
      for (const key in events) {
        //console.log(element.selector);
        document.querySelector('#'+element.selector)[key] = events[key];
      }
    }, this);
  }
}

module.exports = LightBulbs;
