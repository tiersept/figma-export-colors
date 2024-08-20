import { RunnerFn } from '../types/runnerFn';
import { config } from '../config';
import { getFigmaClient } from '../utils';
import { BuilderConfig } from '../types/builderConfig';

export const checkFigmaFileId: RunnerFn = async (spinner, configuration) =>
  new Promise<BuilderConfig>(async (resolve, reject) => {
    const client = getFigmaClient({
      personalAccessToken: config.get('figmaPersonalToken'),
    });
    try {
      configuration.file = await client.getFile(config.get('fileId'));
      spinner.succeed('File found');
      resolve(configuration);
    } catch (e) {
      reject(`File with file id: ${config.get('fileId')} not found`);
    }
  });
