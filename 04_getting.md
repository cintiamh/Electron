# Getting ready to release

* [Testing desktop apps](#testing-desktop-apps)

# Testing desktop apps

## Different approaches to testing apps

### Test-driven-development (TDD)

* Write tests
* Tests fail (no code)
* Write code for feature
* Tests pass
* Refine the code
* Go to next feature

This is called red-green refactoring.

### Behavior-driven-development (BDD)

Whereas TDD is focused on the workflow of the developer, BDD takes interest in not just the developer's workflow, but also that of other stakeholders (such as the end user).

* User stories workshop
* Flesh out user story
* Write tests for user story
* Implement tests and features for use story

The documentation of how the feature works drives how the app is tested.

BDD allows developers to approach implementing the tests for their apps in a way that ensures that the feature does what the client expected.

### Different levels of testing

* Unit testing: testing single functions
* Functional testing: combination of functions (components)
* Integration testing: check if the components combine to support a user feature.

## Unit Testing

We'll use Mocha for Unit Testing.

### Writing tests with Mocha

```
$ npm i mocha --save-dev
$ mkdir test
$ touch test/search.test.js
```

The test code looks something like this:
```javascript
'use strict';

const lunr = require('lunr');
const search = require('../search');

describe('search', () => {
  describe('#find', () => {
    it('should return results when a file matches a term');
  });
});
```

* `describe`: it receives a string with the name of what you are testing and the function that will execute.
* `it`: set of tests to be run.

If you run the `node_modules/.bin/mocha` command, you should see the test result.

We can use Node.js's `assert` library.

The final version for test/search.test.js file:
```javascript
'use strict';

const assert = require('assert');
const lunr = require('lunr');
const search = require('../search');

global.window = {};
global.window.lunr = lunr;

describe('search', () => {
  describe('#find', () => {
    it('should return results when a file matches a term', (done) => {
      const seedFileReferences = [
        {
          file: 'john.png',
          type: 'image/png',
          path: '/Users/pauljensen/Pictures/john.png'
        },
        {
          file: 'bob.png',
          type: 'image/png',
          path: '/Users/pauljensen/Pictures/bob.png'
        },
        {
          file: 'frank.png',
          type: 'image/png',
          path: '/Users/pauljensen/Pictures/frank.png'
        }
      ];

      search.resetIndex();
      seedFileReferences.forEach(search.addToIndex);

      search.find('frank', (results) => {
        assert(results.length === 1);
        assert.equal(seedFileReferences[2].path, results[0].ref);
        done();
      });
    });
  });
});
```

## Functional testing

Functional testing is similar in style to unit testing, but the key difference is that you test how functions work together in a component.

You need to track where changes to functions in one module impact functions in other modules.

### Functional testing in practice

## Testing Electron apps with Spectron

https://electron.atom.io/spectron/
