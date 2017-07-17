const { remote } = require('electron')
const { Tray, Menu } = remote
const path = require('path')
const { ipcRenderer } = require('electron')

let trayIcon = new Tray(path.join(__dirname, '../public/logo.png'))

const trayMenuTemplate = [
  {
    label: 'Hue Ambiance Proof of Concept',
    enabled: false
  },
  {
    label: 'Open',
    click: function () {
      // pass on an event to show application window
      ipcRenderer.send('main-window-show');
    }
  },
]

module.exports = () => {
  let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
  trayIcon.setContextMenu(trayMenu)
}
