# figma-export-colors

> Command line script to generate a `.js` or `.ts` colors object from the generated colors using [tailwind-css-color-generator](https://www.figma.com/community/plugin/1242548152689430610/tailwind-css-color-generator) that you can spread in your `tailwind.config` file.

## Description

Assuming you have generated
Running the script will bring up a wizard to fill in the config for fetching the assets. You can also provide the colors-config.json yourself, then the wizard is skipped.
After the config is provided, the figma file is fetched and parsed to find the icons frame, the files are downloaded and put locally in the directory provided in the config.

example config file:

```json
{
  "figmaPersonalToken": "YOUR_PERSONAL_TOKEN",
  "fileId": "FILE_ID",
  "page": "Color",
  "frame": "Colors",
  "exportPath": "constants/colors",
  "typescript": true
}
```

## Features

- Wizard to generate config, you will be prompted for any missing key
- WIP

## Installation

Install the cli globally so you can use it on any directory

```sh
npm install -g figma-export-icons
```

Or if you prefer install it in your project

```sh
npm install figma-export-icons --save
```

## Usage

If you have installed the module globally:

```sh
$ export-icons
```

If you have installed it locally:

Create a script in your package.json

```js
scripts: {
 'export-icons': 'export-icons'
}
```

and run

```sh
npm run export-icons
```

OR

run it directly with:

```sh
npx export-icons
```

## Credits

This script was inpsired by https://github.com/tsimenis/figma-export-icons and to use with the figma plugin https://www.figma.com/community/plugin/1242548152689430610/tailwind-css-color-generator
