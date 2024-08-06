# figma-export-colors

<a href="https://www.npmjs.com/package/figma-export-colors"><img src="https://badgen.net/npm/v/figma-export-colors" alt="Version"></a>
<a href="https://www.npmjs.com/package/figma-export-colors"><img src="https://badgen.net/npm/dm/figma-export-colors" alt="Downloads"></a>

Command line script to generate a `.js` or `.ts` colors object from the generated colors using [tailwind-css-color-generator](https://www.figma.com/community/plugin/1242548152689430610/tailwind-css-color-generator) that you can spread in your `tailwind.config` file.

## Features

- Export all the color variables from figma into your codebase with a single command.

## Installation

Install the cli globally so you can use it on any directory

```sh
npm install -g figma-export-colors
```

Or if you prefer install it in your project

```sh
npm install -D figma-export-colors
```

## Usage

Create a `figma-export-config.json` file in the root directory with the following structure

```json5
{
  figmaPersonalToken: "YOUR_PERSONAL_TOKEN",
  // File id can be found in the url of the figma file
  // E.g https://www.figma.com/design/[FILE_ID]/
  fileId: "FILE_ID",
  colorsPage: "Colors",
  // The frame name in Figma page.
  // If is nested frame, could be referenced by slashes as path (/parenFrame/firstChildFrame/colorsChildFrame)
  colorsFrame: "Empty or ColorFrameContainerName or ColorFrameContainerName/ChildFrame/...",
  colorsExportDirectory: "./constants",
  colorsExportFileName: "colors",
  typescript: true,
}
```

If you have installed the module globally:

```sh
$ export-colors
```

If you have installed it locally:

Create a script in your package.json

```js
scripts: {
 'export-colors': 'export-colors'
}
```

and run

```sh
npm run export-colors
```

OR

run it directly with:

```sh
npx export-colors
```

## Example of an exported file as colors.js

```js
module.exports.colors = {
  black: "#000000",
  white: "#ffffff",
  yellow: {
    50: "#fdffe7",
    100: "#f9ffc1",
    200: "#f8ff86",
    // ...
  },
  purple: {
    50: "#f3f3ff",
    100: "#eae9fe",
    200: "#d8d6fe",
    // ...
  },
  // ...
};
```

## Example of an exported file as colors.ts

```ts
export const colors = {
  black: "#000000",
  white: "#ffffff",
  yellow: {
    50: "#fdffe7",
    100: "#f9ffc1",
    200: "#f8ff86",
    // ...
  },
  purple: {
    50: "#f3f3ff",
    100: "#eae9fe",
    200: "#d8d6fe",
    // ...
  },
  // ...
};
```

## In your tailwind.config you spread the exported colors object

```js
import { colors } from "./constants/colors";

const config = {
  theme: {
    colors: {
      current: "currentColor",
      transparent: "transparent",
      ...colors,
    },
  },
};
```

## Credits

This script was inspired by https://github.com/tsimenis/figma-export-icons and to use with the figma plugin https://www.figma.com/community/plugin/1242548152689430610/tailwind-css-color-generator
