import * as convict from 'convict';

const config = convict({
    figmaPersonalToken: {
        doc: 'The Figma API personal access token',
        format: String,
        default: null,
        nullable : false,
        arg: 'figmaPersonalToken'
    },
    fileId: {
        doc: 'The fileId of the Figma page to export from',
        format: String,
        default: null,
        nullable : false,
        arg: 'fileId'
    },
    colorsPage: {
        doc: 'The name of the Figma page to export from',
        format: String,
        default: null,
        nullable : false,
        arg: 'colorsPage'
    },
    colorsFrame: {
        doc: 'The frame name in Figma page. ' +
             'If is nested frame, could be referenced by slashes as path (/parenFrame/firstChildFrame/colorsChildFrame)',
        format: String,
        default: null,
        nullable : true,
        arg: 'colorsFrame'
    },
    colorsExportDirectory: {
        doc: 'The path where the exported colors should be saved',
        format: String,
        default: './constants',
        arg: 'colorsExportDirectory'
    },

    colorsExportFileName: {
        doc: 'The file name where the exported colors should be saved',
        format: String,
        default: 'colors',
        arg: 'colorsExportFileName'
    },
    typescript: {
        doc: 'Whether to output TypeScript files',
        format: Boolean,
        default: true,
        arg: 'typescript'
    }
});

export default config;
