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
