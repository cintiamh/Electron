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
