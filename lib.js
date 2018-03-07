/*eslint-disable no-console*/
import _ from 'lodash';

export class Renamer {
  constructor ({fs, rs, prefix}) {
    this.fs = fs;
    this.rs = rs;
    this.prefix = (prefix) ? prefix + '-' : '';
  }

  attemptRename (original, responses) {
    const ext = this.fs.extension(original);
    const rs = this.rs.generate();
    const newName = `${this.prefix}${rs}${ext}`;
    // check if new name exists already
    return this.fs.exists()
    .then((doesExist) => {
      if (!doesExist) {
        return this.fs.rename(original, newName)
        .then(() => newName);
      } else {
        responses.push(`Avoiding overwrite of ${newName}`);
        return this.attemptRename(original, responses);
      }
    });
  }

  rename ({files}) {
    let responses = [];

    if (_.isEmpty(files)) {
      // display usage and exit early
      return Promise.resolve(
        'Usage: random-namer [--prefix=PREFIX] file_name ...\n' +
        'Example name: ' + this.rs.generate()
      );
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
      return Promise.all(files.map(f => {
        return this.attemptRename(f, responses).then((newName) => {
          responses.push(`${f} => ${newName}`);
        })
      }));
    })
    .then((result) => {
      // return a success result message
      const noun = result.length === 1 ? 'file' : 'files';
      return responses.concat(`${result.length} ${noun} random-named`).join('\n');
    });
  }
}

