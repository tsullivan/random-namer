/*eslint-disable no-console*/
import _ from 'lodash';

export class Renamer {
  constructor ({fs, randomer}) {
    this.fs = fs;
    this.randomer = randomer;
  }

  rename (files) {
    if (!files.length) { // check arguments
      console.log('File paths must be given as arguments');
      return;
    }
    // check they are files
    Promise.all( files.map(p => this.fs.isFile(p)) )
    .then((allAreFiles) => {
      if (_.contains(allAreFiles, false)) {
        throw new Error('All arguments must be files!');
      }
      return files;
    })
    .then((files) => {
      // rename the files
      Promise.all(
        files.map((p) => this.fs.list(p))
      )
    })
    .catch((error) => {
      // something went wrong
      console.log(error.message)
    });
  }
}
