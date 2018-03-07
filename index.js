#! /usr/bin/env node
/*eslint-disable no-console*/

require('babel-register');

const fs = require('q-io/fs');
const rs = require('randomstring');
const yargs = require('yargs').argv;
const { Renamer } = require('./lib');

const renamer = new Renamer({ fs, rs, prefix: yargs.prefix });

renamer
  .rename({ files: yargs._ })
  .then(function(result) {
    console.log(result);
  })
  .catch(function(error) {
    console.error(error.stack);
  });
