import { RunnerFn }      from "../types/runnerFn";
import config            from "../config";
import { BuilderConfig } from "../types/builderConfig";
import * as ora          from "ora";
import * as path         from "node:path";
import * as fs           from "fs";


const createColorsFile: RunnerFn = async (spinner: ora.Ora, configuration: BuilderConfig) => new Promise<BuilderConfig>(async (resolve, reject) => {
    const directory = path.resolve(config.get('colorsExportDirectory') as string);
    const filename = path.parse(config.get('colorsExportFileName') as string);
    const extension = config.get('typescript') ? 'ts' : 'js';

    if (!fs.existsSync(directory) && !fs.mkdirSync(directory,{recursive : true})) {
        return reject(`Could not create colors directory (${directory})`);
    }

    const fullPath = path.resolve(
        directory,
        `${filename.base}.${extension}`
    )
    const template = {
        ts : "export const colors = #COLORS;\n",
        js : "module.exports.colors = #COLORS;\n"
    }
    const content = template[extension].replace("#COLORS",JSON.stringify(
        configuration.colors,
        null,
        2
    ));
    fs.writeFile(fullPath,content,(err) =>{
        if (!err) {
            spinner.succeed(`Created colors file (${fullPath})`)
            resolve(configuration);
        } else {
            reject(err);
        }
    })
})


export default createColorsFile;
