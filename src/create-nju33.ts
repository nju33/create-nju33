#!/usr/bin/env node

declare namespace process {
  export const env: {
    USER: string;
  };
}

import rootYargs from 'yargs';

rootYargs
  .command('hello', 'just say hello', {}, () => {
    console.log(`nju33 > Hello ${process.env.USER}`);
  })
  .demandCommand(1)
  .showHelpOnFail(false, 'Specify --help for available options')
  .help('help').argv;
