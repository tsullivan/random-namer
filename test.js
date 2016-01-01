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

// quick defaults for mock data
function mockDeps() {
  return {
    fs: {
      isFile: this.sinon.stub().resolves(true),
      exists: this.sinon.stub().resolves(false),
      extension: this.sinon.stub().returns('.txt'),
      rename: this.sinon.stub().resolves()
    },
    rs: {
      generate: this.sinon.stub().returns('cba')
    }
  };
}

describe('Constructor', () => {
  it('sets prefix - empty', function () {
    const { fs, rs } = mockDeps.call(this);
    const renamer = new Renamer({fs, rs});
    assert.equal(renamer.prefix, '');
  });
  it('sets prefix - non-empty', function () {
    const { fs, rs } = mockDeps.call(this);
    const renamer = new Renamer({fs, rs, prefix: 'football'});
    assert.equal(renamer.prefix, 'football-');
  });
});

describe('Method', () => {
  it('skips an invalid file', function () {
    const { fs, rs } = mockDeps.call(this);
    fs.isFile = this.sinon.stub().resolves(false);
    const renamer = new Renamer({fs, rs});

    return renamer.rename({ files: [ 'abc.txt'] })
    .then((result) => {
      assert.equal(result, 'Not a valid filename: abc.txt\n0 files random-named');
    });
  });

  it('renames a single valid file', function () {
    const { fs, rs } = mockDeps.call(this);
    const renamer = new Renamer({fs, rs});

    return renamer.rename({ files: [ 'abc.txt'] })
    .then((result) => {
      assert.equal(result, 'abc.txt => cba.txt\n1 file random-named');
    });
  });

  it('prepends prefix', function () {
    const { fs, rs } = mockDeps.call(this);
    const renamer = new Renamer({fs, rs, prefix: 'testo'});

    return renamer.rename({ files: [ 'abc.txt'] })
    .then((result) => {
      assert.equal(result, 'abc.txt => testo-cba.txt\n1 file random-named');
    });
  });

  it('renames a valid file and skips an invalid file', function () {
    const { fs, rs } = mockDeps.call(this);
    const isFile = this.sinon.stub();
    isFile.withArgs('abc.txt').resolves(true);
    isFile.withArgs('def.txt').resolves(false);
    fs.isFile = isFile;
    const renamer = new Renamer({fs, rs});

    return renamer.rename({ files: [ 'abc.txt', 'def.txt'] })
    .then((result) => {
      assert.equal(result, 'Not a valid filename: def.txt\nabc.txt => cba.txt\n1 file random-named');
    });
  });

  it(`won't overwrite existing file`, function () {
    const { fs, rs } = mockDeps.call(this);
    const exists = this.sinon.stub();
    exists.onCall(0).resolves(true);
    exists.onCall(1).resolves(true);
    exists.onCall(2).resolves(false);
    fs.exists = exists;
    const renamer = new Renamer({fs, rs});

    return renamer.rename({ files: [ 'abc.txt'] })
    .then((result) => {
      assert.equal(result, 'Avoiding overwrite of cba.txt\nAvoiding overwrite of cba.txt\nabc.txt => cba.txt\n1 file random-named');
    });
  });

});

