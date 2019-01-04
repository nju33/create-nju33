import {execFile} from 'child_process';
import signale from '../instances/signale.js';

export const yarn = (
  dependencies: string[] = [],
  config: {type?: 'dev' | 'peer'} = {},
) => {
  return new Promise((resolve, reject) => {
    const flag = (() => {
      switch (config.type) {
        case 'dev': {
          return '-D';
        }
        case 'peer': {
          return '-P';
        }
        default: {
          return undefined;
        }
      }
    })();

    if (dependencies.length === 0) {
      return resolve();
    }

    const args = ['add', flag, ...dependencies].filter(Boolean) as string[];
    execFile('yarn', args, err => {
      // if (err !== null) {
      //   return reject(err);
      // }

      const signaleName = ['yarn', 'add', config.type]
        .filter(Boolean)
        .join('-');
      dependencies.forEach(dependency => {
        (signale as {[x: string]: any})[signaleName](dependency);
      });
      resolve();
    });
  });
};
