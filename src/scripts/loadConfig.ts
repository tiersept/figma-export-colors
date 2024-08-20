import { RunnerFn } from '../types/runnerFn';
import { BuilderConfig } from '../types/builderConfig';
import { config } from '../config';

export const loadConfig: RunnerFn = async (_, configuration: BuilderConfig) =>
  new Promise<BuilderConfig>((resolve, reject) => {
    try {
      console.log(configuration);
      config.loadFile(configuration.commandOptions.config);
      config.validate({ allowed: 'strict' });
      resolve(configuration);
    } catch (e) {
      reject(e.message);
    }
  });
