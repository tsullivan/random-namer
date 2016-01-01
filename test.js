/*eslint-env mocha*/
import { Renamer } from './lib'
import assert from 'assert';

const sinon = require('sinon');
require('sinon-as-promised')

beforeEach(function () {
  this.sinon = sinon.sandbox.create();
});

afterEach(function () {
  this.sinon.restore();
});

describe('Constructor', () => {
  it('sets prefix - empty', function () {
    const fs = this.sinon.stub();
    const rs = this.sinon.stub();
    const renamer = new Renamer({fs, rs});
    assert.equal(renamer.prefix, '');
  });
  it('sets prefix - non-empty', function () {
    const fs = this.sinon.stub();
    const rs = this.sinon.stub();
    const renamer = new Renamer({fs, rs, prefix: 'football'});
    assert.equal(renamer.prefix, 'football-');
  });
});

describe('Method', () => {
  it('skips an invalid file', function () {
    // mock data
    const fs = {
      isFile: this.sinon.stub().resolves(false),
      exists: this.sinon.stub().resolves(false),
      extension: this.sinon.stub().returns('.txt'),
      rename: this.sinon.stub().resolves()
    };
    const rs = {
      generate: this.sinon.stub().returns('cba')
    };
    const renamer = new Renamer({fs, rs});

    return renamer.rename({ files: [ 'abc.txt'] })
    .then((result) => {
      assert.equal(result, 'Not a valid filename: abc.txt\n0 files random-named');
    });
  });

  it('renames a single valid file', function () {
    // mock data
    const fs = {
      isFile: this.sinon.stub().resolves(true),
      exists: this.sinon.stub().resolves(false),
      extension: this.sinon.stub().returns('.txt'),
      rename: this.sinon.stub().resolves()
    };
    const rs = {
      generate: this.sinon.stub().returns('cba')
    };
    const renamer = new Renamer({fs, rs});

    return renamer.rename({ files: [ 'abc.txt'] })
    .then((result) => {
      assert.equal(result, 'abc.txt => cba.txt\n1 file random-named');
    });
  });

  it('renames a valid file and skips an invalid file', function () {
    // mock data
    const isFile = this.sinon.stub();
    isFile.withArgs('abc.txt').resolves(true);
    isFile.withArgs('def.txt').resolves(false);
    const fs = {
      isFile: isFile,
      exists: this.sinon.stub().resolves(false),
      extension: this.sinon.stub().returns('.txt'),
      rename: this.sinon.stub().resolves()
    };
    const rs = {
      generate: this.sinon.stub().returns('cba')
    };
    const renamer = new Renamer({fs, rs});

    return renamer.rename({ files: [ 'abc.txt', 'def.txt'] })
    .then((result) => {
      assert.equal(result, 'Not a valid filename: def.txt\nabc.txt => cba.txt\n1 file random-named');
    });
  });

});
