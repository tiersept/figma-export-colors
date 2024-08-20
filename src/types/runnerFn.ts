import { BuilderConfig } from './builderConfig';
import { Ora } from 'ora';

export type RunnerFn = (
  spinner: Ora,
  configuration: BuilderConfig
) => Promise<BuilderConfig>;
