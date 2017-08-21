'use strict';

let document;
const fileSystem = require('./fileSystem');
const search = require('./search');
const path = require('path');

function displayFolderPath(folderPath) {
  document.getElementById('current-folder').innerHtml = convertFolderPathIntoLinks(folderPath);
  bindCurrentFolderPath();
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

function bindSearchField(cb) {
  document.getElementById('search').addEventListener('keyup', cb, false);
}

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

module.exports = {
  bindDocument,
  displayFiles,
  loadDirectory,
  bindSearchField,
  filterResults,
  resetFilter
};
