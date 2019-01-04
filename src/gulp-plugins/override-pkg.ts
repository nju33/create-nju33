import through from 'through2';
import {toShallow} from 'deep-shallow';
import PluginError from 'plugin-error';
import mergeDeep = require('merge-deep');
import signale from '../instances/signale';

export const overridePkg = (override: object) => {
  return through.obj((file, _enc, cb) => {
    try {
      file.contents = Buffer.from(
        JSON.stringify(
          mergeDeep(JSON.parse(file.contents.toString()), override),
        ),
      );

      Object.keys(toShallow(override)).forEach(modifiedPropName => {
        signale.override(modifiedPropName);
      });

      cb(null, file);
    } catch (err) {
      cb(new PluginError('prettier', err.message));
    }
  });
};
