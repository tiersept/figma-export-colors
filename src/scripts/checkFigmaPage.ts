import { RunnerFn } from "../types/runnerFn";
import { config } from "../config";
import { BuilderConfig } from "../types/builderConfig";
import { Node } from "figma-api/lib/ast-types";

export const checkFigmaPage: RunnerFn = async (spinner, configuration) =>
  new Promise<BuilderConfig>(async (resolve, reject) => {
    const page = configuration.file!.document.children.find(
      (child) => child.name === config.get("colorsPage")
    );

    if (page) {
      spinner.succeed("Page found");
      configuration.page = page as Node<"CANVAS">;
      resolve(configuration);
    } else {
      reject(`Page ${config.get("colorsPage")} not found`);
    }
  });
