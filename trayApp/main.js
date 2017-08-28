'use strict';

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;
const BrowserWindow = electron.BrowserWindow;

let appIcon = null;
let mainWindow = null;

const notes = [
  {
    title: 'todo list',
    contents: 'grocery shopping\npick up kids\nsend birthday party invites',
  },
  {
    title: 'grocery list',
    contents: 'Milk\nEggs\nButter\nDouble Cream',
  },
  {
    title: 'birthday invites',
    contents: 'Dave\nSue\nSally\nJohn and Joanna\nChris and Georgina\nElliot'
  }
];

// Use Electron's WebContents API to send data to browser window to display note's contents
function displayNote(note) {
  mainWindow.webContents.send('displayNote', note);
}

function addNoteToMenu(note) {
  return {
    label: note.title,
    type: 'normal',
    click: () => { displayNote(note); }
  };
}

app.on('ready', () => {
  appIcon = new Tray('icon.png');
  let contextMenu = Menu.buildFromTemplate(notes.map(addNoteToMenu));
  appIcon.setToolTip('Notes App');
  appIcon.setContextMenu(contextMenu);
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.webContents.on('dom-ready', () => {
    displayNote(notes[0]);
  });
});
