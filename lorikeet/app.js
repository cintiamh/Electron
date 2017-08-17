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
