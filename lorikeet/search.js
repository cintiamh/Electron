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
  if (index) {
    index.add(file);
  }
}

function find(query, cb) {
  if (!index) {
    resetIndex();
  }
  const results = index.search(query);
  if (typeof cb === 'function') {
    cb(results);
  }
}

module.exports = { addToIndex, find, resetIndex };
