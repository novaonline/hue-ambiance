const View = require('../View');
/**
 * This component is responsible for showing one palette.
 * This one palette will know which hue light bulb it's responsible for
 */

class Palettes extends View {
  constructor(props) {
    super(props, __filename, props.parentSelector, false);
    this.classSelector = '#palette-group-selector';
    this.data.palettes = [];
    this.numOfPalettes = props.numOfPalettes || 4;
    for (var index = 0; index < this.numOfPalettes; index++) {
      this.addPalette();
    }
    this.render();
  }
  addPalette() {
    const lngth = this.data.palettes.push(
      Object.assign({}, { color: 'rgb(255,255,255)', lightId: null })
    );
    const idx = lngth - 1;
    this.data.palettes[idx].selector = `palette-item-selector-${idx}`;
  }
  render() {
    this.generate().then(html => {
      document.querySelector(this.parentSelector).innerHTML = html;
      this.wireEvents();
    })
  }
  previewColors(palette) {
    palette.forEach(function (element, idx) {
      const dataEl = this.data.palettes[idx];
      dataEl.color = element;
      document.querySelector('#' + dataEl.selector).style.backgroundColor = dataEl.color;
    }, this);
  }
  wireEvents() {
    const events = {
      ondragover: (e) => {
        e.preventDefault();
      },
      ondrop: (e) => {
        e.preventDefault();
        var data = e.dataTransfer.getData("text");
        const lightId = document.getElementById(data).dataset.id;
        const colorId = e.target.dataset.id;
        //   console.log(document.getElementById(data).dataset.id,
        //   e.target.dataset.id
        // )
        this.data.palettes[colorId].lightId = lightId;
        this.updateLightIds();
        // add the color id to the palette
        //e.target.appendChild(document.getElementById(data));
      }
    };
    this.data.palettes.forEach(function (element) {
      for (const key in events) {
        document.querySelector('#' + element.selector)[key] = events[key];
      }
    }, this);
  }
  updateLightIds() {
    this.data.palettes.forEach(function (element) {
      const light = window.LightBulbsComponents.data.lightBulbs.find(x => x.lightId === element.lightId);
      if (light) {
        document.querySelector('#' + element.selector).children[0]
          .children[0]
          .innerHTML = light.name;
        if (element.lightId) {
          document.querySelector('#' + element.selector).children[0].classList.remove('empty-color-area')
        }
      }

    }, this);
  }
}

module.exports = Palettes;
