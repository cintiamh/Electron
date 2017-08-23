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
