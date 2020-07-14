const { readdir, readFile, writeFile, unlink } = require('fs').promises;
const { join } = require('path');

async function main() {
  const base = `${__dirname}/../dist/types/`;
  const f = await readdir(base);
  let index = `
/**
* Export the contents of the 'types' folder as ambient types
*/
  `;

  for (const each of f) {
    const full = join(base, each);
    if (full.endsWith('.d.ts')) {
      console.log(`Patching: ${full}`);
      index += `\n/// <reference path="./types/${each}" />`

      let content = (await readFile(full, 'utf8')).
        replace(/^\/\*\* (\/\/\/ \<reference.*)\*\//gm, '$1\n').
        replace(/^import.*/gm, '').
        replace(/^export /gm, '')

      await writeFile(full, content);
    }

    if (full.endsWith('.js')) {
      await unlink(full);
    }
  }
  await writeFile(join(base, '..', 'index.d.ts'), index);
}

main();