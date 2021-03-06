# Mastering Node.js desktop application development

* [Controlling how your desktop app is displayed](#controlling-how-your-desktop-app-is-displayed)
* [Creating tray applications](#creating-tray-applications)
* [Creating application and context menus](#creating-application-and-context-menus)
* [Dragging and dropping files and crafting the UI](#dragging-and-dropping-files-and-crafting-the-ui)
* [Using a webcam in your application](#using-a-webcam-in-your-application)
* [Storing app data](#storing-app-data)
* [Copying and pasting contents from the clipboard](#copying-and-pasting-contents-from-the-clipboard)
* [Binding on keyboard shortcuts](#binding-on-keyboard-shortcuts)
* [Making desktop notifications](#making-desktop-notifications)

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
})

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

Icons need to be within 32x32 pixel dimension.

# Creating application and context menus

## Adding menus to your app

Types:
* app window menus: top of app window, under the title bar (or in the system menu on Mac OS)
* context menus: shows up when you right click an item in the app
* tray menus: covered in tray apps

### App window menus

Microsoft Windows and Linux handles the same way, and Mac OS is the odd one.
* Windows and Linux: each app window has its own menu placed within it.
* Mac OS: only one app menu for all the windows.

### Creating menus for Mac OS apps with NW.js

* Skipping

### Creating menus for Mac OS apps with Electron

When defining an app menu in Electron, you need to add it to an app window.

```javascript
const electron = require('electron');
const Menu = electron.remote.Menu;
const name = electron.remote.app.getName();

const template = [
  {
    label: '',
    submenu: [
      {
        label: 'About ' + name
      }
    ]
  }
]
```

https://www.npmjs.com/package/electron-default-menu

```
$ npm i electron-default-menu --save
```

Change app.js file:
```javascript
const electron = require('electron');
const defaultMenu = require('electron-default-menu');
const Menu = electron.remote.Menu;

// Calls it in place of template code to provide default menu
const menu = Menu.buildFromTemplate(defaultMenu());
Menu.setAppMenu(menu);
```

The electron-default-menu module provides the app window with more actions and provides a base for adding other menu items.

## Context Menus

### Creating a context menu with Electron

The context menu has two items:
* Open: Open an HTML file to edit
* Save: Save updates on file on the user's computer.

```javascript
const electron = require('electron');
const Menu = electron.remote.Menu;
const MenuItem = electron.remote.MenuItem;
const ipc = electron ipcRenderer;
const dialog = electron.remote.dialog;
const designMenu = require('./designMenu');
let currentFile;
let content;
let tabWas;
let done;
```

Code for opening files from the UI:
```javascript
function openFile(cb) {
  dialog.showOpenDialog((files) => {
    ipc.send('readFile', files);
    if (files) currentFile = files[0];
    if (cb && typeof cb === 'function') cb();
  })
}
```

Code for opening files from the back end.
```javascript
'use strict';

const electron = require('electron');
const fs = require('fs');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow();
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => { mainWindow = null; });
});

function readFile(event, files) {
  if (files) {
    const filePath = files[0];
    fs.readFile(filePath, 'utf8', (err, data) => {
      event.sender.send('fileRead', err, data);
    });
  }
};

function saveFile(event, currentFile, content) {
  fs.writeFile(currentFile, content, (err) => {
    event.sender.send('fileSaved', err);
  });
}

ipc.on('readFile', readFile);
ipc.on('saveFile', saveFile);
```

### Adding the context menu with Electron

designMenu.js file:
```javascript
function initialize() {
  const menu = new Menu();
  menu.append(new MenuItem({ label: 'Insert image', click: insertImage }));
  menu.append(new MenuItem({ label: 'Insert video', click: insertVideo }));
  document.querySelector('#designArea')
    .addEventListener('contextMenu', function(event) {
      event.preventDefault();
      x = event.x;
      y = event.y;
      menu.popup(x, y);
      return false;
    });
}
```

# Dragging and dropping files and crafting the UI

## Dragging and dropping files onto the app

### Implementing drag-and-drop with Electron

You can reuse code written for websites and apps to build desktop apps, saving time when you add drag-and-drop to your desktop apps.

Capture any attempts to drag-and-drop a file onto the screen area:
```javascript
function stopDefaultEvent(event) {
  event.preventDefault();
  return false;
}
window.ondragover = stopDefaultEvent;
window.ondrop = stopDefaultEvent;
```

Create a function to intecept the events:
```javascript
function interceptDroppedFiles() {
  const interceptArea = window.document.querySelector('#load-icon-holder');
  interceptArea.ondrop = function(event) {
    event.preventDefault();
    if (event.dataTransfer.files.length !== 1) {
      window.alert('You have dragged too many files into the app. Drag just 1 file.');
    } else {
      interceptArea.style.display = 'none';
      displayIconsSet();
      const file = event.dataTransfer.files[0];
      displayImageInIconSet(file.path);
    }
    return false;
  }
}
```

## Mimicking the native look of the OS

### Detecting the user's OS

```javascript
'use strict';

const os = require('os');
const platform = os.platform();

switch(platform) {
  case 'darwin':
    console.log('Running Mac OS');
    break;
  case 'linux':
    console.log('Running Linux');
    break;
  case 'win32':
    console.log('Running Windows');
    break;
  default:
    console.log('Could not detect OS for platform', platform);
}
```

There are some Style Libraries that mimics OS styles:
* Mac OS Photon: http://photonkit.com/
* React Desktop: http://reactdesktop.js.org/

# Using a webcam in your application

With the introduction of the HTML5 Media Capture API, webcams can be accessible to web pages.

## Photo snapping with the HTML5 media capture API

Example with Electron: https://github.com/paulbjensen/cross-platform-desktop-applications/tree/master/chapter-11/facebomb-electron

### Creating Facebomb with Electron

The main.js file for the Facebomb Electron app:
```javascript
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  // useContentSize ensures the width and height refers to the content of the app window
  // and not the entire app window
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 800,
    height: 600,
    resizable: false,
    fullscreen: false
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => { mainWindow = null; });
})
```

The index.html file for the Facebomb Electron app:
```html
<html>
  <head>
    <title>Facebomb</title>
    <link href="app.css" rel="stylesheet" />
    <link rel="stylesheet" href="css/font-awesome.min.css" />
    <script src="app.js"></script>
  </head>
  <body>
    <canvas width="800" height="600"></canvas>
    <video autoplay></video>
    <div id="takePhoto" onClick="takePhoto()">
      <i class="fa fa-camera" aria-hidden="true"></i>
    </div>
  </body>
</html>
```

Electron handles dialog windows differently than NW.js.

The dependencies in the app.js file:
```javascript
'use strict';

const electron = require('electron');
const dialog = electron.remote.dialog;
const fs = require('fs');
let photoData;
let video;

function savePhoto(filePath) {
  if (filePath) {
    fs.writeFile(filePath, photoData, 'base64', (err) => {
      if (err) {
        alert(`There was a problem saving the photo: ${err.message}`);
      }
      photoData = null;
    });
  }
}
```

The app.js file's initialize function:
```javascript
function initialize() {
  video = window.document.querySelector('video');
  let errorCallback = (error) => {
    console.log(`There was an error connecting to the video stream: ${error.message}`);
  };
  window.navigator.webkitGetUserMedia({ video: true }, (localMediaStream) => {
    video.src = window.URL.createObjectURL(localMediaStream);
  }, errorCallback);
}
```

Finally, let's take a look at the takePhoto function and the window.onload event binding that makes up the rest of the app.js file.
```javascript
function takePhoto() {
  let canvas = window.document.querySelector('canvas');
  canvas.getContext('2d').drawImage(video, 0, 0, 800, 600);
  photoData = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  dialog.showSaveDialog({
    title: "Save the photo",
    defaultPath: 'myfacebomb.png',
    buttonLabel: 'Save photo'
  }, savePhoto);
}
window.onload = initialize;
```

The `takePhoto` function directly triggers the rendering of the Save File dialog window.

https://electron.atom.io/docs/api/dialog/

# Storing app data

## What data store option should I use?

Storing data in web apps:
* IndexedDB: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
* localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
* Lovefield: https://github.com/google/lovefield
* PouchDB: https://pouchdb.com/
* SQLite: http://sqlite.com/
* NeDB: https://github.com/louischatriot/nedb/
* LevelDB: http://leveldb.org/
* Minimongo: https://github.com/mWater/minimongo

* Relational databases: Data won't change much, powerful querying capabilities.
* Browser-based API: no more than 5MB of data like user settings.
* SQL-based or NoSQL-based: The design of the data schemas and whether the data is denormalized or not will go some way toward helping you choose between them.

## Storing a sticky note with the localStorage API

https://github.com/paulbjensen/cross-platform-desktop-applications/tree/master/chapter-12/let-me-remember-electron

```
$ mkdir let-me-remember
$ cd let-me-remember
$ npm init -y
$ npm i electron --save
$ touch main.js
$ touch index.html
$ touch app.css
$ touch app.js
```

The package.json file content:
```json
{
  "name": "let-me-remember",
  "version": "1.0.0",
  "description": "A sticky note app for Electron",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "keywords": [
    "electron"
  ],
  "author": "Cintia Higashi",
  "license": "ISC",
  "dependencies": {
    "electron": "^1.7.6"
  }
}
```

main.js content:
```javascript
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 320,
    frame: false,
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => { mainWindow = null; });
});
```

The app.js file content:
```javascript
'use strict';

const electron = require('electron');
const app = electron.remote.app;

function initialize() {
  let notes = window.localStorage.notes;
  if (!notes) notes = 'Let me remember...';
  window.document.querySelector('textarea').value = notes;
}

function saveNote() {
  let notes = window.document.querySelector('textarea').value;
  window.localStorage.setItem('notes', notes);
}

function quit() {
  app.quit();
}

window.onload = initialize;
```

The index.html file content:
```html
<html>
  <head>
    <title>Let me remember</title>
    <link rel="stylesheet" type="text/css" href="app.css" />
    <script src="app.js"></script>
  </head>
  <body>
    <div id="close" onclick="quit();">X</div>
    <textarea onKeyUp="saveNotes();"></textarea>
  </body>
</html>
```

# Copying and pasting contents from the clipboard

## Accessing the clipboard

The clipboard API in Electron allow you to store and retrieve text-based data to and from the clipboard.

### Creating a Pearls app with Electron

```
$ mkdir pearls-electron
$ cd pearls-electron
$ npm init -y
$ npm i electron --save
$ touch main.js
$ touch index.html
$ touch app.css
$ touch app.js
$ touch phrases.js
```

package.json file content:
```json
{
  "name": "pearls-electron",
  "version": "1.0.0",
  "description": "A clipboard API example for Electron and the book 'Cross Platform Desktop apps'",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["electron", "clipboard"],
  "author": "Cintia Higashi",
  "license": "ISC",
  "dependencies": {
    "electron": "^1.7.6"
  }
}
```

The main.js file content is pretty standard:
```javascript
'use strict';

const electron = require('electron');
const app = electron. app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 670,
    height: 550,
    useContentSize: true
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => { mainWindow = null; });
});
```

index.html file content:
```html
<html>
  <head>
    <title>Pearls</title>
    <link href="app.css" rel="stylesheet" />
    <script src=" app.js"></script>
  </head>
  <body>
    <template id="phrase">
      <div class="phrase" onclick="copyPhraseToClipboard(this.innerText);"></div>
    </template>
    <div id="phrases"></div>
  </body>
</html>
```

And finally the app.js file:
```javascript
'use strict';

const electron = require('electron');
// Loads Electron's clipboard API
const clipboard = electron.clipboard;
const phrases = require('./phrases');

let phrasesArea;
let template;

function addPhrase(phrase) {
  template.content.querySelector('div').innerText = phrase;
  let clone = window.document.importNode(template.content, true);
  phrasesArea.appendChild(clone);
}

function loadPhrasesInto() {
  phrasesArea = window.document.getElementById('phrases');
  template = window.document.querySelector('#phrase');
  phrases.forEach(addPhrase);
}

function copyPhraseToClipboard(phrase) {
  clipboard.writeText(phrase);
}

window.onload = loadPhrasesInto;
```

To put some text content in the clipboard:
```javascript
clipboard.writeText(phrase);
```

To read the content in the clipboard:
```javascript
const content = clipboard.readText();
```

To clear the clipboard's content:
```javascript
clipboard.clear();
```

### Setting other types of content to the clipboard with Electron

https://electron.atom.io/docs/api/clipboard/

* Text
* HTML
* Images
* RTF

```javascript
const electron = require('electron');
const clipboard = electron.clipboard;

let image = clipboard.readImage();
let richText = clipboard.readRTF();
let html = clipboard.readHTML();

clipboard.writeImage(image);
clipboard.writeRTF(richText);
clipboard.writeHTML(html);
```

# Binding on keyboard shortcuts

You can use the `document.onkeydown` event to listen for keystrokes in an app, as you would in a web page.

## Creating Global shortcuts with Electron

The `globalShortcut` API is available from the main process in Electron, so you require it from the main.js file and then use it to register a keyboard shortcut.

Once the module is required, you're able to add and remove keyboard shortcuts by calling the register and unregister API methods.

Electron is smart enough to detect which OS the app is running on and use the appropriate keyboard shortcut (Command or Ctrl).

```javascript
'use strict';
const { app, globalShortcut, BrowserWindow } = require('electron');
let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 840,
    height: 470,
    userContentSize: true,
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => { mainWindow = null; });
  // Registers the keyboard shortcut
  const pauseKey = globalShortcut.register('CommandOrControl+P', () => {
    // emits event to app window
    mainWindow.webContents.send('togglePauseState');
  });
  // If you couldn't register keyboard shortcut, alerts user
  if (!pauseKey) alert('You will not be able to pause the game from the keyboard')
});

app.on('will-quit', () => {
  globalShortcut.unregister('CommandOrControl+P');
})
```

We are going to use the webContents module to send a message to the app.js window so the message can be received by the renderer process and acted on.

```javascript
const ipcRenderer = require('electron').ipcRenderer;

// Function to trigger when keyboard shortcut is pressed
function togglePauseState() {
  if (currentState) {
    if (currentState === 'play') {
      pause();
      currentState = 'pause';
    } else {
      play();
      currentState = 'play';
    }
  } else {
    pause();
    currentState = 'play';
  }
}

// When message with event name 'togglePauseState' is received, triggers that function.
ipcRenderer.on('togglePauseState', togglePauseState);
```

Learn more: https://electron.atom.io/docs/api/global-shortcut/

# Making desktop notifications

https://github.com/paulbjensen/cross-platform-desktop-applications/tree/master/chapter-15/watchy-electron

You'll have to install `electron`, `electron-notifications`

https://github.com/blainesch/electron-notifications

main.js file:
```javascript
'use strict';

const {app, ipcMain, BrowserWindow} = require('electron');
const notifier = require('electron-notifications');
var config = require('./config');
var Twitter = require('twitter');
var client = new Twitter(config);

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('monitorTerm', (event, term) => {
  client.stream('statuses/filter', {track: term}, (stream) => {
	  stream.on('data', (tweet) => {
      // When you receive tweet with term, creates notification with its contents.
      let notification = notifier.notify('New tweet', {
        icon: tweet.user.profile_image_url,
        message: tweet.text
      });
    });
		stream.on('error', (error) => {
		  console.log(error.message);
	  });
	});
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 370,
    height: 90,
    useContentSize: true
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => { mainWindow = null; });
});
```
