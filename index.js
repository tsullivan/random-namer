require('babel-register');

var fs = require('q-io/fs');
var randomstring = require('randomstring');
var yargs = require('yargs').argv;
var lib = require('./lib');

var renamer = new lib.Renamer({
  fs: fs,
  randomer: randomstring
});

if (renamer) {
  renamer.rename({
    files: yargs._,
    prefix: yargs.prefix
  });
}
