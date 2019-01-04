#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var yargs_1 = __importDefault(require("yargs"));
var commands = __importStar(require("./commands"));
var FILES_ROOT = path_1.default.resolve(__dirname, '../files');
yargs_1.default
    .command('hello', 'just say hello', {}, function () {
    console.log("nju33 > Hello " + process.env.USER);
})
    .command('ts', 'to create ts env', {
    type: {
        alias: 't',
        default: 'module',
    },
}, commands.ts({ filesRoot: FILES_ROOT }))
    .demandCommand(1)
    .showHelpOnFail(false, 'Specify --help for available options')
    .help('help').argv;
//# sourceMappingURL=create-nju33.js.map