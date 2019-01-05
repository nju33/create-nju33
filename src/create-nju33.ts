#!/usr/bin/env node

declare namespace process {
  export const env: {
    USER: string;
  };
}

import path from 'path';
import yargs from 'yargs';
import readPkg from 'read-pkg';
import * as command from './command';

const FILES_ROOT = path.resolve(__dirname, '../files');

(async () => {
  const pkg = await readPkg();
  const commandOpts = {filesRoot: FILES_ROOT, pkg};

  yargs
    .command('hello', 'just say hello', {}, () => {
      console.log(`nju33 > Hello ${process.env.USER}`);
    })
    .command(
      'ts',
      'to create the TypeScript env',
      {
        type: {
          alias: 't',
          default: 'module',
        },
      } as any,
      command.ts(commandOpts),
    )
    .command(
      'readme',
      'to create the README.md',
      {} as any,
      command.readme(commandOpts),
    )
    .demandCommand(1)
    .showHelpOnFail(false, 'Specify --help for available options')
    .help('help').argv;
})();
