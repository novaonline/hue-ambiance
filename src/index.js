const App = require('./js/components/app/app.component.js')

document.addEventListener("DOMContentLoaded", function (event) {
  window.AppComponent = new App(
    {
      data: { app: 'Hue Ambiance' },
      selector: '#app',
    });
  window.AppComponent.load();
});
