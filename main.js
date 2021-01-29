// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')

const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
autoUpdater.logger = log;
autoUpdater.logger.transports.console.level = 'debug';
autoUpdater.logger.transports.file.level = 'debug';
log.info('App starting...');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    resizable: true,
    center: true,
    fullscreen: true,
    frame: true,
    titleBarStyle: 'hidden',
    // alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
//  mainWindow.webContents.openDevTools();

  autoUpdater.checkForUpdates();
}

function startApp(){
  createWindow();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', startApp)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

function sendStatusToWindow(text) {
  log.debug(text);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
  // autoUpdater.downloadUpdate();
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('request-info', (e, data) => {
  console.log('main.js: request-info');
  e.sender.send('request-info-reply', {
    display: screen.getPrimaryDisplay(),
  });
})
