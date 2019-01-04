#!/usr/bin/env node

const rootYargs = require('yargs');

const noop = () => {};

rootYargs
  .command('hello', 'just say hello', noop, () => {
    console.log(`nju33 > Hello ${process.env.USER}`);
  })
  .demandCommand(1)
  .showHelpOnFail(false, 'Specify --help for available options')
  .help('help').argv;
