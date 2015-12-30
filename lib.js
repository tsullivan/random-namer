/*eslint-disable no-console*/
import _ from 'lodash';

export class Renamer {
  constructor ({fs, rs, prefix}) {
    this.fs = fs;
    this.rs = rs;
    this.prefix = (prefix) ? prefix + '-' : '';
  }

  attemptRename (original) {
    const ext = this.fs.extension(original);
    const rs = this.rs.generate();
    const newName = `${this.prefix}${rs}${ext}`;
    // check if new name exists already
    return this.fs.exists()
    .then((doesExist) => {
      if (!doesExist) {
        return this.fs.rename(original, newName);
      } else {
        return this.attemptRename(original);
      }
    });
  }

  rename ({files}) {
    if (_.isEmpty(files)) { // check arguments
      console.log('File paths must be given as arguments');
      return;
    }
    // check they are files
    Promise.all(files.map(f => this.fs.isFile(f)))
    .then((isFiles) => {
      if (_.contains(isFiles, false)) {
        throw new Error('All arguments must be files!');
      }
      return files;
    })
    .then((files) => {
      // rename the files
      return Promise.all(files.map(f => this.attemptRename(f)));
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
