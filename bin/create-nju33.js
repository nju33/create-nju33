#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
yargs_1.default
    .command('hello', 'just say hello', {}, function () {
    console.log("nju33 > Hello " + process.env.USER);
})
    .demandCommand(1)
    .showHelpOnFail(false, 'Specify --help for available options')
    .help('help').argv;
//# sourceMappingURL=create-nju33.js.map