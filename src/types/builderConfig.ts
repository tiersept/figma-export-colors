import { CommandOptions } from "./commandOptions";
import { GetFileResult, GetUserMeResult } from "figma-api/lib/api-types";
import { Node } from "figma-api/lib/ast-types";
import { ColorResult } from "./colorResult";

export interface BuilderConfig {
  commandOptions: CommandOptions;
  user?: GetUserMeResult;
  file?: GetFileResult;
  page?: Node<"CANVAS">;
  colors?: ColorResult;
}
