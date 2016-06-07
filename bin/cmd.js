#! /usr/bin/env node
'use strict';

var doctest = require('../lib/doctest');

var fs = require('fs');

var glob = require('glob');

var CONFIG_FILEPATH = process.cwd() + '/.markdown-doctest-setup.js';
var DEFAULT_GLOB = '**/*.+(md|markdown)';
var DEFAULT_IGNORE = ['**/node_modules/**', '**/bower_components/**'];

function main () {
  var userGlob = process.argv[2];
  var config = {require: {}};

  if (fs.existsSync(CONFIG_FILEPATH)) {
    try {
      config = require(CONFIG_FILEPATH);
    } catch (e) {
      console.log('Error running .markdown-doctest-setup.js:');
      console.error(e);
      return;
    }
  }

  var ignoredDirectories = config.ignore || [];

  glob(
    userGlob || DEFAULT_GLOB,
    {ignore: DEFAULT_IGNORE.concat(ignoredDirectories)},
    run
  );

  function run (err, files) {
    if (err) {
      console.trace(err);
    }

    var results = doctest.runTests(files, config);

    console.log('\n');

    doctest.printResults(results);

    var failures = results.filter(function (result) { return result.status === 'fail'; });

    if (failures.length > 0) {
      process.exitCode = 127;
    }
  }
}

main();
