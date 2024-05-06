import { RunnerFn } from "./runnerFn";

export type TaskDef = {
    [task_name: string]: RunnerFn
}
