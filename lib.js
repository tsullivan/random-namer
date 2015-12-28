/*eslint-disable no-console,no-unused-vars*/
/*global process,console*/
import fs from 'q-io/fs';

export function lister () {
  const [ node, script, ...paths ] = process.argv;
  if (!paths.length) {
    console.log('no paths@@!!!!!');
    return;
  }

  Promise.all(
    paths.map((p) => fs.list(p))
  )
  .then((results) => {
    console.log(results);
    return 'Done';
  })
  .then((result) => {
    console.log(result);
  });
}
