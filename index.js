#! /usr/bin/env node

require('babel-register');

var fs = require('q-io/fs');
var rs = require('randomstring');
var yargs = require('yargs').argv;
var lib = require('./lib');

var renamer = new lib.Renamer({ fs: fs, rs: rs, prefix: yargs.prefix });
renamer.rename({ files: yargs._ });
