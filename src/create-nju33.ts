#!/usr/bin/env node

declare namespace process {
  export const env: {
    USER: string;
  };
}

import path from 'path';
import yargs from 'yargs';
import * as commands from './commands';

const FILES_ROOT = path.resolve(__dirname, '../files');

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
    commands.ts({filesRoot: FILES_ROOT}),
  )
  .demandCommand(1)
  .showHelpOnFail(false, 'Specify --help for available options')
  .help('help').argv;
