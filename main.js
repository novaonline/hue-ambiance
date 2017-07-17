const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

let win

const createWindow = () => {
  win = new BrowserWindow({ width: 800, height: 600, show: false });
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'poc/index.html'),
    protocol: 'file:',
    slashes: true,
  }))
  win.once('ready-to-show', () => {
    //win.show();
  })
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

  })
}

ipcMain.on('main-window-show', () => {
  if (win !== null) {
    win.show();
  }
})

app.on('ready', createWindow);

