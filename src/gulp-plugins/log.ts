import path from 'path';
import through from 'through2';
import signale from '../instances/signale';

export const log = {
  copied: through.obj((file, _enc, cb) => {
    const fileName = path.basename(file.path);

    signale.copied(fileName);

    cb(null, file);
  }),
};
