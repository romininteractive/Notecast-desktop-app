// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer } = require('electron');

let deviceInfo = {};

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  console.log('Preload.js loaded.');

  ipcRenderer.send('check_for_update');
  ipcRenderer.on('log', (event, arg) => {
    console.log(arg);
  });

  ipcRenderer.send('request-info');
})

ipcRenderer.on('request-info-reply', (e, data) => {
  console.log('preload.js: request-info-reply');
  // console.log(data);
  deviceInfo = data;
})

window.addEventListener('request-info', (e, data) => {
  e.detail.handler(deviceInfo);
})