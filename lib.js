/*eslint-disable no-console*/
import _ from 'lodash';

export class Renamer {
  constructor ({fs, randomer}) {
    this.fs = fs;
    this.randomer = randomer;
  }

  rename ({files, prefix}) {
    if (_.isEmpty(files)) { // check arguments
      console.log('File paths must be given as arguments');
      return;
    }
    // check they are files
    Promise.all(files.map(p => this.fs.isFile(p)))
    .then((allAreFiles) => {
      if (_.contains(allAreFiles, false)) {
        throw new Error('All arguments must be files!');
      }
      return files;
    })
    .then((files) => {
      return Promise.all(files.map((p) => {
        // rename the files
        const ext = this.fs.extension(p);
        const rs = this.randomer.generate();
        const pre = (prefix) ? prefix + '-' : '';
        return this.fs.rename(p, `${pre}${rs}${ext}`);
      }));
    })
    .then((result) => {
      // display the result
      console.log(`${result.length} files renamed`);
    })
    .catch((error) => {
      // something went wrong
      console.log(error.message)
    });
  }
}
