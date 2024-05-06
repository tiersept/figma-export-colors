import { RunnerFn }      from "../types/runnerFn";
import { BuilderConfig } from "../types/builderConfig";
import config            from "../config";
import { Ora }           from "ora";

const loadConfig : RunnerFn = async (spinner:Ora,configuration: BuilderConfig) => new Promise<BuilderConfig>((resolve,reject) => {
    try{
        config.loadFile(configuration.commandOptions.config);
        config.validate({ allowed: 'strict' });
        resolve(configuration)
    }
    catch (e){
        reject(e.message)
    }
})

export default loadConfig;
