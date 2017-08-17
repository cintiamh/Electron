# Welcome to Node.js desktop application development

## Introducing Electron and NW.js

* Electron (GitHub)
* NW.js (Intel and Gnor Tech)

### Why build Node.js desktop applications?

#### Desktop to web and back

* Build desktop apps using the same code used for web apps.
* Desktop apps across Windows, Mac OS, and Linux.
* Use Node.js packages.

#### What Node.js desktop apps offer over web apps

* Internet access is not always available.
* An app with a lot of features can become slow to load.
* Working with large files, like videos. (no need to upload on the web first)
* Limits on what the browser can do with local files.
* You have to handle the CSS behavior for each browser.

### The origins of NW.js and Electron

node-webkit => NW.js
          |=> Atom Shell => Electron

### Introducing NW.js

NW.js combines Node.js with Chromium.

It supports HTML, CSS and JavaScript inside an app window and interactions with the OS via a JavaScript API.

The JavaScript API can control:
* window dimensions,
* toolbar,
* menu items,
* access to local files on desktop,
* etc

#### A Hello World app in NW.js

https://github.com/paulbjensen/cross-platform-desktop-applications/tree/master/chapter-01/hello-world-nwjs

##### Installing NW.js

```
$ npm i -g nw
```

##### Creating the Hello World app

Minimum requirements:

* `package.json` file.
* `index.html` file.

package.json file:
```javascript
{
  "name": "hello-world-nwjs",
  "main": "index.html",
  "version": "1.0.0"
}
```

And a regular index.html page file.

Then run inside the folder containing all your files:
```
$ nw
```

In an NW.js app, the app window is essentially like an embedded web browser, but with the distinct difference that the code inside the web page has access to the computer's resources and can execute server-side code.

Available npm packages:
* https://github.com/nw-cn/awesome-nwjs
* https://github.com/sindresorhus/awesome-electron

### Introducing Electron

Electron allows you to build cross-platform desktop apps using HTML, CSS, and JavaScript.

#### How does Electron work and differ from NW.js?

* NW.js: Node.js and Chromium are sharing the same JavaScript context.
  * NW.js usually uses an HTML file as the entry point for loading a desktop app.
* Electron: Chromium is combined with Node.js through Chromium's content API and uses Node.js's `node_bindings`.
  * Electron uses a JavaScript file as the entry point for loading a desktop app.

Electron has separate JavaScript contexts:
* back-end process (main process)
* one for each app window (renderer process).

#### A Hello World app in Electron

https://github.com/paulbjensen/cross-platform-desktop-applications/tree/master/chapter-01/hello-world-electron

```
$ npm install -g electron
```

Bare minimum required files:
* index.html
* main.js
* package.json

To execute the app:
```
$ electron .
```

## Laying the foundation for your first desktop application

### What we're going to build

A file explorer in both NW.js and Electron

#### Introducing Lorikeet, the file explorer

Goals:
* Allow users to browse folders and find files
* Allow users to open the file(s) with their default app

```
$ mkdir lorikeet
$ cd lorikeet
$ npm init -y
$ npm i electron --save-dev
$ touch index.js
$ touch index.html
```

And include in package.json:
```javascript
"scripts": {
  "build": "electron ."
},
```

lorikeet/index.js
```javascript
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow();
  mainWindow.loadURL(`file://${app.getAppPath()}/index.html`);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
```

lorikeet/index.html
```html
<html>
  <head>
    <title>Lorikeet</title>
  </head>
  <body>
    <h1>Welcome to Lorikeet</h1>
  </body>
</html>
```

And then run:
```
$ npm run build
```

#### Displaying the user's personal folder in the toolbar

```
$ touch app.css
```

lorikeet/app.cs
```css
body {
     padding: 0;
     margin: 0;
     font-family: 'Helvetica','Arial','sans';
}

#toolbar {
     position: absolute;
     background: red;
     width: 100%;
     padding: 1em;
}

#current-folder {
     float: left;
     color: white;
     background: rgba(0,0,0,0.2);
     padding: 0.5em 1em;
     min-width: 10em;
     border-radius: 0.2em;
}
```

lorikeet/index.html
```html
<html>
  <head>
    <title>Lorikeet</title>
    <link rel="stylesheet" href="app.css" />
  </head>
  <body>
    <div id="toolbar">
      <div id="current-folder"></div>
    </div>
  </body>
</html>
```

##### Discovering the user's personal folder with Node.js

```
$ npm i osenv --save
```

With the osenv module installed, you now want to load the user's personal folder and display it in the personal folder UI element in index.html file.

```html
<html>
  <head>
    <title>Lorikeet</title>
    <link rel="stylesheet" href="app.css" />
  </head>
  <body>
    <div id="toolbar">
      <div id="current-folder">
        <script>
          document.write(require('osenv').home());
        </script>
      </div>
    </div>
  </body>
</html>
```

#### Showing user's files and folders in the UI

```
$ touch app.js
```

Content for app.js:
```javascript
'use strict';

const osenv = require('osenv');
const fs = require('fs');

function getUserHomeFolder() {
  return osenv.home();
}

function getFilesInFolder(folderPath, cb) {
  fs.readdir(folderPath, cb);
}

function main() {
  const folderPath = getUserHomeFolder();
  getFilesInFolder(folderPath, (err, files) => {
    if (err) {
      return alert('Sorry, we could not load your home folder');
    }
    files.forEach((file) => {
      console.log(`${folderPath}/${file}`);
    });
  });
}

main();
```

Include app.js into index.html
```html
<html>
  <head>
    <title>Lorikeet</title>
    <link rel="stylesheet" href="app.css" />
    <script src="app.js"></script>
  </head>
  <body>
    <div id="toolbar">
      <div id="current-folder">
        <script>
          document.write(getUserHomeFolder());
        </script>
      </div>
    </div>
  </body>
</html>
```

You can run the build and in the menu select View > Toggle Developer Tools to check out the console.logs.

```
$ npm install async --save
```

And update app.js:
```javascript
'use strict';

const async = require('async');
const fs = require('fs');
const osenv = require('osenv');
const path = require('path');

function getUserHomeFolder() {
  return osenv.home();
}
function getFilesInFolder(folderPath, cb) {
  fs.readdir(folderPath, cb);
}
function inspectAndDescribeFile(filePath, cb) {
  let result = {
    file: path.basename(filePath),
    path: filePath,
    type: ''
  };
  fs.stat(filePath, (err, stat) => {
    if (err) {
      cb(err);
    } else {
      if (stat.isFile()) {
        result.type = 'file';
      }
      if (stat.isDirectory()) {
        result.type = 'directory';
      }
      cb(err, result);
    }
  });
}
function inspectAndDescribeFiles(folderPath, files, cb) {
  async.map(files, (file, asyncCb) => {
    let resolvedFilePath = path.resolve(folderPath, file);
    inspectAndDescribeFile(resolvedFilePath, asyncCb);
  }, cb);
}
function displayFiles(err, files) {
  if (err) {
    return aler('Sorry, we could not display your files');
  }
  files.forEach((file) => {
    console.log(file);
  });
}
function main() {
  const folderPath = getUserHomeFolder();
  getFilesInFolder(folderPath, (err, files) => {
    if (err) {
      return alert('Sorry, we could not load your home folder');
    }
    inspectAndDescribeFiles(folderPath, files, displayFiles);
  });
}

main();
```

Now we should have some objects displaying on console.log().

##### Visually displaying the files and folders

You'll use an HTML template for each file and then render an instance of that template to the UI.

Download images for file and directory:
* https://openclipart.org/detail/137155/folder-icon
* https://openclipart.org/detail/83893/file-icon

Include template and main area on html file:
```html
<html>
  <body>
    <template id="item-template">
      <div class="item">
        <img class="icon" />
        <div class="filename"></div>
      </div>
    </template>
    <div id="toolbar">
      <!-- ... -->
    </div>
    <div id="main-area"></div>
  </body>
</html>
```

Include css styles for the folder and files:
```css
body {
  padding: 0;
  margin: 0;
  font-family: 'Helvetica','Arial','sans';
}

#toolbar {
  top: 0px;
  position: fixed;
  background: red;
  width: 100%;
  z-index: 2;
}

#current-folder {
  float: left;
  color: white;
  background: rgba(0,0,0,0.2);
  padding: 0.5em 1em;
  min-width: 10em;
  border-radius: 0.2em;
  margin: 1em;
}

#main-area {
  clear: both;
  margin: 2em;
  margin-top: 3em;
  z-index: 1;
}

.item {
  position: relative;
  float: left;
  padding: 1em;
  margin: 1em;
  width: 6em;
  height: 6em;
  text-align: center;
}

.item .filename {
  padding: 1em;
  font-size: 10pt;
}
```

And the app.js content:
```javascript
'use strict';
// ...
function displayFile(file) {
  const mainArea = document.getElementById('main-area');
  const template = document.querySelector('#item-template');
  let clone = document.importNode(template.content, true);
  clone.querySelector('img').src = `images/${file.type}.svg`;
  clone.querySelector('.filename').innerText = file.file;
  mainArea.appendChild(clone);
}
function displayFiles(err, files) {
  if (err) {
    return alert('Sorry, we could not display your files');
  }
  files.forEach(displayFile);
}
// ...
main();
```

## Building your first desktop application

### Exploring the folders

#### Refactoring the code

We can break app.js into smaller parts:

* app.js
* fileSystem.js
* userInterface.js

```
$ touch fileSystem.js
$ touch userInterface.js
```

fileSystem.js:
```javascript
'use strict';

const async = require('async');
const fs = require('fs');
const osenv = require('osenv');
const path = require('path');

function getUserHomeFolder() {
  return osenv.home();
}

function getFilesInFolder(folderPath, cb) {
  fs.readdir(folderPath, cb);
}

function inspectAndDescribeFile(filePath, cb) {
  let result = {
    file: path.basename(filePath),
    path: filePath,
    type: ''
  };
  fs.stat(filePath, (err, stat) => {
    if (err) {
      cb(err);
    } else {
      if (stat.isFile()) {
        result.type = 'file';
      }
      if (stat.isDirectory()) {
        result.type = 'directory';
      }
      cb(err, result);
    }
  });
}

function inspectAndDescribeFiles(folderPath, files, cb) {
  async.map(files, (file, asyncCb) => {
    let resolvedFilePath = path.resolve(folderPath, file);
    inspectAndDescribeFile(resolvedFilePath, asyncCb);
  }, cb);
}

module.exports = {
  getUserHomeFolder,
  getFilesInFolder,
  inspectAndDescribeFiles
};
```

userInterface.js:
```javascript
'use strict';

let document;

function displayFile(file) {
  const mainArea = document.getElementById('main-area');
  const template = document.querySelector('#item-template');
  let clone = document.importNode(template.content, true);
  clone.querySelector('img').src = `images/${file.type}.svg`;
  clone.querySelector('.filename').innerText = file.file;
  mainArea.appendChild(clone);
}

function displayFiles(err, files) {
  if (err) {
    return aler('Sorry, we could not display your files');
  }
  files.forEach(displayFile);
}

function bindDocument(window) {
  if (!document) {
    document = window.document;
  }
}

module.exports = {
  bindDocument,
  displayFiles
};
```

app.js:
```javascript
'use strict';

const fileSystem = require('./fileSystem');
const userInterface = require('./userInterface');

function main() {
  userInterface.bindDocument(window);
  const folderPath = fileSystem.getUserHomeFolder();
  fileSystem.getFilesInFolder(folderPath, (err, files) => {
    if (err) {
      return alert('Sorry, we could not load your home folder');
    }
    fileSystem.inspectAndDescribeFiles(folderPath, files, userInterface.displayFiles);
  });
}

main();
```

index.html
```html
<html>
  <head>
    <title>Lorikeet</title>
    <link rel="stylesheet" href="app.css" />
    <script src="app.js"></script>
  </head>
  <body>
    <template id="item-template">
      <div class="item">
        <img class="icon" />
        <div class="filename"></div>
      </div>
    </template>
    <div id="toolbar">
      <div id="current-folder">
        <script>
          document.write(fileSystem.getUserHomeFolder());
        </script>
      </div>
    </div>
    <div id="main-area"></div>
  </body>
</html>
```

#### Handling double-clicks on folders

userInterface.js:
```javascript
'use strict';

let document;
const fileSystem = require('./fileSystem');

function displayFolderPath(folderPath) {
  document.getElementById('current-folder').innerText = folderPath;
}

function clearView() {
  const mainArea = document.getElementById('main-area');
  let firstChild = mainArea.firstChild;
  while (firstChild) {
    mainArea.removeChild(firstChild);
    firstChild = mainArea.firstChild;
  }
}

function loadDirectory(folderPath) {
  return function(window) {
    if (!document) {
      document = window.document;
    }
    displayFolderPath(folderPath);
    fileSystem.getFilesInFolder(folderPath, (err, files) => {
      clearView();
      if (err) {
        return alert('Sorry, you could not load your folder');
      }
      fileSystem.inspectAndDescribeFiles(folderPath, files, displayFiles);
    })
  }
}

function displayFile(file) {
  const mainArea = document.getElementById('main-area');
  const template = document.querySelector('#item-template');
  let clone = document.importNode(template.content, true);
  clone.querySelector('img').src = `images/${file.type}.svg`;
  if (file.type === 'directory') {
    clone.querySelector('img').addEventListener('dblclick', () => {
      loadDirectory(file.path)();
    }, false);
  }
  clone.querySelector('.filename').innerText = file.file;
  mainArea.appendChild(clone);
}

function displayFiles(err, files) {
  if (err) {
    return alert('Sorry, we could not display your files');
  }
  files.forEach(displayFile);
}

function bindDocument(window) {
  if (!document) {
    document = window.document;
  }
}

module.exports = {
  bindDocument,
  displayFiles,
  loadDirectory
};
```

Updating app.js
```javascript
'use strict';

const fileSystem = require('./fileSystem');
const userInterface = require('./userInterface');

function main() {
  userInterface.bindDocument(window);
  const folderPath = fileSystem.getUserHomeFolder();
  userInterface.loadDirectory(folderPath)(window);
}
window.onload = main;
```

update the current-folder div inside index.html
```html
<div id="current-folder"></div>
```

### Implementing Quick Search
