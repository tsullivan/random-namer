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
    let responses = [];

    if (_.isEmpty(files)) {
      // display usage and exit early
      return Promise.resolve('Usage: random-namer [--prefix=PREFIX] file_name ...');
    }
    return Promise.all(files.map(f => {
      // check they are files
      return this.fs.isFile(f)
      .then(result => {
        return { name: f, status: result };
      })
    }))
    .then((statuses) => {
      // filter out non-files
      const badFiles = statuses.reduce((prev, curr) => {
        if (!curr.status) {
          prev.push(curr.name);
        }
        return prev;
      }, []);

      if (!_.isEmpty(badFiles)) {
        responses.push(`Not a valid filename: ${badFiles.join(' ')}`);
      }

      return files.filter((f) => {
        return !_.contains(badFiles, f);
      });
    })
    .then((files) => {
      // rename the files
      return Promise.all(files.map(f => this.attemptRename(f)));
    })
    .then((result) => {
      // return a success result message
      return responses.concat(`${result.length} files renamed`).join('\n');
    });
  }
}

