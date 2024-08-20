import { RunnerFn } from '../types/runnerFn';
import { config } from '../config';
import { getFigmaClient } from '../utils';
import { BuilderConfig } from '../types/builderConfig';

export const checkFigmaToken: RunnerFn = async (spinner, configuration) =>
  new Promise<BuilderConfig>(async (resolve, reject) => {
    const client = getFigmaClient({
      personalAccessToken: config.get('figmaPersonalToken'),
    });

    try {
      const user = await client.getMe();
      configuration.user = user;
      spinner.text = `Checked user ${user.handle} (email: ${user.email}) (id: ${user.id})`;
      spinner.render();
      resolve(configuration);
    } catch (e) {
      reject('Token not valid or service unavailable');
    }
  });
