#!/usr/bin/env node
import { Command, program } from 'commander';
import { createBuilder }    from "./utils";
import { CommandOptions }   from "./types/commandOptions";
import loadConfig           from "./scripts/loadConfig";
import checkFigmaToken      from "./scripts/checkFigmaToken";
import checkFigmaFileId     from "./scripts/checkFigmaFileId";
import getColors            from "./scripts/getColors";
import checkFigmaPage       from "./scripts/checkFigmaPage";
import createColorsFile     from "./scripts/createColorsFile";

const _program = new Command();


// console.log(config.get(''))
program
    .version('1.0.0')
    .option('-c, --config <path>', 'Path to configuration file', 'figma-export-config.json')
    .option('--figmaPersonalToken <token>', 'Figma API personal access token')
    .option('--colorsPage <pageName>', 'Name of the Figma page to export')
    .option('--colorsFrame <frameName>', 'Name of the frame in Figma')
    .option('--exportPath <path>', 'Path where to save exported colors')
    .option('--typescript', 'Output TypeScript files')
    .action((options: CommandOptions) => {

        createBuilder({
            'Read configuration file' : loadConfig,
            'Checking token...' : checkFigmaToken,
            'Checking file id...' : checkFigmaFileId,
            'Checking page...' : checkFigmaPage,
            'Fetching colors...' : getColors,
            'Creating colors file...' : createColorsFile
        })({
            commandOptions : options
        }).catch((err) => {
            console.error(err);
            process.exit(1);
        });


    });

program.parse(process.argv);
