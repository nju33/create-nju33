import {execFile} from 'child_process';
import signale from '../instances/signale.js';

export const yarn = (
  dependencies: string[] = [],
  options: {type?: 'dev' | 'peer'; ctx: {postProcesses: any[]}} = {
    ctx: {postProcesses: []},
  },
) => {
  return new Promise((resolve, reject) => {
    const flag = (() => {
      switch (options.type) {
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
      if (err !== null) {
        return reject(err);
      }

      const signaleName = ['yarn', 'add', options.type]
        .filter(Boolean)
        .join('-');

      options.ctx.postProcesses.push(() => {
        dependencies.forEach(dependency => {
          (signale as {[x: string]: any})[signaleName](dependency);
        });
      });
      resolve();
    });
  });
};
