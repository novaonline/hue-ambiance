const Handlebars = require('handlebars');
const fs = require('fs');
// const path = require('path');

class View {
  constructor(props, fileName, parentSelector, shouldRender) {
    if (typeof (shouldRender) === 'undefined') {
      shouldRender = true;
    }
    this.viewPath = fileName.replace(".js", '.hbs') || '';
    this.data = props.data || {};
    this.parentSelector = parentSelector || '';
    if (shouldRender === true)
      this.render();
    // this.generate = new Promise((resolve, reject) => {
    //   fs.readFile(this.viewPath, (err, source) => {
    //     if (err) throw err;
    //     const template = Handlebars.compile(source.toString());
    //     resolve(template(this.data));
    //   })
    // })
  }

  generate() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.viewPath, (err, source) => {
        if (err) throw err;
        const template = Handlebars.compile(source.toString());
        resolve(template(this.data));
      })
    })
  }
  render() {
    fs.readFile(this.viewPath, (err, source) => {
      if (err) {
        return;
      }
      const template = Handlebars.compile(source.toString());
      document.querySelector(this.parentSelector).innerHTML = template(this.data);
    })
  }

}

module.exports = View;
