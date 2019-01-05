
declare module 'types/command-factory' {
  import {Package} from 'types/package';

  export interface FactoryOptions {
    filesRoot: string;
    pkg: Partial<Package>;
  }

  export type CommandFactory<A extends {[x: string]: any}> = (
    opts: FactoryOptions,
  ) => (args: A) => void;
}
