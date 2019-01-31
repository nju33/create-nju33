import path from 'path';
import {Arguments} from 'yargs';
import gulp from 'gulp';
import {CommandFactory} from 'types/command-factory';
import {Package} from 'read-pkg';
import prompts from 'prompts';
import Listr from 'listr';
import * as gulpPlugins from '../gulp-plugin';
import {yarn} from '../helpers/yarn';
import signale from '../instances/signale';

interface TsArgsModule {
  type: 'module';
  moduleName: string;
}

interface TsArgsReactModule {
  type: 'react-module';
}

interface TsArgsBin {
  type: 'bin';
}

interface TsArgsMinimum {
  type: 'minimum';
}

// interface TsArgs {
//   type: 'bin' | 'module' | 'react-module' | 'Minimum';
// }

type TsArgs = TsArgsModule | TsArgsReactModule | TsArgsBin | TsArgsMinimum;

interface Context {
  pkg: Partial<Package>;
  options: TsArgs;
}

const DEPENDENCY_LIST: {[x: string]: any} = {
  bin: {
    dependencies: [],
    devDependencies: [
      'typescript',
      '@nju33/tsconfig-main',
      'tslint',
      '@nju33/tslint',
    ],
    peerDependencies: [],
  },
  module: {
    dependencies: [],
    devDependencies: [
      'typescript',
      '@nju33/tsconfig-main',
      '@nju33/tsconfig-module',
      '@nju33/tsconfig-types',
      'tslint',
      '@nju33/tslint',
      'typedoc',
      'jest',
      '@types/jest',
      'ts-jest',
      'rollup',
      'rollup-plugin-node-resolve',
      'rollup-plugin-commonjs',
    ],
    peerDependencies: [],
  },
  'react-module': {
    dependencies: [],
    devDependencies: [
      '@types/react',
      'react',
      '@types/react-dom',
      'react-dom',
      '@types/enzyme',
      'enzyme',
      '@types/enzyme-adapter-react-16',
      'enzyme-adapter-react-16',
      'react-test-renderer',
      'typescript',
      '@nju33/tsconfig-react-main',
      '@nju33/tsconfig-react-module',
      '@nju33/tsconfig-react-types',
      'tslint',
      '@nju33/tslint',
      'typedoc',
      'jest',
      '@types/jest',
      'ts-jest',
    ],
    peerDependencies: [
      'react@^16.4.0',
      'react-dom@^16.4.0',
      'styled-components@^4.0.0',
    ],
  },
  minimum: {
    dependencies: [],
    devDependencies: [
      'typescript',
      '@nju33/tsconfig-react-main',
      '@nju33/tsconfig-react-module',
      '@nju33/tsconfig-react-types',
      'tslint',
      '@nju33/tslint',
      'typedoc',
      'jest',
      '@types/jest',
      'ts-jest',
    ],
    peerDependencies: [],
  },
};

const SCRIPTS_LIST: {[x: string]: any} = {
  bin: {
    prepare: 'yarn build',
    dev: 'tsc --watch',
    build: 'tsc',
  },
  module: {
    prepare: 'yarn build',
    test: 'jest',
    typedoc:
      'typedoc --theme minimal --out docs src/index.ts --ignoreCompilerErrors',
    'build.main': 'tsc -P tsconfig.main.json',
    'build.module': 'tsc -P tsconfig.module.json',
    'build.iife': 'rollup -c --name Name --file file.js',
    'build.types': 'tsc -P tsconfig.types.json --emitDeclarationOnly',
    build:
      'yarn build.main; yarn build.module; yarn build.iife; yarn build.types',
  },
  'react-module': {
    prepare: 'yarn build',
    test: 'jest',
    typedoc:
      'typedoc --theme minimal --out docs src/index.ts --ignoreCompilerErrors',
    'build.main': 'tsc -P tsconfig.main.json',
    'build.module': 'tsc -P tsconfig.module.json',
    'build.types': 'tsc -P tsconfig.types.json --emitDeclarationOnly',
    build: 'yarn build.main; yarn build.module; yarn build.types',
  },
  minimum: {
    test: 'jest',
    dev: ':',
    build: 'tsc -P tsconfig.json',
  },
};

const defaultOptions: Partial<TsArgs> = {
  // iife: false,
};

const inquire: (context: {
  pkg: Partial<Package>;
  args: TsArgs;
}) => Promise<prompts.Answers<keyof TsArgs>> = ({args}) => {
  const list: prompts.PromptObject<keyof TsArgs>[] = [];
  if (args.type === undefined) {
    list.push({
      type: 'select',
      name: 'type',
      message: 'プロジェクトタイプ',
      choices: [
        {title: 'Module', value: 'module'},
        {title: 'React Module', value: 'react-module'},
        {title: 'Bin', value: 'bin'},
        {title: 'Minimum', value: 'minimum'},
      ],
    });
  }

  if ((args as any).moduleName === undefined) {
    list.push({
      type: prev => (prev === 'module' ? 'text' : false) as any,
      name: 'moduleName' as any,
      message: 'モジュール名',
    });
  }

  return prompts(list);
};

const getPkgFiles = ({pkg, options: {type}}: Context) => {
  let main = 'dist/main/index.js';
  let module = 'dist/module/index.js';
  let types = 'dist/types/index.d.ts';
  let src = 'src/index.ts';
  const files = ['dist'];

  if (type === 'module') {
    main = 'dist/main/main.js';
    module = 'dist/module/module.js';
    types = 'dist/types/module.d.ts';
    src = 'src/module.ts';

    if (pkg.name === undefined) {
      signale.error('package.json に name が定義されていません');
      return process.exit(1);
    }

    const pkgNameParts = pkg.name.split('/');
    const iife = `${pkgNameParts[pkgNameParts.length - 1]}.js`;
    files.push(iife);
  }

  if (type === 'minimum') {
    return {};
  }

  return {
    main,
    module,
    types,
    src,
    files,
  };
};

const getPkgScripts = ({pkg, options}: Context) => {
  const target = SCRIPTS_LIST[options.type];

  if (options.type === 'module') {
    target['build.iife'] = `rollup --name ${options.moduleName} --file ${
      pkg.name
    }.js`;
  }

  return target;
};

export const ts: CommandFactory<Arguments<TsArgs>> = config => async args => {
  const answers = await inquire({pkg: config.pkg, args});
  const options = {...defaultOptions, ...args, ...answers};
  const context: Context = {pkg: config.pkg, options};

  if (options.type === undefined) {
    signale.error('options.type が定義されていないので、処理を終わります');
    return;
  }

  const FILES_TS = path.join(config.filesRoot, 'typescript');
  const pkgName = path.join(process.cwd(), 'package.json');
  const targetDir = ['typescript', options.type].join('-');
  const targetPattern = path.join(FILES_TS, targetDir, '**/*');

  const dependencyList = DEPENDENCY_LIST[options.type];

  gulp.series([
    () =>
      gulp
        .src(pkgName)
        .pipe(
          gulpPlugins.overwritePkg({
            version: '0.0.0',
            ...getPkgFiles(context),
            scripts: getPkgScripts(context),
          }),
        )
        .pipe(gulpPlugins.prettier())
        .pipe(gulp.dest('.')),
    () =>
      gulp
        .src(targetPattern)
        .pipe(gulpPlugins.prettier())
        .pipe(gulp.dest('.'))
        .pipe(gulpPlugins.log.copied()),
  ])(async () => {
    new Listr([
      {
        title: 'Install peerDependencies',
        task: ctx => yarn(dependencyList.peerDependencies, {type: 'peer', ctx}),
      },
      {
        title: 'Install devDependencies',
        task: ctx => yarn(dependencyList.devDependencies, {type: 'dev', ctx}),
      },
      {
        title: 'Install dependencies',
        task: ctx => yarn(dependencyList.dependencies, {ctx}),
      },
    ])
      .run({postProcesses: []})
      .catch(err => {
        signale.error(err);
      })
      .then((ctx: {postProcesses: Function[]}) => {
        ctx.postProcesses.forEach(postProcess => {
          postProcess();
        });
      });
  });
};
