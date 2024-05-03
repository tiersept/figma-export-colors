const defaults = require("./defaults");

const prompts = [
  {
    type: "text",
    name: "figmaPersonalToken",
    message: "Your figma token:",
    validate: (value) =>
      value === ""
        ? "Generate a personal token for figma, read here:\nhttps://www.figma.com/developers/docs#authentication"
        : true,
  },
  {
    type: "text",
    name: "fileId",
    message: "What is the figma file ID?",
    validate: (value) =>
      value === ""
        ? "Visit figma project in the browser and copy the id:\nhttps://www.figma.com/file/FILE-ID/project-name"
        : true,
  },
  {
    type: "text",
    name: "colorsPage",
    message: "Name of the page with colors?",
    initial: defaults.colorsPage,
  },
  {
    type: "text",
    name: "colorsFrame",
    message: "Name of the frame with colors",
    initial: defaults.colorsFrame,
  },
  {
    type: "text",
    name: "colorsExportDirectory",
    message: "Directory to generate colors file to",
    initial: defaults.colorsExportDirectory,
  },
  {
    type: "text",
    name: "colorsExportFileName",
    message: "File name to generate colors object to",
    initial: defaults.colorsExportFileName,
  },
  {
    type: "confirm",
    name: "typescript",
    message: "Export a typescript file?",
    initial: defaults.typescript,
  },
];

module.exports = prompts;
