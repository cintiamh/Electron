# Welcome to Node.js desktop application development

* [Introducing Electron and NW.js](#introducing-electron-and-nwjs)
* [Laying the foundation for your first desktop application](#laying-the-foundation-for-your-first-desktop-application)
* [Building your first desktop application](#building-your-first-desktop-application)
* [Shipping your first Desktop application](#shipping-your-first-desktop-application)

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

1. Add a search field to the top right of the toolbar.
2. Add an in-memory search library.
3. Add the list of files and folders in the current folder to the search index.
4. When the user begins searching, filter the files displayed in the main area.

#### Adding the search field in the toolbar

Include the search field after the current path:

```html
<input type="search" id="search" results="5" placeholder="Search" />
```

And some CSS:
```css
#search {
  float: right;
  padding: 0.5em;
  min-width: 10em;
  border-radius: 3em;
  margin: 2em 1em;
  border: none;
  outline: none;
}
```

#### Adding an in-memory search library

Install lunr.js:
```
$ npm i lunr --save
$ touch search.js
```

search.js file:
```javascript
'use strict';

const lunr = require('lunr');
let index;

function resetIndex() {
  index = lunr(function() {
    this.field('file');
    this.field('type');
    this.ref('path');
  });
}

function addToIndex(file) {
  index.add(file);
}

function find(query, cb) {
  if (!index) {
    resetIndex();
  }
  const results = index.search(query);
  cb(results);
}

module.exports = { addToIndex, find, resetIndex };
```

#### Hooking up the search functionality with the UI

userInterface.js
```javascript
function bindSearchField(cb) {
  document.getElementById('search').addEventListener('keyup', cb, false);
}

module.exports = {
  ...,
  bindSearchField
}
```

Include the search as dependency in userInterface.js:
```javascript
'use strict';

let document;
const fileSystem = require('./fileSystem');
const search = require('./search');
```

Include the loadDirectory function:
```javascript
function loadDirectory(folderPath) {
  return function(window) {
    if (!document) {
      document = window.document;
    }
    search.resetIndex();
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
```

Include the displayField function:
```javascript
function displayFile(file) {
  const mainArea = document.getElementById('main-area');
  const template = document.querySelector('#item-template');
  let clone = document.importNode(template.content, true);
  search.addToIndex(file);
  clone.querySelector('img').src = `images/${file.type}.svg`;
  // Attaches file's path as data attribute to image element.
  clone.querySelector('img').setAttribute('data-filePath', file.path);
  if (file.type === 'directory') {
    clone.querySelector('img').addEventListener('dblclick', () => {
      loadDirectory(file.path)();
    }, false);
  }
  clone.querySelector('.filename').innerText = file.file;
  mainArea.appendChild(clone);
}
```

Update the filterResults and resetFilter functions:
```javascript
function filterResults(results) {
  // Collects file paths for search results so you can compare them
  const validFilePaths = results ? results.map((result) => result.ref) : [];
  const items = document.getElementsByClassName('item');
  for (var i = 0; i < items.length; i++) {
    let item = items[i];
    let filePath = item.getElementsByTagName('img')[0].getAttribute('data-filePath');
    if (validFilePaths.indexOf(filePath) !== -1) {
      item.style = null;
    } else {
      item.style = 'display: none;'
    }
  }
}

function resetFilter() {
  const items = document.getElementsByClassName('item');
  for (var i = 0; i < items.length; i++) {
    items[i].style = null;
  }
}
```

Update the app.js file:
```javascript
'use strict';

const fileSystem = require('./fileSystem');
const userInterface = require('./userInterface');
const search = require('./search');

function main() {
  userInterface.bindDocument(window);
  const folderPath = fileSystem.getUserHomeFolder();
  userInterface.loadDirectory(folderPath)(window);
  userInterface.bindSearchField((event) => {
    const query = event.target.value;
    if (query === '') {
      userInterface.resetFilter();
    } else {
      search.find(query, userInterface.filterResults);
    }
  })
}
window.onload = main;
```

### Enhancing navigation in the app

#### Making the current folder path clickable

Import the path module into userInterface.js:
```javascript
const path = require('path');
```

Create a convertFolderPathIntoLinks function:
```javascript
function convertFolderPathIntoLinks(folderPath) {
  const folders = folderPath.split('path.sep');
  const contents = [];
  let pathAtFolder = '';
  folders.forEach((folder) => {
    pathAtFolder += folder + path.sep;
    contnts.push(`<span class="path" data-path="${pathAtFolder.slice(0, -1)}">${folder}</span>`);
  });
  return contents.join(path.sep).toString();
}
```

Also have a bindCurrentFolderPath function:
```javascript
function bindCurrentFolderPath() {
  const load = (event) => {
    const folderPath = event.target.getAttribute('data-path');
    loadDirectory(folderPath)();
  };
  const paths = document.getElementsByClassName('path');
  for (var i = 0; i < paths.length; i++) {
    paths[i].addEventListener('click', load, false);
  }
}
```

And change the displayFolderPath function:
```javascript
function displayFolderPath(folderPath) {
  document.getElementById('current-folder').innerHtml = convertFolderPathIntoLinks(folderPath);
  bindCurrentFolderPath();
}
```

#### Getting the app to load at the folder path

Small change on app.css file:
```css
span.path:hover {
  opacity: 0.7;
  cursor: pointer;
}
```

#### Opening files with their default application

Updating displayFile method in userInterface.js file:
```javascript
function displayFile(file) {
  const mainArea = document.getElementById('main-area');
  const template = document.querySelector('#item-template');
  let clone = document.importNode(template.content, true);
  search.addToIndex(file);
  clone.querySelector('img').src = `images/${file.type}.svg`;
  // Attaches file's path as data attribute to image element.
  clone.querySelector('img').setAttribute('data-filePath', file.path);
  if (file.type === 'directory') {
    clone.querySelector('img').addEventListener('dblclick', () => {
      loadDirectory(file.path)();
    }, false);
  } else {
    clone.querySelector('img').addEventListener('dblclick', () => {
      fileSystem.openFile(file.path);
    }, false);
  }
  clone.querySelector('.filename').innerText = file.file;
  mainArea.appendChild(clone);
}
```

Update fileSystem.js file (include the following snipped on the top):
```javascript
let shell;

if (process && process.versions && process.versions.electron) {
  shell = require('electron').shell;
} else if (window) {
  shell = window.require('nw.gui').Shell;
}

// ...

function openFile(filePath) {
  shell.openItem(filePath);
}

module.exports = {
  // ...
  openFile
};
```

## Shipping your first Desktop application

### Setting up the app for distribution

* Getting the app to display a custom icon in place of the default app.
* Creating native binaries of the app for the different OSs.
* Testing those apps out on the various platforms.

#### Creating the app icon

The first step is to create an app icon as a high-resolution PNG at 512x512 pixels.

##### MacOS

MacOS uses the ICNS file format for app icons.

* 16px
* 32px
* 128px
* 256px
* 512px

You can use "iConvert Icons" app for MacOS.
You can also download Icon Composer for free.

##### Windows

Microsoft Windows uses the ICO file format for its icons.

##### Linux

The .desktop file is a configuration file that contains details about what the app name is, where it runs from, what icon it has, and some other configuration information.

### Packaging the app for distribution

```
$ npm install electron-builder electron --save-dev
```

You install electron-builder and electron as development dependencies for the app.

In order to make electron-builder work, you need to check that the package.json file has the following fields:

* name
* description
* version
* author
* build configuration
* scripts for packaging and distribution

package.json
```javascript
{
  "name": "lorikeet",
  "version": "1.0.0",
  "description": "A file explorer application",
  "main": "index.js",
  "author": "Cintia Higashi <cintiamh@gmail.com>",
  "scripts": {
    "pack": "build",
    "dist": "build",
    "dev": "electron ."
  },
  "build": {},
  "keywords": [],
  "license": "ISC",
  "devDependencies": {
    "electron": "^1.7.5",
    "electron-builder": "^19.24.1"
  },
  "dependencies": {
    "async": "^2.5.0",
    "lunr": "^1.0.0",
    "osenv": "^0.1.4"
  }
}
```

In order to build run:
```
$ npm run pack
```

This will start the build and the build can be found inside a folder called dist.

For more build options read:

https://github.com/electron-userland/electron-builder/wiki/Options

#### Setting the app icon on the apps
