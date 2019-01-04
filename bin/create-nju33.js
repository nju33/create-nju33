#!/usr/bin/env node

const yargs = require('yargs');

yargs
  .command('hello', '', () => {
    console.log(`nju33 > Hello ${process.env.USER}`);
  })
  .showHelp().argv;
