import {Signale} from 'signale';

const options = {
  disabled: false,
  interactive: false,
  stream: process.stdout,
  types: {
    'yarn-add': {
      badge: '🚙',
      color: 'blue',
      label: 'yarn add',
    },
    'yarn-add-dev': {
      badge: '🚙',
      color: 'blue',
      label: 'yarn add -D',
    },
    'yarn-add-peer': {
      badge: '🚙',
      color: 'blue',
      label: 'yarn add -P',
    },
    copy: {
      badge: '💉',
      color: 'yellow',
      label: 'copy',
    },
    generated: {
      badge: '💉',
      color: 'yellow',
      label: 'generated',
    },
    overwrite: {
      badge: '✏️',
      color: 'red',
      label: 'overwrite'
    }
  },
};

export default new Signale(options);
