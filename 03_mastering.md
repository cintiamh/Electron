# Mastering Node.js desktop application development

* [Controlling how your desktop app is displayed](#controlling-how-your-desktop-app-is-displayed)
* [Creating tray applications](#creating-tray-applications)

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

package.json config file:
```json
{
  "window": {
    "kiosk": true
  }
}
```

In order to leave the kiosk mode, you need to implement some kind of keyboard shortcut or button that when clicked or typed calls an API function on the app window called `leaveKioskMode`.

example:
```html
<html>
  <head>
    <title>Kiosk mode NW.js app example</title>
    <script>
      'use strict';
      const gui = require('nw.gui');
      const win = gui.Window.get();
      function exit() {
        win.leaveKioskMode();
      }
    </script>
  </head>
  <body>
    <h1>Kiosk mode app</h1>
    <button onclick="exit();">Exit</button>
  </body>
</html>
```

#### Creating kiosk apps with Electron

```javascript
mainWindow = new BrowserWindow({ kiosk: true });
```

And the toggle method would look like this:
```javascript
const remote = require('electron').remote;

function toggleKiosk() {
  const button = document.getElementById('kiosk');
  const win = remote.getCurrentWindow();
  if (win.isKiosk()) {
    win.setKiosk(false);
    button.innerText = 'Enter kiosk mode';
  } else {
    win.setKiosk(true);
    button.innerText = 'Exit kiosk mode';
  }
}
```

# Creating tray applications

## Creating a simple tray app with NW.js

index.html
```html
<html>
  <head>
    <title>Tray app example</title>
    <script>
      const gui = require('nw.gui');
      const tray = new gui.Tray({
        title: 'My tray app'
      });
    </script>
  </head>
  <body>
    <h1>Hello world</h1>
  </body>
</html>
```

#### Should you use text labels for tray apps?

MacOS X is fine with text labels, but on Windows and Linux, tray apps display icons only.

Your safest option is to go with using icons only for your tray apps.

```javascript
const tray = new gui.Tray({icon: 'icon@2x.png'});
```

### Adding menus to your tray icon

```javascript
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

const menu = new gui.Menu();
notes.forEach((note) => {
  menu.append(new gui.MenuItem({ label: note.title }));
}

tray.menu = menu;
```

## Creating a tray app with Electron

### Building the initial app skeleton

Start a new project:
```
$ npm init -y
$ npm i --save-dev electron
```

package.json
```json
{
  "name": "trayapp",
  "version": "0.0.1",
  "description": "",
  "main": "main.js",
  "scripts": {
    "dev": "electron ."
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^1.7.5"
  }
}
```

Create index.html file:
```html
<html>
  <head>
    <title>tray app Electron</title>
    <link href="app.css" rel="stylesheet">
    <script src="app.js"></script>
  </head>
  <body>
    <h1 id="title"></h1>
    <div id="contents"></div>
  </body>
</html>
```

Create app.css file:
```css
body {
  background: #E2D53C;
  color: #292929;
  font-family: 'Comic Sans', 'Comic Sans MS';
  font-size: 14pt;
  font-style: italic;
}
```

main.js file content:
```javascript
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
```

app.js file content:
```javascript
function displayNote(event, note) {
  document.getElementById('title').innerText = note.title;
  document.getElementById('contents').innerText = note.contents;
}

const ipc = require('electron').ipcRenderer;
ipc.on('displayNote', displayNote);
```
