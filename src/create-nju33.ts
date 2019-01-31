#!/usr/bin/env node

declare namespace process {
  export const env: {
    USER: string;
  };
  export function exit(num?: number): void;
}

import path from 'path';
import yargs from 'yargs';
import readPkg, {Package} from 'read-pkg';
import signale from './instances/signale';
import * as command from './command';

const FILES_ROOT = path.resolve(__dirname, '../files');

(async () => {
  let pkg: Package;
  try {
    pkg = await readPkg();
  } catch (err) {
    signale.error(`${err.path} がありません`);
    return process.exit(1);
  }
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
    .command(
      'prettier',
      'to create the prettier.config.js',
      {} as any,
      command.prettier(commandOpts),
    )
    .command(
      'renovate',
      'to create the renovate.json',
      {} as any,
      command.renovate(commandOpts),
    )
    .demandCommand(1)
    .showHelpOnFail(false, 'Specify --help for available options')
    .help('help').argv;
})();
