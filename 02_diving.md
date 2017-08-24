# Diving Deeper

# Using Node.js within NW.js and Electron

## What is Node.js?

Node.js is a programming framework that combines V8 (a JavaScript engine) with libuv, a library that provides access to the OS libraries in an asynchronous fashion.

Because of this, JavaScript code is executed by Node.js in such a way that code executing on one line doesn't block the execution of the code on the next line.

### Synchronous versus asynchronous

* Synchronous programming: each operation waits on the previous operation to complete.
* Asynchronous programming: multiple tasks can run in parallel, and the project completes faster as a result.

Asynchronous example running in Node.js:
```javascript
const fs = require('fs');
// The second parameter is a callback that will run when readdir is finished
fs.readdir('/Users/cintiamh', (err, files) => {
  if (err) {
    return err.message;
  }
  console.log(files.length);
});
console.log('hi');
```

It will output:
```
hi
56
```

### Streams as first-class citizens

Node.js encourages you to use streams as a method of handling data within your apps.

Sometimes loading entire files into memory can become problematic.
You can use streams to load the file, a bit at a time.

Streaming a book's contents example:
```javascript
const fs = require('fs');
// Creates readable stream of book file
const filePath = '/Users/cintiamh/Desktop/Frank-Herbert-Dune.rtfd/TXT.rtf';
const fileReader = fs.createReadStream(filePath, { encoding: 'utf-8' });
let termFound = false;
// For each chunck of data checks if there's a match for that term
fileReader.on('data', (data) => {
  if (data.match(/history will call you wives/) !== null) {
    termFound = true;
  }
});
// After reading the file, reports errors or whether term was found
fileReader.on('end', (err) => {
  if (err) {
    return err;
  }
  console.log('Term found: ', termFound);
});
```

Streaming the contents of a file with fs.createReadStream completes faster than attempting to read the contents of a file with fs.readFile.

Using timestamps:

```javascript
// Records a timestamp
const startTime = process.hrtime();
// Process stuff

const diff = process.hrtime(startTime);
console.log('benchmark took %d nanoseconds', diff[0] * 1e9 + diff[1]);
```

### Events

Node.js makes use of event loops.

Node.js provides a library for creating your own event interfaces using the EventEmitter module.

```javascript
const greeter = new events.EventEmitter();
greeter.on('welcome', function() {
  console.log('Hello');
});
greeter.emit('welcome');
```

### Modules

Node.js uses a module format called CommonJS.

#### Creating public API methods with module.exports

To make functions, objects, and other values publicly available in a JavaScript file, the developer has to use either `exports` or `module.exports`.

```javascript
// If you want to make a publicly available function on the file:
exports.applyDiscount = applyDiscount;
// Or this:
module.exports = {
  applyDiscount: applyDiscount
};
// Or if the file has only one function:
module.exports = applyDiscount;
```

These methods don't have to expose only function or objects; they can be used to export any kind of value in JavaScript.

#### Loading libraries via require

```javascript
// local file:
const discount = require('./discount');
// load modules:
const os = require('os');
```

Node.js has some core modules you can use: https://nodejs.org/api/

There is also the ability to install and use modules via npm. https://www.npmjs.com/

## Node package manager (npm)

### Finding packages for your app

### Tracking installed modules with package.json

npm uses a manifest file called package.json.

Create a package.json file:
```
$ npm init
```

Install and track the dependencies:
```
$ npm install lodash --save
```

Install development-only dependencies:
```
$ npm install mocha --save-dev
```

Install dependencies from existing project with package.json file:
```
$ npm install
```

### Packaging your modules and apps with npm

Successful npm module: how easy is it for other developers to install and get running on their local development machine.

#### Controlling dependency versions in package.json

npm's shrinkwrap command will lock down the version of dependencies that are installed with the module.

```
$ npm shrinkwrap
```

* Keep dependencies in the package.json file up to date,
* keep node_modules folder out of version control,
* when needed use npm shrinkwrap to lock down the dependencies in use.

#### Publishing applications and modules to npm

* Create a free account (npmjs.com),
* `npm login`
* `npm publish` => This will push a copy of the module up to npm, and you'll be able to install it via npm install.

# Exploring NW.js and Electron's internals

Both combines Node.js with Chromium, but took different approaches.

## How does NW.js work under the hood?

Three things necessary for Node.js and Chromium to work together:
* Make Node.js and Chromium use the same instance of V8.
* Integrate the main event loop.
* Bridge the JavaScript context between Node and Chromium.

Name history:
* WebKit => Blink
* Node.js => IO.js => Node.js
* node-webkit => NW.js

### Using the same instance of V8

Both Node.js and Chromium use V8 to handle executing JavaScript.

The first thing NW.js does is load Node.js and Chromium so that both of them have their JavaScript contexts loaded in the V8 engine.

When this is done, the JavaScript context for Node.js can be copied into the JavaScript context for Chromium.

### Integrating the main event loop

Node.js and Chromium use different software libraries:
* Node.js => libuv
* Chromium => custom C++ libraries (MessageLoop and MessagePump)

When the JavaScript context for Node.js is copied into Chromium's JavaScript context, Chromium's event loop is adjusted to use a custom version of the MessagePump class, build on top of libuv, and in this way, they're able to work together.

### Bridging the JavaScript context between Node and Chromium

Node.js kicks off with a `start` function that handles executing code.

To get Node.js to work with Chromium, the `start` function has to be split into parts so that it can execute in line with Chromium's rendering process.

## How does Electron work under the hood?

Electron's architecture emphasizes a clean separation between the Chromium source code and the app.

```
+-------------------------------------------------+
|                   Electron                      |
| +---------------------------------------------+ |
| |                   Atom                      | |
| | +-----+ +---------+ +----------+ +--------+ | |
| | | App | | Browser | | Renderer | | Common | | |
| | +-----+ +---------+ +----------+ +--------+ | |
| +---------------------------------------------+ |
| +---------------------------------------------+ |
| |            Chromium source code             | |
| +---------------------------------------------+ |
+-------------------------------------------------+
```

The Atom component is the C++ source code for the shell.

The Chromium's source code is used by Atom shell to combine Chromium with Node.js.

### Introducing libchromiumcontent

https://github.com/electron/libchromiumcontent

Electron uses libchromiumcontent to load Chromium's content module, which includes Blink and V8.

You use the Chromium content module to handle rendering web pages for the app windows.

### Electron's components

#### App

Handles code that needs to load at the start of Electron (loading Node.js, loading Chromium's content module, and accessing libuv).

#### Browser

Handles interacting with the front-end part of the app (initializing the JavaScript engine, interacting with the UI, binding modules that are specific to each OS)

#### Renderer

Code that runs in Electron's renderer processes. In Electron, each app window runs as a separate process, just like Google Chrome's tabs.

#### Common

Utility code used by both the main and renderer processes for running the app.

### How Electron handles running the app
