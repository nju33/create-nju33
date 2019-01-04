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
    copied: {
      badge: '💉',
      color: 'yellow',
      label: 'copied',
    },
    override: {
      badge: '✏️',
      color: 'red',
      label: 'override'
    }
  },
};

export default new Signale(options);
