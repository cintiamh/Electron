# Mastering Node.js desktop application development

* [Controlling how your desktop app is displayed](#controlling-how-your-desktop-app-is-displayed)

# Controlling how your desktop app is displayed

## Window sizes and modes

### Configuring window dimensions for an NW.js app

For NW.js just change the package.json file:
```json
{
  "name" : "window-sizing-nwjs",
  "version" : "1.0.0",
  "main" : "index.html",
  "window" : {
    "width" : 300,
    "height" : 200
  }
}
```

### Configuring window dimensions for an Electron app

Change the size inside the main.js file:
```javascript
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  // Set the window initial size HERE!
  mainWindow = new BrowserWindow({ width: 400, height: 200 });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => { mainWindow = null; });
})
```

Electron's approach means you have fine-grained control over the dimensions of each app window.

https://electron.atom.io/docs/api/browser-window/

### Constraining dimensions of window width and height in NW.js

Other `window` parameters:

* `max_width`
* `max_height`
* `min_width`
* `min_height`

#### Dynamically resizing the app window

```javascript
// References GUI API in NW.js
const gui = require('nw.gui');
// Uses GUI API to select current app window
const win = gui.Window.get();
// Sets window size dynamically
win.width = 1024;
win.height = 768;

// Sets window position Dynamically
win.x = 400;
win.y = 500;
```

### Constraining dimensions of window width and height in Electron

The settings for constraining the dimensions of app window in Electron are defined on the `BrowserWindow` instance.

```javascript
mainWindow = new BrowserWindow({
  width: 400, height: 200,
  minWidth: 300, minHeight: 150,
  maxWidth: 600, maxHeight: 450,
  x: 10, y: 10
});
```

By default, Electron renders the app in the middle of the screen. If you want to position the app window in a specific area of the screen, you can control this by passing x and y coordinates to the initialization of the `BrowserWindow`.

## Frameless windows and full-screen apps
