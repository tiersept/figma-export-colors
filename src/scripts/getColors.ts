import { RunnerFn }       from "../types/runnerFn";
import config             from "../config";
import { getNodeByPath }  from "../utils";
import { BuilderConfig }  from "../types/builderConfig";
import * as _             from "lodash";
import { Node }           from "figma-api/lib/ast-types";
import * as ora           from "ora";
import { isParentalNode } from "../types/parentalNode";
import { ColorResult }    from "../types/colorResult";


const getColors: RunnerFn = async (spinner, configuration) => new Promise<BuilderConfig>(async (resolve, reject) => {
    const colorsFrame = config.get('colorsFrame') as string;


    const paletteNodes : Node[] = colorsFrame ?
        _.get(getNodeByPath(configuration.page, colorsFrame.split("/").filter(Boolean)), 'children', [])
        :
        configuration.page!.children;

    if (colorsFrame && _.isEmpty(paletteNodes)) {
        reject(`Could not find frame "${colorsFrame}" in page ${config.get('colorsPage')}`);
        return;
    }
    spinner.succeed('Colors found');

    configuration.colors = _.reduce(paletteNodes, (finalObject, colorGroup) => {
        if (!isParentalNode(colorGroup)) return finalObject;

        const colorGroupName = colorGroup.name.toLowerCase().replace(/\s+/g, '-');
        ora({indent: (spinner.indent || 1) * 4}).start().succeed(`Color "${colorGroupName}" found`)

        finalObject[colorGroupName] = getColorValues(colorGroup.children);
        return finalObject;
    }, {} as ColorResult);
    resolve(configuration);
})


function getColorValues(colorGroupChildren: Node[]): Record<string | number, string | undefined> {
    return _.reduce(colorGroupChildren, (groupObj, colorNode) => {
        if (!isParentalNode(colorNode)) return groupObj;

        const color = getColor(colorNode.children, true);
        const key = getColor(colorNode.children, false);

        if (key) {
            const numericalKey = _.isNaN(Number(key)) ? key : Number(key);
            groupObj[numericalKey] = color;
            return groupObj;
        }

        return color;
    }, {});
}

function getColor(children: Node[], isHex: boolean): string | undefined {
    return _.find(children, child => child.type === "TEXT" && (isHex ? child.name.startsWith("#") : !child.name.startsWith("#")))?.name;
}

export default getColors;
