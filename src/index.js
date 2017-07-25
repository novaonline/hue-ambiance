const App = require('./js/components/app/app.component.js')

window.AppComponent = new App(
  {
    data: { app: 'Hue Ambiance' },
    selector: '#app',
  });
window.AppComponent.load();
