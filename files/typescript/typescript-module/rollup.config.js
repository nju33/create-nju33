import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: './dist/module/module.js',
  output: {
    format: 'iife',
    sourceMap: true,
    // file: '',
    // name: '',
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
};
