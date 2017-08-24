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

* kiosk apps: prevent users from exiting the app, hiding the underlying OS.
* frameless: media players.
* full-screen mode.

### Full-screen applications in NW.js

```json
{
  "window": {
    "fullscreen": true
  }
}
```

Making the app go full-screen programmatically via NW.js's native UI API:
```javascript
const gui = require('nw.gui');
const window = gui.Window.get();
window.enterFullscreen();
```

A more complete example:
```html
<html>
  <head>
    <title>Full-screen app example</title>
    <script>
      'use strict';
      const gui = require('nw.gui');
      const win = gui.Window.get();

      function toggleFullScreen () {
        const button = document.getElementById('fullscreen');
        if (win.isFullscreen) {
          win.leaveFullscreen();
          button.innerText = 'Go full screen';
        } else {
          win.enterFullscreen();
          button.innerText = 'Exit full screen';
        }
      }
    </script>
  </head>
  <body>
    <h1>Full-screen app example</h1>
    <button id="fullscreen" onclick="toggleFullScreen();">Go full screen</button>
  </body>
</html>
```

### Full-screen applications in Electron

```javascript
mainWindow = new BrowserWindow({fullscreen: true});
```

When the app runs, it will go straight into full-screen mode.

```javascript
mainWindow = new BrowserWindow({fullscreenable: false});
```

This configuration option means that the user will not be able to make the app enter full-screen mode from the title bar.

If you want to be able to trigger this functionality programmatically, you'll need to call a function on the `mainWindow` instance after it's initialized.

```javascript
const remote = require('electron').remote;

function toggleFullScreen() {
  const button = document.getElementById('fullscreen');
  const win = remote.getCurrentWindow();
  if (win.isFullscreen()) {
    win.setFullScreen(false);
    button.innerText = 'Go full screen';
  } else {
    win.setFullScreen(true);
    button.innerText = 'Exit full screen';
  }
}
```

Electron handles how the front-end calls to the back-end of the app by providing an API called `remote`.

More BrowserWindow options: https://electron.atom.io/docs/api/browser-window/

### Frameless apps

#### NW.js

Set `frame` to false and `transparent` allows for rounded corners, for example.

```json
"window" : {
  "frame" : false,
  "transparent": true,
  "width": 300,
  "height": 150
}
```

Frameless apps aren't draggable by default. To make it draggable, use `-webkit-app-region: drag;`.

```html
<html>
  <head>
    <title>Transparent NW.js app - you won't see this title</title>
    <style rel="stylesheet">
      html {
        border-radius: 25px;
        -webkit-app-region: drag;
       }
      body {
        background: #333;
        color: white;
        font-family: 'Signika';
      }
      p {
        padding: 1em;
        text-align: center;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.25);
      }
       button, select {
         -webkit-app-region: no-drag;
       }
       p, img {
         -webkit-user-select: all;
         -webkit-app-region: no-drag;
       }
    </style>
  </head>
  <body>
    <p>Frameless app example</p>
  </body>
</html>
```

#### Creating frameless apps with Electron

Making the window frameless:
```javascript
mainWindow = new BrowserWindow({ frame: false });
```

Making the window transparent:
```javascript
mainWindow = new BrowserWindow({ transparent: true });
```

### Kiosk mode applications

Apps that restrict access to the underlying OS.

Kiosk mode in both NW.js and Electron is a locked-down mode where access to the underlying OS is difficult - in fact, being able to quit the app has to be manually added by the developer.

#### Creating kiosk-mode apps in NW.js
