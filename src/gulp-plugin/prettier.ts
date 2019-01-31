import path from 'path';
import through from 'through2';
import PluginError from 'plugin-error';
import {format as prettierFormat} from 'prettier';
import prettierConfig from '../../prettier.config.js';

const PARSER_NAMES: {readonly [x: string]: string} = {
  ts: 'typescript',
  get tsx() {
    return this.ts;
  },
  js: 'babel',
  get jsx() {
    return this.js;
  },
  json: 'json',
  css: 'css',
  scss: 'scss',
  get sass() {
    return this.scss;
  },
  less: 'less',
  html: 'html',
  md: 'markdown',
  mdx: 'mdx',
  vue: 'vue',
  graphql: 'graphql',
  yml: 'yaml',
};

export const prettier = () =>
  through.obj((file, _enc, cb) => {
    const fileName = file.history[file.history.length - 1] as string;
    if (!/\.[tj]sx?$/.test(fileName)) {
      return cb(null, file);
    }

    const extName = path.extname(fileName);
    const parser = (PARSER_NAMES as {[x: string]: string})[extName.slice(1)];
    const content: any = file.contents.toString();

    try {
      const formated = prettierFormat(content, {...prettierConfig, parser});
      file.contents = Buffer.from(formated);

      cb(null, file);
    } catch (err) {
      cb(new PluginError('prettier', err as string));
    }
  });
