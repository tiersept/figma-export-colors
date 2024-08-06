import { Node } from "figma-api/lib/ast-types";

export type ParentalNode = Node<"DOCUMENT" | "CANVAS" | "FRAME">;

export function isParentalNode(node: Node): node is ParentalNode {
  return "children" in node;
}
