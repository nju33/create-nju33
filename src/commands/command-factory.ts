export interface FactoryConfig {
  filesRoot: string;
}

export type CommandFactory<A extends {[x: string]: any}> = (
  config: FactoryConfig,
) => (args: A) => void;
