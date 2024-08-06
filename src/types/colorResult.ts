export type ColorHex = string;

export type ColorGroup = {
  [level: number]: ColorHex;
};

export interface ColorResult {
  [colorName: string]: ColorGroup | ColorHex;
}
