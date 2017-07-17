const notifier = require('node-notifier')
const path = require('path');
const { ipcRenderer } = require('electron')

module.exports = () => {
    console.log('ready-to-notify')
    const notify = (event) => {
      notifier.notify({
        title: 'Hue Ambiance',
        message: 'Hue Ambiance is now running!',
        icon: path.join(__dirname, '../public/logo.png'), // Absolute path (doesn't work on balloons)
        sound: true, // Only Notification Center or Windows Toasters
        wait: true // Wait with callback, until user action is taken against notification
      }, function (err, response) {
        // Response is response from notification
      });

      notifier.on('click', function (notifierObject, options) {
        ipcRenderer.send('main-window-show');
      });

      notifier.on('timeout', function (notifierObject, options) {
        console.log("Notification timed out!")
      });
    }
    notify();
}
