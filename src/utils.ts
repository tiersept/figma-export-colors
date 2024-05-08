import * as ora           from "ora";
import { BuilderConfig }  from "./types/builderConfig";
import { TaskDef }        from "./types/taskDef";
import * as Figma         from 'figma-api';
import { Node }           from "figma-api/lib/ast-types";
import * as _             from "lodash";
import { isParentalNode } from "./types/parentalNode";

export function createBuilder(tasks: TaskDef) {
    return async function (config : BuilderConfig) {
        for (const [task_name, task] of Object.entries(tasks)) {
            await runTask(task_name, (spinner: ora.Ora) => task(spinner,config));
        }
    };
}

export async function runTask(name: string, taskFn: (spinner: ora.Ora) => Promise<any>) {
    const spinner : ora.Ora = ora(name);

    try {
        spinner.start();

        await taskFn(spinner);

        if (spinner.isSpinning) spinner.succeed();
    } catch (e) {
        spinner.fail();

        throw e;
    }
}


export const getFigmaClient = (() => {
    let figmaClient : Figma.Api|undefined;
    return function (params?: ConstructorParameters<typeof Figma.Api>[0]){
        if (figmaClient) {
            return figmaClient;
        }
        if (!params){
            throw new Error('No token provided before initialization');
        }
        return figmaClient = new Figma.Api(params)
    }
})()

export function getNodeByPath(root: Node<'DOCUMENT' | 'CANVAS' | 'FRAME'>, path: string[]): Node<'DOCUMENT' | 'CANVAS' | 'FRAME'> | undefined {
    return _.reduce(
        path,
        (current: Node<'DOCUMENT' | 'CANVAS' | 'FRAME'>, name: string) => {
            const parentFounded = _.find(current.children, {name})
            return current && parentFounded && isParentalNode(parentFounded) ? parentFounded : undefined;
        },
        root
    );
}
