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
