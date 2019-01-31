import path from 'path';
import through from 'through2';
import signale from '../instances/signale';

export const log = {
  copied: () =>
    through.obj((file, _enc, cb) => {
      if (
        !path.basename(file.path).startsWith('.') &&
        path.extname(file.path) === ''
      ) {
        return cb(null, file);
      }

      signale.copy(file.path);
      cb(null, file);
    }),
};
